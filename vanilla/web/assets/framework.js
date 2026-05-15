/* FRAMEWORK ENGINE — klipso_web vanilla — NO MODIFICAR */

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  gsap.defaults({ duration: 0.001 });
  gsap.globalTimeline.timeScale(20);
}

// ── LENIS ─────────────────────────────────────
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ── CURSOR ────────────────────────────────────
const cursorEl = document.querySelector('.cursor');
const dot      = document.getElementById('cursorDot');
const ring     = document.getElementById('cursorRing');
let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;

window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
window.addEventListener('mousedown', () => cursorEl.classList.add('cursor--click'));
window.addEventListener('mouseup',   () => cursorEl.classList.remove('cursor--click'));

(function tickCursor() {
  dx += (mx - dx) * 0.85; dy += (my - dy) * 0.85;
  rx += (mx - rx) * 0.1;  ry += (my - ry) * 0.1;
  dot.style.cssText  = `left:${dx}px;top:${dy}px`;
  ring.style.cssText = `left:${rx}px;top:${ry}px`;
  requestAnimationFrame(tickCursor);
})();

document.querySelectorAll('a, button, [data-magnetic], .card, .mag-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursorEl.classList.add('cursor--hover'));
  el.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor--hover'));
});

// ── MAGNETIC ──────────────────────────────────
function initMagnetic(selector, strength = 0.4) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width/2) * strength, y: (e.clientY - r.top - r.height/2) * strength, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.3)' });
    });
  });
}

// ── MODAL ─────────────────────────────────────
function initModalSystem() {
  const overlay  = document.getElementById('modalOverlay');
  const modal    = document.getElementById('modal');
  const closeBtn = document.getElementById('modalClose');
  const titleEl  = document.getElementById('modalTitle');
  const textEl   = document.getElementById('modalText');
  const labelEl  = document.getElementById('modalLabel');
  const ctaEl    = document.getElementById('modalCta');
  let isOpen = false;

  function openModal(title, text, imgSrc, label, caseUrl) {
    if (isOpen) return;
    isOpen = true;

    titleEl.textContent = title || '';
    textEl.textContent  = text  || '';
    if (labelEl) labelEl.textContent = label || '';
    if (ctaEl) {
      ctaEl.href = (caseUrl && caseUrl !== '#') ? caseUrl : '#';
      ctaEl.style.display = (caseUrl && caseUrl !== '#') ? '' : 'none';
    }

    const imgContainer = document.getElementById('modalImg');
    while (imgContainer.firstChild) imgContainer.removeChild(imgContainer.firstChild);

    if (imgSrc) {
      imgContainer.style.background = '#0a0a0a';
      const img = document.createElement('img');
      img.alt = title;
      img.style.opacity = '0';
      img.onload  = () => gsap.to(img, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      img.onerror = () => { imgContainer.style.background = ''; imgContainer.textContent = 'Proyecto'; };
      imgContainer.appendChild(img);
      img.src = imgSrc;
    } else {
      imgContainer.style.background = '';
      imgContainer.textContent = 'Proyecto';
    }

    lenis.stop();
    gsap.set(overlay, { visibility: 'visible' });
    gsap.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo(modal,
      { scale: 0.94, y: 28, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', onComplete() { closeBtn.focus(); } }
    );
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button,[href],input,[tabindex]:not([tabindex="-1"])');
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  }

  function closeModal() {
    if (!isOpen) return;
    gsap.to(modal,   { scale: 0.96, y: 16, opacity: 0, duration: 0.28, ease: 'power2.in' });
    gsap.to(overlay, { opacity: 0, duration: 0.32, ease: 'power2.in',
      onComplete() { gsap.set(overlay, { visibility: 'hidden' }); lenis.start(); isOpen = false; }
    });
  }

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openModal(
      card.dataset.modalTitle, card.dataset.modalText,
      card.dataset.modalImg || null, card.dataset.modalLabel, card.dataset.caseUrl
    ));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
  });

  document.querySelectorAll('.btn--panel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(btn.dataset.modalTitle, btn.dataset.modalText, btn.dataset.modalImg || null, '', '#');
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); return; }
    if (isOpen) trapFocus(e);
  });
}

// ── LOADER ────────────────────────────────────
function runLoader(onDone) {
  const loader = document.getElementById('loader');
  const numEl  = document.getElementById('loaderNum');
  const barEl  = document.getElementById('loaderBar');
  const obj    = { v: 0 };
  gsap.to(obj, {
    v: 100, duration: 2.2, ease: 'power2.inOut',
    onUpdate() { const n = Math.round(obj.v); numEl.textContent = n; barEl.style.width = n + '%'; },
    onComplete() {
      gsap.to(loader, { yPercent: -100, duration: 1.1, ease: 'power4.inOut', delay: 0.15,
        onComplete() { loader.remove(); onDone(); }
      });
    }
  });
}

