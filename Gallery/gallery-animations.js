/* ============================================================
   gallery-animations.js — SAMS Homes & Apartments / Gallery
   Premium GSAP ScrollTrigger — cinematic, luxury feel
   Requires: gsap, ScrollTrigger, SplitText (via CDN in gallery.html)
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── Global ease vocabulary ── */
const SILK   = "power4.out";
const SPRING = "elastic.out(1, 0.75)";
const EXPO   = "expo.out";

/* ── Custom cursor ── */
(function initCursor() {
  const cursor = document.createElement("div");
  cursor.id = "sams-cursor";
  cursor.innerHTML = `<div class="cur-dot"></div><div class="cur-ring"></div>`;
  document.body.appendChild(cursor);

  const dot  = cursor.querySelector(".cur-dot");
  const ring = cursor.querySelector(".cur-ring");

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    /* Dot is instant — zero lag */
    gsap.set(dot, { x: mx, y: my });
  });

  /* Ring follows with a light ease — 0.35 is snappy but still smooth */
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.35;
    ry += (my - ry) * 0.35;
    gsap.set(ring, { x: rx, y: ry });
  });

  /* Run ticker at full 120fps — no throttling */
  gsap.ticker.fps(120);

  /* Scale ring on hover of interactive elements */
  document.querySelectorAll("a, button, .blog-card, .gallery-big, .gallery-right-top, .gi").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      gsap.to(ring, { scale: 2.4, opacity: 0.5, duration: 0.35, ease: SILK })
    );
    el.addEventListener("mouseleave", () =>
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.35, ease: SILK })
    );
  });
})();

/* ── Inject cursor styles ── */
const cursorStyle = document.createElement("style");
cursorStyle.textContent = `
  * { cursor: none !important; }
  #sams-cursor { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; }
  .cur-dot  { position: absolute; width: 6px; height: 6px; background: #F97316;
              border-radius: 50%; transform: translate(-50%,-50%); }
  .cur-ring { position: absolute; width: 32px; height: 32px; border: 1.5px solid #F97316;
              border-radius: 50%; transform: translate(-50%,-50%); opacity: 0.75; }
`;
document.head.appendChild(cursorStyle);

/* ============================================================
   0. PAGE REVEAL — clip-path curtain wipe on load
   ============================================================ */
const bodyReveal = document.createElement("div");
bodyReveal.id = "page-curtain";
bodyReveal.style.cssText = `
  position:fixed;inset:0;background:#111;z-index:9990;
  transform-origin:top center;pointer-events:none;
`;
document.body.prepend(bodyReveal);

gsap.to(bodyReveal, {
  scaleY: 0,
  transformOrigin: "bottom center",
  duration: 1.1,
  ease: EXPO,
  delay: 0.15,
  onComplete: () => bodyReveal.remove(),
});

/* ============================================================
   1. NAV — slide + fade, with a subtle letterpress reveal
   ============================================================ */
gsap.from("nav", {
  y: -80,
  opacity: 0,
  duration: 1,
  ease: SILK,
  delay: 0.8,
});

gsap.from(".nav-brand", {
  opacity: 0,
  x: -20,
  duration: 0.9,
  ease: SILK,
  delay: 1.05,
});

gsap.from(".nav-links li", {
  opacity: 0,
  y: -14,
  duration: 0.6,
  stagger: 0.07,
  ease: SILK,
  delay: 1.1,
});

gsap.from(".nav-cta", {
  opacity: 0,
  scale: 0.8,
  duration: 0.5,
  ease: SPRING,
  delay: 1.45,
});

/* ============================================================
   2. PAGE HEADER — magazine-style split entrance
   ============================================================ */
gsap.from(".ph-left .section-badge", {
  opacity: 0,
  x: -40,
  duration: 0.8,
  ease: SILK,
  delay: 1.2,
});

gsap.from(".ph-divider", {
  scaleX: 0,
  transformOrigin: "left center",
  duration: 1,
  ease: EXPO,
  delay: 1.5,
});

