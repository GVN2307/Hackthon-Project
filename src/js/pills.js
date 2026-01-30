// src/js/pills.js

document.addEventListener('DOMContentLoaded', () => {
  const red = document.getElementById('red-pill');
  const blue = document.getElementById('blue-pill');
  const confirm = document.getElementById('confirm');
  const confirmText = document.getElementById('confirm-text');
  const yes = document.getElementById('confirm-yes');
  const no = document.getElementById('confirm-no');

  const quotes = [
    "Fate, it seems, is not without a sense of irony.",
    "I'm trying to free your mind, Neo. But I can only show you the door.",
    "You have to let it all go, Neo. Fear, doubt, and disbelief.",
    "Free your mind."
  ];

  function typeWriter(el, text, speed = 30, cb) {
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      el.textContent += text[i++] || '';
      if (i > text.length) { clearInterval(t); if (cb) cb(); }
    }, speed);
    el.addEventListener('click', () => { if (i <= text.length) { clearInterval(t); el.textContent = text; if (cb) cb(); } }, { once: true });
  }

  function flashScreen(color, duration, cb) {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.background = color;
    flash.style.zIndex = '1000';
    flash.style.opacity = '1';
    flash.style.transition = `opacity ${duration}ms ease-out`;
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(flash);
        if (cb) cb();
      }, duration);
    }, 50);
  }

  red.addEventListener('click', () => {
    confirm.classList.remove('hidden');
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    typeWriter(confirmText, `\"${quote}\"\n\nYou take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes.`, 25);
    yes.onclick = () => {
      flashScreen('#ff1a1a', 500, () => {
        location.href = 'game.html';
      });
    };
  });

  no.addEventListener('click', () => { confirm.classList.add('hidden'); });

  blue.addEventListener('click', () => {
    flashScreen('#1a1aff', 500, () => {
      location.href = 'blue.html';
    });
  });

  confirm.addEventListener('click', (ev) => {
    if (ev.target === confirm) confirm.classList.add('hidden');
  });
});