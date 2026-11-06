(function () {
  const P = window.PROJECTS;
  const app = document.getElementById('app');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  let observers = [];
  const I = window.ICON, pill = window.pill;
  const TONE = { kash: 'sand', afriwork: 'pink', 'employer-research': 'dark', loop: 'blue' };
  const TAG_ICON = { 'Product design': 'pen', 'UX research': 'search', 'UI': 'layers', 'Design system': 'grid', 'Brand': 'star', 'UX audit': 'eye', 'Onboarding': 'user', 'Prototyping': 'play', 'Mobile': 'phone', 'Data analysis': 'chart', 'Marketplace': 'briefcase', 'Product strategy': 'layers', 'Web app': 'monitor', 'Interaction design': 'keyboard', 'Dark mode': 'moon' };
  const SNAP_ICON = { 'Role': 'user', 'My role': 'user', 'Platform': 'phone', 'Year': 'calendar', 'Status': 'clock', 'Company': 'briefcase', 'Method': 'search', 'Deliverable': 'play' };
  const GOAL_ICON = ['star', 'check', 'layers', 'eye'];
  const tagPills = (p, n) => p.tags.slice(0, n).map(t => pill(TAG_ICON[t], esc(t))).join('');

  /* ---------- pieces ---------- */
  function art(p) {
    const t = p.theme;
    if (p.cover.kind === 'stat')
      return `<div class="statart"><b style="color:${t.accent}">${esc(p.cover.big)}</b>${p.cover.text ? `<span>${esc(p.cover.text)}</span>` : ''}</div>`;
    if (p.cover.kind === 'phone')
      return `<div class="phones">${p.cover.imgs.map(s => `<img src="${s}" alt="" loading="lazy" decoding="async">`).join('')}</div>`;
    return `<img class="desk" src="${p.cover.imgs[0]}" alt="" loading="lazy" decoding="async">`;
  }

  function card(p) {
    return `<a class="pcard reveal" href="#${p.id}">
      <div class="pcard-tags">${tagPills(p, 3)}</div>
      <div class="pcard-art" style="background:${p.theme.bg};color:${p.theme.fg}">${art(p)}</div>
      <h3>${esc(p.title)} ${I('arrow')}</h3>
      <p>${esc(p.summary)}</p>
    </a>`;
  }

  function home() {
    document.title = 'Nahu Gebreamlak — Product designer';
    return `
    <section class="wrap hero">
      <h1 class="display reveal">I design ${pill('', 'mobile apps')} and ${pill('', 'web apps')} that feel easy to use.</h1>
      <p class="meta reveal">${pill('briefcase', 'Product designer at Afriwork')}${pill('pin', 'Addis Ababa · UTC+3')}</p>
      <p class="lead reveal">I turn messy problems into clear flows, screens and design systems, from the first sketch to the files developers build from.</p>
      <div class="actions reveal">
        <a class="btn" href="#kash">See my work</a>
        <a class="btn" href="#contact">Get in touch</a>
      </div>
    </section>
    <section class="wrap">
      <div class="sec-title reveal"><span class="icon-tile">${I('grid')}</span><h2 class="h2">Selected work</h2></div>
      <div class="cards">${P.map(card).join('')}</div>
    </section>
    <section class="wrap band">
      <div class="sec-title reveal"><span class="icon-tile">${I('layers')}</span><h2 class="h2">What I can do for you</h2></div>
      <div class="services">
        <div class="service reveal"><span class="icon-tile soft">${I('phone')}</span><div><h3>Mobile apps</h3><p>Flows, screens and clickable prototypes for iOS and Android.</p></div></div>
        <div class="service reveal"><span class="icon-tile soft">${I('monitor')}</span><div><h3>Web apps &amp; SaaS</h3><p>Dashboards and tools that work just as well with a keyboard.</p></div></div>
        <div class="service reveal"><span class="icon-tile soft">${I('grid')}</span><div><h3>Design systems</h3><p>Colours, type and components your team can build from.</p></div></div>
        <a class="service service-link reveal" href="/"><span class="icon-tile soft">${I('play')}</span><div><h3>Brand &amp; motion</h3><p>A logo and a launch video, so the product looks ready.</p></div><span class="btn">See it ↗</span></a>
      </div>
    </section>
    <div class="endspace"></div>`;
  }

  function about() {
    document.title = 'About — Nahu Gebreamlak';
    return `
    <section class="wrap about-hero">
      <h1 class="h1 reveal">Hi, I’m Nahu.</h1>
      <p class="meta reveal">${pill('briefcase', 'Product designer at Afriwork')}${pill('play', 'Brand &amp; motion')}${pill('pin', 'Addis Ababa · UTC+3')}</p>
      <p class="lead reveal">I’m a product designer at Afriwork, a hiring platform in Ethiopia, and I also design brands and motion for startups.</p>
    </section>
    <section class="wrap about-grid">
      <div class="card reveal">
        <p class="eyebrow">What drives the work</p>
        <div class="txt">
          <p>Most of what I design is used on mid-range phones, on slow internet, by people who are busy. That keeps me focused on plain words, few steps, and screens that explain themselves.</p>
          <p>Because I also do brand and motion, clients can work with one designer for the app, the look and the launch video.</p>
        </div>
        <p style="margin:28px 0 0"><a class="btn" href="/">Motion &amp; graphics portfolio ↗</a></p>
      </div>
      <div class="card reveal">
        <p class="eyebrow">How I work</p>
        <div class="steps">
          <div><span class="icon-tile soft">${I('search')}</span><p><b>Understand</b><span>Who uses it, what they’re trying to do, and what’s getting in the way.</span></p></div>
          <div><span class="icon-tile soft">${I('grid')}</span><p><b>Explore</b><span>Several directions side by side, so we choose with evidence, not taste.</span></p></div>
          <div><span class="icon-tile soft">${I('layers')}</span><p><b>Design every state</b><span>Not just the happy path: empty, loading, error, small screens and dark mode.</span></p></div>
          <div><span class="icon-tile soft">${I('send')}</span><p><b>Hand over</b><span>Organised files, a clickable prototype and notes developers can build from.</span></p></div>
        </div>
        <p style="margin:20px 0 0;color:var(--muted);font-size:.9375rem">Based in Addis Ababa (UTC+3), which overlaps with Europe all day and with US mornings.</p>
      </div>
    </section>`;
  }

  function gallery(g, id) {
    const items = g.items.map(([s, c], i) =>
      `<figure data-i="${i}"><img src="${s}" alt="${esc(c)}" loading="lazy" decoding="async"><figcaption>${esc(c)}</figcaption></figure>`).join('');
    if (g.items.length === 1) return `<div class="single ${g.kind} reveal" data-set="${id}">${items}</div>`;
    return `<div class="rail ${g.kind}" data-set="${id}" id="rail-${id}">${items}</div>`;
  }

  function block(s, n) {
    const hasRail = s.gallery && s.gallery.items.length > 1;
    return `
    <section class="block" id="s-${s.id}">
      <div class="block-head reveal">
        <div><h2 class="h2">${esc(s.title)}</h2></div>
        ${hasRail ? `<div class="paddles"><button class="btn btn-icon" type="button" data-rail="rail-${s.id}" data-dir="-1" aria-label="Scroll back">‹</button><button class="btn btn-icon" type="button" data-rail="rail-${s.id}" data-dir="1" aria-label="Scroll forward">›</button></div>` : ''}
      </div>
      ${s.html ? `<div class="txt reveal">${s.html}</div>` : ''}
      ${s.list ? `<div class="goals">${s.list.map(([b, t, ic], i) => `<div class="reveal"><span class="icon-tile soft">${I(ic || GOAL_ICON[i % GOAL_ICON.length])}</span><b>${esc(b)}</b><span>${esc(t)}</span></div>`).join('')}</div>` : ''}
      ${s.table ? `<table class="ptable reveal"><thead><tr><th>${s.table[0][0]}</th><th>${s.table[0][1]}</th></tr></thead><tbody>${s.table.slice(1).map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table>` : ''}
      ${s.swatches ? `<div class="swatches">${s.swatches.map(([a, h, u]) => `<div class="sw reveal"><i style="background:${h}"></i><b>${a}</b><span>${h}</span><em>${esc(u)}</em></div>`).join('')}</div>` : ''}
      ${s.stats ? `<div class="stats">${s.stats.map(([b, t]) => `<div class="reveal"><b>${b}</b><span>${esc(t)}</span></div>`).join('')}</div>` : ''}
      ${s.gallery ? gallery(s.gallery, s.id) : ''}
    </section>`;
  }

  function study(p) {
    document.title = `${p.title} — Nahu Gebreamlak`;
    const nx = P[(P.indexOf(p) + 1) % P.length];
    return `
    <nav class="subnav" id="subnav" aria-label="On this page">
      <strong>${esc(p.title)}</strong>
      ${p.sections.map(s => `<a href="#${p.id}" data-to="s-${s.id}">${esc(s.title.replace(/^Finding \d+: /, ''))}</a>`).join('')}
    </nav>
    <div class="wrap">
    <header class="cs-head" id="cs-head">
      <p class="crumb reveal"><a href="#work">Work</a><span>/</span><span>${esc(p.title)}</span></p>
      <p class="eyebrow reveal">${esc(p.kicker)}</p>
      <h1 class="h1 reveal">${esc(p.title)}</h1>
      <p class="lead reveal">${esc(p.summary)}</p>
      <div class="tags reveal">${tagPills(p, 99)}</div>
    </header>
      <div class="cs-hero reveal" style="background:${p.theme.bg};color:${p.theme.fg}">${art(p)}</div>
      <dl class="snapshot reveal">${p.snapshot.map(([k, v]) => `<div><dt>${I(SNAP_ICON[k] || 'check')}${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      ${p.sections.map(block).join('')}
      <a class="next reveal" href="#${nx.id}" style="background:${nx.theme.bg};color:${nx.theme.fg}">
        <div><p>Next case study</p><h3 class="h2">${esc(nx.title)}</h3></div>${I('arrow')}
      </a>
      <div class="endspace"></div>
    </div>`;
  }

  /* ---------- routing ---------- */
  function route() {
    const h = (location.hash || '#work').slice(1);
    if (h === 'contact') {
      if (!app.innerHTML) render('work');
      document.getElementById('contact').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' });
      return;
    }
    render(h);
    window.scrollTo(0, 0);
  }
  function render(h) {
    const p = P.find(x => x.id === h);
    app.innerHTML = p ? study(p) : h === 'about' ? about() : home();
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === (h === 'about' ? 'about' : 'work')));
    wire();
  }

  function wire() {
    observers.forEach(o => o.disconnect()); observers = [];
    // reveal
    const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => rv.observe(el));
    observers.push(rv);
    // sub-nav: appears once the header scrolls away; tracks the section in view
    const sub = document.getElementById('subnav');
    if (sub) {
      const head = document.getElementById('cs-head');
      const ho = new IntersectionObserver(([e]) => sub.classList.toggle('show', !e.isIntersecting), { rootMargin: '0px' });
      ho.observe(head); observers.push(ho);
      const links = [...sub.querySelectorAll('a')];
      const so = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => {
          const on = a.dataset.to === e.target.id;
          a.classList.toggle('on', on);
          if (on) sub.scrollTo({ left: a.offsetLeft - 120, behavior: reduce.matches ? 'auto' : 'smooth' });
        });
      }), { rootMargin: '-35% 0px -55% 0px' });
      document.querySelectorAll('.block').forEach(b => so.observe(b)); observers.push(so);
    }
    // paddles: disable at the ends
    document.querySelectorAll('.rail').forEach(r => {
      const upd = () => {
        const btns = document.querySelectorAll(`[data-rail="${r.id}"]`);
        if (btns.length < 2) return;
        const fits = r.scrollWidth <= r.clientWidth + 8;
        btns[0].parentElement.hidden = fits;
        btns[0].disabled = r.scrollLeft < 8;
        btns[1].disabled = r.scrollLeft + r.clientWidth > r.scrollWidth - 8;
      };
      r.addEventListener('scroll', upd, { passive: true }); upd();
      addEventListener('resize', upd, { passive: true });
      r.querySelectorAll('img').forEach(i => i.addEventListener('load', upd, { once: true }));
    });
  }

  /* ---------- clicks ---------- */
  document.addEventListener('click', e => {
    const to = e.target.closest('[data-to]');
    if (to) { e.preventDefault(); document.getElementById(to.dataset.to).scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' }); return; }
    const pd = e.target.closest('[data-rail]');
    if (pd) { const r = document.getElementById(pd.dataset.rail); r.scrollBy({ left: +pd.dataset.dir * r.clientWidth * 0.75, behavior: reduce.matches ? 'auto' : 'smooth' }); return; }
    const f = e.target.closest('[data-set] figure');
    if (f) openLb(f);
  });

  /* ---------- lightbox: grows out of the thumbnail and shrinks back into it ---------- */
  const lb = document.getElementById('lightbox'), img = lb.querySelector('.lb-stage img'), cap = lb.querySelector('.lb-cap'), count = lb.querySelector('.lb-count');
  let set = [], idx = 0, anim = null;

  function rectOf(el) { return el.querySelector('img').getBoundingClientRect(); }
  function flip(from, to, dir) {
    const sx = from.width / to.width, sy = from.height / to.height;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2), dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const start = `translate(${dx}px,${dy}px) scale(${sx},${sy})`;
    if (anim) anim.cancel();
    anim = img.animate(dir === 'in' ? [{ transform: start, opacity: .6 }, { transform: 'none', opacity: 1 }] : [{ transform: 'none', opacity: 1 }, { transform: start, opacity: .4 }],
      { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
    return anim.finished;
  }
  function show(i) {
    idx = (i + set.length) % set.length;
    const f = set[idx], t = f.querySelector('img');
    img.src = t.currentSrc || t.src; img.alt = t.alt; cap.textContent = f.querySelector('figcaption').textContent;
    count.textContent = set.length > 1 ? `${idx + 1} / ${set.length}` : '';
    lb.querySelector('.lb-prev').hidden = lb.querySelector('.lb-next').hidden = set.length < 2;
    return new Promise(res => { if (img.complete && img.naturalWidth) res(); else img.onload = res; }).then(() => {
      img.classList.toggle('tall', img.naturalHeight > img.naturalWidth * 1.6);
    });
  }
  function openLb(f) {
    set = [...f.parentElement.querySelectorAll('figure')];
    lb.hidden = false; document.body.style.overflow = 'hidden';
    show(set.indexOf(f)).then(() => {
      lb.querySelector('.lb-stage').scrollTop = 0;
      requestAnimationFrame(() => {
        lb.classList.add('open');
        if (!reduce.matches) flip(rectOf(f), img.getBoundingClientRect(), 'in');
      });
    });
    lb.querySelector('.lb-close').focus({ preventScroll: true });
  }
  function closeLb() {
    const f = set[idx], r = f && rectOf(f);
    lb.classList.remove('open');
    const visible = r && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
    const done = () => { if (anim) anim.cancel(); lb.hidden = true; document.body.style.overflow = ''; };
    if (!reduce.matches && visible) flip(r, img.getBoundingClientRect(), 'out').then(done, done); else setTimeout(done, 200);
  }
  function step(d) {
    if (anim) anim.cancel();
    img.animate([{ opacity: .3 }, { opacity: 1 }], { duration: reduce.matches ? 1 : 220, easing: 'ease-out' });
    show(idx + d);
    const r = set[idx].parentElement; // keep the rail in step with the viewer
    if (r.classList.contains('rail')) r.scrollTo({ left: set[idx].offsetLeft - parseFloat(getComputedStyle(r).scrollPaddingLeft || 0), behavior: 'auto' });
  }
  lb.querySelector('.lb-close').onclick = closeLb;
  lb.querySelector('.lb-prev').onclick = () => step(-1);
  lb.querySelector('.lb-next').onclick = () => step(1);
  lb.querySelector('.lb-scrim').onclick = closeLb;
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft' && set.length > 1) step(-1);
    if (e.key === 'ArrowRight' && set.length > 1) step(1);
  });
  // swipe between screens on touch
  let sx = null;
  lb.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') sx = e.clientX; });
  lb.addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50 && set.length > 1) step(dx < 0 ? 1 : -1); });

  /* ---------- misc ---------- */
  document.getElementById('copyEmail').onclick = async () => {
    let msg = 'Email copied';
    try { await navigator.clipboard.writeText('nahusenaygebreamlak@gmail.com'); } catch (_) { msg = 'nahusenaygebreamlak@gmail.com'; }
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  };
  document.getElementById('footHead').innerHTML = `Building an ${pill('', 'app')} or a ${pill('', 'website')}?`;
  addEventListener('hashchange', route);
  route();
})();
