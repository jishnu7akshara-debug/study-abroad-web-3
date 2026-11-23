(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky nav shadow */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  /* Split-flap departures board: triggers when scrolled into view */
  const boardEl = document.querySelector('.board');
  const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const cells = [...document.querySelectorAll('[data-flap]')];
  const width = (cell) => cell.parentElement.children[0] === cell ? 9 : cell.parentElement.children[1] === cell ? 6 : 9;

  let boardAnimated = false;
  const tileMaps = [];

  cells.forEach((cell, ci) => {
    const target = cell.dataset.flap.padEnd(width(cell), ' ');
    cell.setAttribute('aria-label', cell.dataset.flap);
    cell.innerHTML = '';
    const tiles = [...target].map((ch) => {
      const t = document.createElement('span');
      t.className = 'flap' + (ch === ' ' ? ' flap--sp' : '');
      t.setAttribute('aria-hidden', 'true');
      t.textContent = reduceMotion ? ch : ' ';
      cell.appendChild(t);
      return { el: t, ch };
    });
    tileMaps.push({ cell, ci, tiles });
  });

  const animateBoard = () => {
    if (boardAnimated || reduceMotion) return;
    boardAnimated = true;

    tileMaps.forEach(({ ci, tiles }) => {
      const rowIndex = Math.floor(ci / 3);
      tiles.forEach(({ el, ch }, i) => {
        if (ch === ' ') return;
        const end = CHARS.indexOf(ch);
        let step = 0;
        const spins = 6 + Math.floor(Math.random() * 8) + i;
        const start = 180 + rowIndex * 140 + i * 24;
        setTimeout(() => {
          const timer = setInterval(() => {
            step++;
            if (step >= spins) { el.textContent = ch; clearInterval(timer); return; }
            el.textContent = CHARS[(end - spins + step + CHARS.length * 4) % CHARS.length];
          }, 45);
        }, start);
      });
    });
  };

  if (!reduceMotion && boardEl && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateBoard();
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(boardEl);
  } else {
    animateBoard();
  }

  /* Video: pause control, and pause when off-screen */
  const video = document.querySelector('.takeoff__video');
  const pauseBtn = document.querySelector('.takeoff__pause');
  let userPaused = reduceMotion;
  if (reduceMotion) { video.removeAttribute('autoplay'); video.pause(); }
  const syncBtn = () => {
    pauseBtn.textContent = video.paused ? 'Play video' : 'Pause video';
    pauseBtn.setAttribute('aria-pressed', String(video.paused));
  };
  pauseBtn.addEventListener('click', () => {
    if (video.paused) { userPaused = false; video.play().catch(() => {}); }
    else { userPaused = true; video.pause(); }
  });
  video.addEventListener('play', syncBtn);
  video.addEventListener('pause', syncBtn);
  syncBtn();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !userPaused) video.play().catch(() => {});
      else if (!entry.isIntersecting) video.pause();
    }, { threshold: 0.2 }).observe(video);
  }

  /* Visa desk tabs (arrow-key navigable) */
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus(); select(next);
    });
  });

  /* Student stories */
  const quotes = [...document.querySelectorAll('.quotes blockquote')];
  const count = document.querySelector('.quotes__count');
  let qi = 0;
  const showQuote = (n) => {
    qi = (n + quotes.length) % quotes.length;
    quotes.forEach((q, i) => q.classList.toggle('is-active', i === qi));
    count.textContent = `${qi + 1} of ${quotes.length}`;
  };
  document.querySelectorAll('.qbtn').forEach((b) => b.addEventListener('click', () => showQuote(qi + Number(b.dataset.dir))));
  showQuote(0);

  /* Booking form (front-end only; connect to your CRM or form endpoint) */
  const form = document.getElementById('book-form');
  const check = (input) => {
    const field = input.closest('.field');
    const ok = input.checkValidity() && input.value.trim() !== '';
    field.classList.toggle('has-error', !ok);
    field.querySelector('.field__err').hidden = ok;
    return ok;
  };
  form.querySelectorAll('input[required]').forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) check(input); });
    input.addEventListener('input', () => { if (input.closest('.field').classList.contains('has-error')) check(input); });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = [...form.querySelectorAll('input[required]')];
    const results = required.map(check);
    const firstBad = required[results.indexOf(false)];
    if (firstBad) { firstBad.focus(); return; }
    const data = Object.fromEntries(new FormData(form));
    data.country = [...form.querySelectorAll('input[name="country"]:checked')].map((c) => c.value);
    console.log('Counselling request', data);
    form.querySelector('[data-name]').textContent = data.name.trim().split(' ')[0];
    const done = form.querySelector('.form__done');
    done.hidden = false;
    done.setAttribute('tabindex', '-1');
    done.focus();
  });
})();
