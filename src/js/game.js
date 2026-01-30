/* Matrix-style Dino runner */
/* Controls: Space / Up to jump, Shift for Bullet Time. Tap on mobile to jump. */

(function(){
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const go = document.getElementById('gameOver');
  const goScore = document.getElementById('goScore');
  const tryAgain = document.getElementById('tryAgain');
  const jumpBtn = document.getElementById('jumpBtn');

  // Matrix Rain Setup
  const columns = Math.floor(canvas.width / 20);
  const drops = [];
  for (let x = 0; x < columns; x++) drops[x] = 1;

  function drawMatrixRain(dt, speedMultiplier) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = "15px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = String.fromCharCode(Math.random() * 128);
      ctx.fillText(text, i * 20, drops[i] * 20);

      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5 * speedMultiplier;
    }
  }

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
  let player = { x: 80, y: 0, w: 50, h: 60, vy:0, onGround:true };
  let speed = 7;
  let gravity = 1800; // px/s^2
  let obstacles = [];
  let spawnTimer = 0;
  let score = 0;
  let running = true;
  let lastTime = performance.now();
  let gameOver = false;
  let stepFrame = 0;
  let bulletTime = false;
  let timeScale = 1;

  function reset(){
    obstacles = [];
    spawnTimer = 0;
    score = 0;
    speed = 7;
    running = true;
    gameOver = false;
    timeScale = 1;
    bulletTime = false;
    player.y = GROUND_Y() - player.h;
    player.vy = 0;
    player.onGround = true;
    go.classList.add('hidden');
  }

  function spawnObstacle(){
    const types = [
      {w:30, h:70, type:'agent'}, 
      {w:60, h:40, type:'sentinel'},
      {w:20, h:50, type:'pill'}
    ];
    const t = types[Math.floor(Math.random()*types.length)];
    obstacles.push({ 
      x: canvas.width / (window.devicePixelRatio || 1) + 50, 
      y: GROUND_Y() - t.h - (t.type === 'sentinel' ? 40 : 0), // Sentinels fly
      w: t.w, h: t.h, type: t.type 
    });
  }

  function rectsOverlap(a,b){ return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

  function update(dt){
    if (!running) return;

    // Bullet time logic
    const targetScale = bulletTime ? 0.3 : 1.0;
    timeScale += (targetScale - timeScale) * 0.1;
    const effectiveDt = dt * timeScale;

    score += Math.floor(dt * 60);
    if (score % 200 === 0) speed = 7 + Math.floor(score / 500);

    spawnTimer += effectiveDt;
    const spawnInterval = Math.max(0.6, 1.8 - Math.min(1.2, score/2000));
    if (spawnTimer > spawnInterval){
      spawnTimer = 0;
      spawnObstacle();
    }

    // physics
    player.vy += gravity * effectiveDt;
    player.y += player.vy * effectiveDt;
    if (player.y + player.h >= GROUND_Y()){
      player.y = GROUND_Y() - player.h;
      player.vy = 0;
      player.onGround = true;
    } else player.onGround = false;

    // move obstacles
    const pxPerSec = speed * 60;
    for (let ob of obstacles) ob.x -= pxPerSec * effectiveDt;
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

  function drawPlayer(){
    const p = player;
    ctx.save();
    ctx.translate(p.x, p.y);
    
    // Neo Silhouette
    ctx.fillStyle = bulletTime ? '#0F0' : '#FFF';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#0F0';
    
    // Head
    ctx.fillRect(15, 0, 20, 15);
    // Body (Long Coat)
    ctx.fillRect(10, 15, 30, 40);
    // Legs
    const legOffset = (Math.sin(stepFrame / 4) + 1) * 3;
    ctx.fillRect(12, 55, 10, 5 - (player.onGround ? legOffset/2 : 0));
    ctx.fillRect(28, 55, 10, 5 - (player.onGround ? -legOffset/2 : 0));
    
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  function drawObstacles(){
    for (let ob of obstacles){
      ctx.save();
      ctx.translate(ob.x, ob.y);
      
      if (ob.type === 'agent') {
        ctx.fillStyle = '#f00'; // Red highlight for Smith
        ctx.fillRect(0, 0, ob.w, ob.h);
        ctx.fillStyle = '#000';
        ctx.fillRect(5, 5, ob.w - 10, ob.h - 10);
      } else if (ob.type === 'sentinel') {
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.ellipse(ob.w/2, ob.h/2, ob.w/2, ob.h/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f00';
        ctx.fillRect(ob.w/2 - 2, 5, 4, 4);
      } else {
        ctx.fillStyle = '#0F0';
        ctx.fillRect(0, 0, ob.w, ob.h);
      }
      
      ctx.restore();
    }
  }

  function draw(){
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    
    // Matrix background
    drawMatrixRain(0.016, timeScale);
    
    // Ground
    ctx.strokeStyle = '#0F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y());
    ctx.lineTo(w, GROUND_Y());
    ctx.stroke();

    drawPlayer();
    drawObstacles();
    
    if (bulletTime) {
      ctx.fillStyle = "rgba(0, 255, 65, 0.1)";
      ctx.fillRect(0, 0, w, h);
    }
  }

  function loop(now){
    const dt = Math.min(0.05, (now - lastTime)/1000);
    lastTime = now;
    if (running){
      update(dt);
      stepFrame += timeScale;
      draw();
      scoreEl.textContent = score;
    }
    requestAnimationFrame(loop);
  }

  // controls
  function jump(){
    if (gameOver) return;
    if (player.onGround){
      player.vy = -600;
      player.onGround = false;
    }
  }
  function restart(){
    reset();
    lastTime = performance.now();
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') { jump(); e.preventDefault(); }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { bulletTime = true; }
    if (e.code === 'Enter' && gameOver) { restart(); }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { bulletTime = false; }
  });

  canvas.addEventListener('mousedown', ()=> jump());
  jumpBtn.addEventListener('touchstart', (e)=> { e.preventDefault(); jump(); }, {passive:false});
  jumpBtn.addEventListener('click', ()=> jump());
  tryAgain.addEventListener('click', ()=> restart());

  reset();
  requestAnimationFrame(loop);
})();
