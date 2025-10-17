/* Responsive Chromebook-style Dino runner (simple) */
/* Controls: Space / Up to jump, Down to duck. Tap on mobile to jump. On death, overlay asks to try again. */

(function(){
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const go = document.getElementById('gameOver');
  const goScore = document.getElementById('goScore');
  const tryAgain = document.getElementById('tryAgain');
  const jumpBtn = document.getElementById('jumpBtn');

  // HiDPI setup
  function resizeCanvas(){
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * DPR);
    canvas.height = Math.round(rect.height * DPR);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // world
  const GROUND_Y = () => canvas.height / (window.devicePixelRatio || 1) - 28;
  let player = { x: 40, y: 0, w: 44, h: 44, vy:0, onGround:true, duck:false };
  let speed = 6; // base speed (pixels per frame scaled)
  let gravity = 1600; // px/s^2
  let obstacles = [];
  let spawnTimer = 0;
  let score = 0;
  let running = true;
  let lastTime = performance.now();
  let gameOver = false;
  let stepFrame = 0;

  function reset(){
    obstacles = [];
    spawnTimer = 0;
    score = 0;
    speed = 6;
    running = true;
    gameOver = false;
    player.y = GROUND_Y() - player.h;
    player.vy = 0;
    player.onGround = true;
    go.classList.add('hidden');
  }

  // spawn cactus-like obstacles
  function spawnObstacle(){
    const types = [
      {w:18,h:36}, {w:28,h:44}, {w:38,h:56}
    ];
    const t = types[Math.floor(Math.random()*types.length)];
    obstacles.push({ x: canvas.width / (window.devicePixelRatio || 1) + 20, y: GROUND_Y() - t.h, w: t.w, h: t.h });
  }

  function rectsOverlap(a,b){ return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

  function update(dt){
    if (!running) return;
    // score & speedup
    score += Math.floor(dt * 60 * 1.2);
    if (score % 100 === 0) speed = 6 + Math.floor(score / 200);

    spawnTimer += dt;
    const spawnInterval = Math.max(0.6, 1.6 - Math.min(1.0, score/1000));
    if (spawnTimer > spawnInterval){
      spawnTimer = 0;
      spawnObstacle();
      // occasional double gap
      if (Math.random() < 0.18) spawnObstacle();
    }

    // physics
    player.vy += gravity * dt;
    player.y += player.vy * dt;
    if (player.y + player.h >= GROUND_Y()){
      player.y = GROUND_Y() - player.h;
      player.vy = 0;
      player.onGround = true;
    } else player.onGround = false;

    // move obstacles
    const pxPerSec = speed * 60; // convert to px/sec reference
    for (let ob of obstacles) ob.x -= pxPerSec * dt;
    obstacles = obstacles.filter(o => o.x + o.w > -50);

    // collision
    for (let ob of obstacles){
      if (rectsOverlap(player, ob)){
        running = false;
        gameOver = true;
        setTimeout(()=> showGameOver(), 100);
      }
    }
  }

  function showGameOver(){
    go.classList.remove('hidden');
    goScore.textContent = 'Score: ' + score;
    tryAgain.focus();
  }

  function drawGround(){
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const groundY = GROUND_Y();
    // sky/ground split like chrome
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,w,h);
    // ground line with repeating ticks
    ctx.fillStyle = '#e9e9e9';
    ctx.fillRect(0, groundY + player.h, w, 8);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = - (Math.floor(stepFrame) % 20); x < w + 20; x += 20){
      ctx.moveTo(x, groundY + 8);
      ctx.lineTo(x + 10, groundY);
    }
    ctx.stroke();
  }

  function drawPlayer(){
    const p = player;
    // body
    ctx.fillStyle = '#111';
    const cornerRadius = 6;
    roundRect(ctx, p.x, p.y, p.w, p.h, cornerRadius, true);
    // eye
    ctx.fillStyle = '#fff';
    ctx.fillRect(p.x + p.w - 12, p.y + 8, 6, 6);
    // simple leg animation
    ctx.fillStyle = '#111';
    const legHeight = player.onGround ? 10 : 6;
    const legOffset = (Math.sin(stepFrame / 6) + 1) * 2;
    ctx.fillRect(p.x + 10, p.y + p.h - legHeight + (player.onGround ? legOffset : 0), 10, legHeight);
    ctx.fillRect(p.x + 24, p.y + p.h - legHeight + (player.onGround ? -legOffset : 0), 10, legHeight);
  }

  function drawObstacles(){
    ctx.fillStyle = '#111';
    for (let ob of obstacles){
      // cactus body with simple spikes
      roundRect(ctx, ob.x, ob.y, ob.w, ob.h, 4, true);
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.06;
      ctx.fillRect(ob.x + 2, ob.y + 6, ob.w * 0.6, ob.h * 0.12);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#111';
    }
  }

  function draw(){
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0,0,w,h);
    drawGround();
    drawPlayer();
    drawObstacles();
    // score top-right
    ctx.fillStyle = '#111';
    ctx.font = '16px monospace';
    ctx.fillText('' + score, w - 90, 24);
  }

  function loop(now){
    const dt = Math.min(0.05, (now - lastTime)/1000);
    lastTime = now;
    if (running){
      update(dt);
      stepFrame++;
      resizeCanvasIfNeeded();
      draw();
      scoreEl.textContent = score;
    }
    requestAnimationFrame(loop);
  }

  function resizeCanvasIfNeeded(){
    // ensure canvas has a sensible height vs width; prefers width, fixed height
    const shellRect = canvas.getBoundingClientRect();
    if (canvas.height !== Math.round(shellRect.height * (window.devicePixelRatio || 1)) ||
        canvas.width !== Math.round(shellRect.width * (window.devicePixelRatio || 1))){
      resizeCanvas();
      // re-place player on ground after resize
      player.y = GROUND_Y() - player.h;
    }
  }

  // utilities
  function roundRect(ctx, x, y, w, h, r, fill){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
  }

  // controls
  function jump(){
    if (gameOver) return;
    if (player.onGround){
      player.vy = -520; // jump impulse
      player.onGround = false;
    }
  }
  function restart(){
    reset();
    lastTime = performance.now();
  }

  // keyboard
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') { jump(); e.preventDefault(); }
    if (e.code === 'ArrowDown') { /* duck (not implemented) */ }
    if (e.code === 'Enter' && gameOver) { restart(); }
  });

  // mouse/canvas click
  canvas.addEventListener('mousedown', ()=> jump());
  // mobile jump large button
  jumpBtn.addEventListener('touchstart', (e)=> { e.preventDefault(); jump(); }, {passive:false});
  jumpBtn.addEventListener('click', ()=> jump());

  // try again
  tryAgain.addEventListener('click', ()=> restart());

  // initial placement and start
  reset();
  requestAnimationFrame(loop);

})();