/* Heading: each word flies in */
const h1Words = document.querySelectorAll(".ph-right h1");
h1Words.forEach((el) => {
  const text = el.innerHTML;
  const words = text.split(" ");
  el.innerHTML = words
    .map((w) => `<span class="word-wrap" style="display:inline-block;overflow:hidden;"><span class="word-inner" style="display:inline-block;">${w}</span></span> `)
    .join("");

  gsap.from(el.querySelectorAll(".word-inner"), {
    y: "110%",
    opacity: 0,
    duration: 0.85,
    stagger: 0.06,
    ease: SILK,
    delay: 1.3,
  });
});

gsap.from(".ph-right p", {
  opacity: 0,
  y: 28,
  duration: 0.75,
  ease: SILK,
  delay: 1.7,
});

/* ============================================================
   3. BLOG CARDS — 3D perspective tilt entrance + hover tilt
   ============================================================ */
gsap.set(".blog-card", { transformPerspective: 900 });

gsap.from(".blog-card", {
  scrollTrigger: {
    trigger: ".blog-row",
    start: "top 82%",
  },
  opacity: 0,
  y: 80,
  rotateX: 12,
  duration: 0.9,
  stagger: 0.14,
  ease: SILK,
});

/* 3D hover tilt on each card */
document.querySelectorAll(".blog-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rotY = ((e.clientX - cx) / rect.width) * 10;
    const rotX = -((e.clientY - cy) / rect.height) * 10;
    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      transformPerspective: 900,
      duration: 0.4,
      ease: "power2.out",
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: SILK,
    });
  });
});

/* ============================================================
   4. GALLERY WATERMARK — slow parallax drift
   ============================================================ */
gsap.to(".gallery-wm", {
  scrollTrigger: {
    trigger: ".gallery-section",
    start: "top bottom",
    end: "bottom top",
    scrub: 2,
  },
  y: -120,
  x: 40,
});

/* ============================================================
   5. GALLERY MOSAIC — cinematic staggered reveal
   ============================================================ */

/* Big image: mask wipe from bottom */
gsap.set(".gallery-big", { overflow: "hidden" });
gsap.from(".gallery-big img", {
  scrollTrigger: {
    trigger: ".gallery-grid",
    start: "top 78%",
  },
  scale: 1.18,
  y: 60,
  duration: 1.4,
  ease: SILK,
});

gsap.from(".gallery-big", {
  scrollTrigger: {
    trigger: ".gallery-grid",
    start: "top 78%",
  },
  clipPath: "inset(100% 0% 0% 0%)",
  duration: 1.2,
  ease: EXPO,
});

/* Right-side thumbnails: stagger cascade */
gsap.set(".gallery-right-top", { overflow: "hidden" });

gsap.from(".gallery-right-top", {
  scrollTrigger: {
    trigger: ".gallery-grid",
    start: "top 75%",
  },
  clipPath: "inset(0% 0% 100% 0%)",
  duration: 1,
  stagger: 0.18,
  ease: EXPO,
});

gsap.from(".gallery-right-top img", {
  scrollTrigger: {
    trigger: ".gallery-grid",
    start: "top 75%",
  },
  scale: 1.2,
  duration: 1.1,
  stagger: 0.18,
  ease: SILK,
});

/* ── Bottom row: each tile pops in from a different direction ── */
const bottomImgs = document.querySelectorAll(".gallery-bottom-row .gi");
const directions = [
  { x: -60, y: 0 },
  { x: 0,   y: 60 },
  { x: 60,  y: 0 },
];

gsap.set(bottomImgs, { overflow: "hidden" });

bottomImgs.forEach((gi, i) => {
  const img = gi.querySelector("img");
  gsap.from(gi, {
    scrollTrigger: {
      trigger: ".gallery-bottom-row",
      start: "top 85%",
    },
    opacity: 0,
    x: directions[i].x,
    y: directions[i].y,
    duration: 0.95,
    delay: i * 0.12,
    ease: SILK,
  });
  gsap.from(img, {
    scrollTrigger: {
      trigger: ".gallery-bottom-row",
      start: "top 85%",
    },
    scale: 1.15,
    duration: 1,
    delay: i * 0.12,
    ease: SILK,
  });
});

