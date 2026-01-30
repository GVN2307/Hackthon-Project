// src/js/pills.js

document.addEventListener('DOMContentLoaded', ()=> {
  const red = document.getElementById('red-pill');
  const blue = document.getElementById('blue-pill');
  const confirm = document.getElementById('confirm');
  const confirmText = document.getElementById('confirm-text');
  const yes = document.getElementById('confirm-yes');
  const no = document.getElementById('confirm-no');

  function typeWriter(el, text, speed=30, cb){
    el.textContent = '';
    let i = 0;
    const t = setInterval(()=> {
      el.textContent += text[i++] || '';
      if (i > text.length) { clearInterval(t); if (cb) cb(); }
    }, speed);
    el.addEventListener('click', ()=> { if (i <= text.length) { clearInterval(t); el.textContent = text; if (cb) cb(); }}, {once:true});
  }

  red.addEventListener('click', ()=> {
    confirm.classList.remove('hidden');
    typeWriter(confirmText, "You have selected the RED pill.\nAre you sure you want to continue to the prehistoric runner?", 28);
    yes.onclick = ()=> { location.href = 'game.html'; };
  });

  no.addEventListener('click', ()=> { confirm.classList.add('hidden'); });

  blue.addEventListener('click', ()=> { location.href = 'blue.html'; });

  confirm.addEventListener('click', (ev)=> {
    if (ev.target === confirm) confirm.classList.add('hidden');
  });
});