// ── ANIMACIONES ───────────────────────────────
function initAnimations() {
  gsap.to('#nav', { yPercent: 0, duration: 1, ease: 'power3.out' });

  // Scroll-aware navbar: transparente → sólido al pasar 100px
  ScrollTrigger.create({
    start: 100,
    onEnter:     () => gsap.to('#nav', { backgroundColor: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)', duration: 0.4 }),
    onLeaveBack: () => gsap.to('#nav', { backgroundColor: 'transparent', backdropFilter: 'none', duration: 0.3 }),
  });

  // Hero SplitText
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    const split = SplitText.create(heroTitle, { type: 'lines', mask: 'lines' });
    gsap.from(split.lines, { yPercent: 105, duration: 1.1, stagger: 0.09, ease: 'power4.out', delay: 0.2 });
  }

  // Hero ScrambleText desde data-tagline
  const heroSub = document.getElementById('heroSub');
  if (heroSub && heroSub.dataset.tagline) {
    gsap.from(heroSub, { opacity: 0, duration: 0.01, delay: 0.6 });
    gsap.to(heroSub, {
      delay: 0.9, duration: 1.8,
      scrambleText: { text: heroSub.dataset.tagline, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,', revealDelay: 0.4, speed: 0.6 }
    });
  }

  // Marquee
  const track = document.getElementById('marqueeTrack');
  if (track) gsap.to(track, { x: -(track.scrollWidth / 2), duration: 28, ease: 'none', repeat: -1 });

  // Horizontal scroll
  const featContainer = document.getElementById('featuresContainer');
  const featTrack     = document.getElementById('featuresTrack');
  const panels        = document.querySelectorAll('.panel');
  if (featContainer && panels.length) {
    const totalSlide = (panels.length - 1) * window.innerWidth;
    gsap.to(featTrack, {
      x: () => -totalSlide, ease: 'none',
      scrollTrigger: { trigger: featContainer, pin: true, start: 'top top', end: () => '+=' + totalSlide, scrub: 1.2, invalidateOnRefresh: true }
    });
    // Dots en sync con el scroll horizontal
    const dotsEl = document.querySelectorAll('.features__dot');
    if (dotsEl.length) {
      ScrollTrigger.create({
        trigger: featContainer, start: 'top top', end: () => '+=' + totalSlide, scrub: true,
        onUpdate: (self) => {
          const active = Math.round(self.progress * (panels.length - 1));
          dotsEl.forEach((d, i) => d.classList.toggle('active', i === active));
        }
      });
    }
  }

  // BigText clip-path reveal
  document.querySelectorAll('.bigtext__line').forEach(line => {
    gsap.to(line, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: line, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  // DrawSVG
  const drawTrigger = { trigger: '.draw', start: 'top 78%' };
  gsap.from('#svgPath1', { drawSVG: '0%', duration: 2.2, ease: 'power2.out', scrollTrigger: drawTrigger });
  gsap.from('#svgPath2', { drawSVG: '0%', duration: 1.6, ease: 'power2.out', delay: 0.4, scrollTrigger: drawTrigger });
  gsap.from('#svgPath3', { drawSVG: '0%', duration: 1.6, ease: 'power2.out', delay: 0.8, scrollTrigger: drawTrigger });

  // Cards batch reveal
  gsap.set('.card', { clipPath: 'inset(0 0 100% 0)' });
  ScrollTrigger.batch('.card', {
    onEnter:     (batch) => gsap.to(batch, { clipPath: 'inset(0 0 0% 0)', stagger: 0.08, duration: 0.9, ease: 'power3.out' }),
    onLeaveBack: (batch) => gsap.to(batch, { clipPath: 'inset(0 0 100% 0)', stagger: 0.04, duration: 0.5 }),
    start: 'top 87%'
  });

  // CTA SplitText
  const ctaTitle = document.getElementById('ctaTitle');
  if (ctaTitle) {
    const ctaSplit = SplitText.create(ctaTitle, { type: 'lines', mask: 'lines' });
    gsap.from(ctaSplit.lines, { yPercent: 105, stagger: 0.1, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: ctaTitle, start: 'top 80%' }
    });
  }

  // CTA ScrambleText
  const ctaBtn  = document.getElementById('ctaBtn');
  const ctaText = document.getElementById('ctaBtnText');
  if (ctaBtn && ctaText) {
    ctaBtn.addEventListener('mouseenter', () => {
      gsap.to(ctaText, { duration: 0.9, scrambleText: { text: 'Escribeme →', chars: '01!@#', speed: 1 } });
    });
  }

  // Magnetic
  initMagnetic('[data-magnetic]', 0.45);
  initMagnetic('.mag-link', 0.3);

  // Scroll hint — rebota suavemente para invitar al usuario a scrollear
  gsap.to('.hero__scroll-hint', { y: 7, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2 });

  // Parallax badge
  gsap.to('.hero__badge', { y: -60, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Modal
  initModalSystem();
}

// ── BOOT ──────────────────────────────────────
runLoader(initAnimations);