/* ── Gallery images — Ken Burns on hover ── */
document.querySelectorAll(".gallery-big img, .gallery-right-top img, .gi img").forEach((img) => {
  img.parentElement.addEventListener("mouseenter", () => {
    gsap.to(img, { scale: 1.07, duration: 0.7, ease: "power2.out" });
  });
  img.parentElement.addEventListener("mouseleave", () => {
    gsap.to(img, { scale: 1, duration: 0.7, ease: SILK });
  });
});

/* ── Scrub parallax on gallery images while scrolling ── */
document.querySelectorAll(".gallery-big img, .gallery-right-top img").forEach((img) => {
  gsap.to(img, {
    scrollTrigger: {
      trigger: img,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.8,
    },
    y: -30,
  });
});

/* ============================================================
   6. BROWSE BUTTON — spin + pulse entrance + continuous rotate
   ============================================================ */
gsap.from(".browse-btn", {
  scrollTrigger: {
    trigger: ".gallery-section",
    start: "top 40%",
  },
  scale: 0,
  rotation: -180,
  duration: 0.9,
  ease: SPRING,
});

/* Subtle slow spin on idle */
gsap.to(".browse-btn", {
  rotation: 360,
  duration: 14,
  repeat: -1,
  ease: "none",
  transformOrigin: "center center",
});

/* Hover: speed up spin */
const browseBtn = document.querySelector(".browse-btn");
if (browseBtn) {
  browseBtn.addEventListener("mouseenter", () => {
    gsap.to(browseBtn, { scale: 1.12, duration: 0.3, ease: SILK });
  });
  browseBtn.addEventListener("mouseleave", () => {
    gsap.to(browseBtn, { scale: 1, duration: 0.4, ease: SILK });
  });
}

/* ============================================================
   7. NEWSLETTER — reveal with a clip wipe + count-up effect
   ============================================================ */
const nlTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".newsletter",
    start: "top 80%",
  },
});

nlTl
  .from(".newsletter .section-badge", {
    opacity: 0,
    y: 22,
    duration: 0.55,
    ease: SILK,
  })
  .from(
    ".newsletter h2",
    {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: SILK,
    },
    "-=0.2"
  )
  .from(
    ".newsletter p",
    {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: SILK,
    },
    "-=0.4"
  )
  .from(
    ".email-form",
    {
      opacity: 0,
      y: 24,
      clipPath: "inset(0% 100% 0% 0%)",
      duration: 0.7,
      ease: EXPO,
    },
    "-=0.3"
  );

/* ============================================================
   8. FOOTER — staggered column rise + bottom wordmark scale
   ============================================================ */
gsap.from(".footer-grid > *", {
  scrollTrigger: {
    trigger: "footer",
    start: "top 88%",
  },
  opacity: 0,
  y: 50,
  duration: 0.7,
  stagger: 0.1,
  ease: SILK,
});

gsap.from(".footer-logo-box", {
  scrollTrigger: {
    trigger: ".footer-bottom",
    start: "top 92%",
  },
  opacity: 0,
  scale: 0.6,
  rotation: -8,
  duration: 0.8,
  ease: SPRING,
});

gsap.from(".footer-wordmark-sub", {
  scrollTrigger: {
    trigger: ".footer-bottom",
    start: "top 92%",
  },
  opacity: 0,
  letterSpacing: "20px",
  duration: 1,
  ease: SILK,
  delay: 0.2,
});

gsap.from(".footer-bottom p", {
  scrollTrigger: {
    trigger: ".footer-bottom",
    start: "top 95%",
  },
  opacity: 0,
  y: 14,
  duration: 0.55,
  ease: SILK,
});

/* ============================================================
   9. SCROLL PROGRESS BAR
   ============================================================ */
(function initProgressBar() {
  const bar = document.createElement("div");
  bar.id = "scroll-progress";
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:3px;width:0%;
    background:linear-gradient(90deg,#F97316,#ff9a50);
    z-index:9980;pointer-events:none;transition:none;
  `;
  document.body.appendChild(bar);

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      gsap.set(bar, { width: self.progress * 100 + "%" });
    },
  });
})();

/* ============================================================
   10. MAGNETIC NAV LINKS
   ============================================================ */
document.querySelectorAll(".nav-links a, .nav-cta").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.28;
    const dy = (e.clientY - cy) * 0.28;
    gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: SILK });
  });
});
