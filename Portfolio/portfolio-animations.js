/* ============================================================
   portfolio-animations.js — SAMS Homes & Apartments
   Cinematic, luxury-grade GSAP ScrollTrigger animations
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── Ease vocabulary ── */
const SILK = "power4.out";
const EXPO = "expo.out";
const SPRING = "elastic.out(1, 0.7)";
const CIRC = "circ.out";

/* ============================================================
   NOISE GRAIN OVERLAY — film-grain texture for luxury feel
   ============================================================ */
(function initGrain() {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  canvas.style.cssText = `
    position:fixed;inset:0;width:100%;height:100%;
    pointer-events:none;z-index:9970;opacity:0.032;
    mix-blend-mode:overlay;
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function drawGrain() {
    const img = ctx.createImageData(200, 200);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  drawGrain();
  setInterval(drawGrain, 80);
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const el = document.createElement("div");
  el.id = "ptf-cursor";
  el.innerHTML = `<div class="c-dot"></div><div class="c-ring"></div><div class="c-text"></div>`;
  document.body.appendChild(el);

  const style = document.createElement("style");
  style.textContent = `
    *{cursor:none!important}
    #ptf-cursor{position:fixed;top:0;left:0;pointer-events:none;z-index:9999}
    .c-dot{position:absolute;width:5px;height:5px;background:#F97316;border-radius:50%;
           transform:translate(-50%,-50%);transition:transform .1s}
    .c-ring{position:absolute;width:38px;height:38px;border:1.5px solid rgba(249,115,22,0.7);
            border-radius:50%;transform:translate(-50%,-50%)}
    .c-text{position:absolute;transform:translate(-50%,-50%);font-size:10px;font-weight:900;
            letter-spacing:1px;color:#F97316;white-space:nowrap;opacity:0}
  `;
  document.head.appendChild(style);

  const dot = el.querySelector(".c-dot");
  const ring = el.querySelector(".c-ring");
  const txt = el.querySelector(".c-text");
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
  });

  gsap.ticker.fps(120);

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.35;
    ry += (my - ry) * 0.35;
    gsap.set(ring, { x: rx, y: ry });
    gsap.set(txt, { x: rx + 24, y: ry - 10 });
  });


  document.querySelectorAll("a, button, .cta-bar").forEach(el => {
    el.addEventListener("mouseenter", () =>
      gsap.to(ring, { scale: 1.6, borderColor: "#F97316", duration: .3, ease: SILK })
    );
    el.addEventListener("mouseleave", () =>
      gsap.to(ring, { scale: 1, borderColor: "rgba(249,115,22,0.7)", duration: .4, ease: SILK })
    );
  });
})();

/* ============================================================
   SCROLL PROGRESS — dual-line theatrical progress
   ============================================================ */
(function initProgress() {
  const wrap = document.createElement("div");
  wrap.style.cssText = `position:fixed;top:0;left:0;right:0;height:3px;z-index:9980;pointer-events:none;`;
  wrap.innerHTML = `
    <div id="prog-track" style="position:absolute;inset:0;background:rgba(249,115,22,0.15);"></div>
    <div id="prog-fill"  style="position:absolute;top:0;left:0;height:100%;width:0%;
         background:linear-gradient(90deg,#F97316 0%,#ffb347 100%);"></div>
  `;
  document.body.appendChild(wrap);

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: self => gsap.set("#prog-fill", { width: self.progress * 100 + "%" }),
  });
})();

/* ============================================================
   PAGE CURTAIN — liquid mercury wipe
   ============================================================ */
const curtain = document.createElement("div");
curtain.style.cssText = `
  position:fixed;inset:0;background:#0a0a0a;z-index:9990;
  transform-origin:bottom center;pointer-events:none;
`;
document.body.prepend(curtain);

const curtainTl = gsap.timeline({ delay: 0.05 });
curtainTl
  .to(curtain, { scaleY: 0, duration: 1.3, ease: "power4.inOut" })
  .set(curtain, { display: "none" });

/* ============================================================
   NAV ENTRANCE
   ============================================================ */
gsap.from("nav", {
  yPercent: -110,
  opacity: 0,
  duration: 1,
  ease: SILK,
  delay: 0.9,
});

gsap.from(".nav-brand", { x: -28, opacity: 0, duration: .9, ease: SILK, delay: 1.1 });
gsap.from(".nav-links li", {
  y: -16, opacity: 0, duration: .6,
  stagger: .065, ease: SILK, delay: 1.15,
});
gsap.from(".nav-cta", { scale: 0.75, opacity: 0, duration: .55, ease: SPRING, delay: 1.5 });

/* ============================================================
   PAGE HEADER — word-by-word theatrical entrance
   ============================================================ */
gsap.from(".ph-left .section-badge", {
  opacity: 0, x: -50, duration: .9, ease: SILK, delay: 1.2,
});

gsap.from(".ph-divider", {
  scaleX: 0, transformOrigin: "left center",
  duration: 1.1, ease: EXPO, delay: 1.45,
});

/* Split h1 into individual characters */
(function splitH1() {
  const h1 = document.querySelector(".ph-right h1");
  if (!h1) return;

  /* Flatten innerHTML to plain text preserving span class */
  const raw = h1.innerHTML;
  const temp = document.createElement("div");
  temp.innerHTML = raw;

  let charHTML = "";
  temp.childNodes.forEach(node => {
    if (node.nodeType === 3) {
      [...node.textContent].forEach(ch => {
        charHTML += ch === " "
          ? `<span style="display:inline-block;"> </span>`
          : `<span class="ch" style="display:inline-block;overflow:hidden;">
               <span class="chi" style="display:inline-block;">${ch}</span>
             </span>`;
      });
    } else if (node.nodeName === "SPAN") {
      [...node.textContent].forEach(ch => {
        charHTML += ch === " "
          ? `<span style="display:inline-block;"> </span>`
          : `<span class="ch ch-orange" style="display:inline-block;overflow:hidden;">
               <span class="chi" style="display:inline-block;color:var(--orange);">${ch}</span>
             </span>`;
      });
      charHTML += `<br>`;
    }
  });
  h1.innerHTML = charHTML;

  gsap.from(".ph-right h1 .chi", {
    yPercent: 120,
    opacity: 0,
    duration: .75,
    stagger: .022,
    ease: SILK,
    delay: 1.3,
  });
})();

gsap.from(".ph-right p", {
  opacity: 0, y: 30, duration: .75, ease: SILK, delay: 1.9,
});

/* ============================================================
   CAROUSEL — cinematic entrance + interactive polish
   ============================================================ */
gsap.from(".carousel-wrap", {
  clipPath: "inset(0% 100% 0% 0%)",
  duration: 1.3,
  ease: EXPO,
  delay: 1.6,
});

gsap.from(".carousel-wrap", {
  opacity: 0,
  duration: .5,
  delay: 1.6,
});

/* Slide labels animate on each navigation */
function animateSlideLabel() {
  const labels = document.querySelectorAll(".slide-label .title, .slide-label .sub");
  const tags = document.querySelectorAll(".slide-tags .tag");

  gsap.from(labels, {
    y: 22, opacity: 0, duration: .55,
    stagger: .1, ease: SILK,
  });
  gsap.from(tags, {
    y: -18, opacity: 0, scale: .85,
    duration: .5, stagger: .08, ease: SPRING,
  });
}

/* Override the existing move() to also animate label */
const origMove = window.move;
window.move = function (dir) {
  origMove(dir);
  setTimeout(animateSlideLabel, 100);
};

/* Run on load for first slide */
gsap.delayedCall(1.9, animateSlideLabel);

/* Carousel button hover pulse */
document.querySelectorAll(".carousel-btn").forEach(btn => {
  btn.addEventListener("mouseenter", () =>
    gsap.to(btn, { scale: 1.15, duration: .25, ease: SILK })
  );
  btn.addEventListener("mouseleave", () =>
    gsap.to(btn, { scale: 1, duration: .35, ease: SILK })
  );
});

/* ============================================================
   LUXURY SECTION — dramatic split reveal
   ============================================================ */

/* Watermark: slow scrub drift */
gsap.to(".luxury-wm", {
  scrollTrigger: {
    trigger: ".luxury-section",
    start: "top bottom",
    end: "bottom top",
    scrub: 2.5,
  },
  x: 160,
  y: -40,
});

/* Main image: clip-path iris open from center */
gsap.from(".luxury-img--main", {
  scrollTrigger: {
    trigger: ".luxury-section",
    start: "top 80%",
  },
  clipPath: "inset(20% 20% 20% 20% round 16px)",
  scale: 1.05,
  opacity: 0,
  duration: 1.4,
  ease: SILK,
});

/* Top-right image: slides in from the right */
gsap.from(".luxury-img--top", {
  scrollTrigger: {
    trigger: ".luxury-section",
    start: "top 78%",
  },
  clipPath: "inset(0% 100% 0% 0% round 16px)",
  opacity: 0,
  duration: 1.1,
  ease: EXPO,
  delay: 0.15,
});

/* Bottom-right image: slides in from below */
gsap.from(".luxury-img--bottom", {
  scrollTrigger: {
    trigger: ".luxury-section",
    start: "top 75%",
  },
  clipPath: "inset(100% 0% 0% 0% round 16px)",
  opacity: 0,
  duration: 1.1,
  ease: EXPO,
  delay: 0.3,
});

/* Ken Burns scrub on all luxury images while scrolling */
document.querySelectorAll(".luxury-img img").forEach((img, i) => {
  gsap.to(img, {
    scrollTrigger: {
      trigger: ".luxury-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.8 + i * 0.3,
    },
    y: -25 - i * 8,
    scale: 1.06,
  });
});

/* ============================================================
   TESTIMONIALS — magazine editorial entrance
   ============================================================ */

/* Heading: lines drop from above */
gsap.from(".test-header h2", {
  scrollTrigger: {
    trigger: ".testimonials",
    start: "top 80%",
  },
  y: 60,
  opacity: 0,
  duration: 1,
  ease: SILK,
});

/* Rating number counts up */
const ratingEl = document.querySelector('[style*="font-size:52px"]');
if (ratingEl) {
  const obj = { val: 0 };
  gsap.to(obj, {
    scrollTrigger: {
      trigger: ".testimonials",
      start: "top 75%",
    },
    val: 4.8,
    duration: 1.8,
    ease: "power2.out",
    onUpdate: () => { ratingEl.textContent = obj.val.toFixed(2); },
  });
}

/* "COMMENTS" label + review blurb: stagger from left */
gsap.from(".testimonials > div > div", {
  scrollTrigger: {
    trigger: ".testimonials",
    start: "top 75%",
  },
  opacity: 0,
  x: -40,
  duration: .8,
  stagger: .15,
  ease: SILK,
});

/* Quote: typewriter reveal via clip */
gsap.from(".test-quote", {
  scrollTrigger: {
    trigger: ".test-quote",
    start: "top 85%",
  },
  clipPath: "inset(0% 100% 0% 0%)",
  opacity: 0,
  duration: 1.1,
  ease: EXPO,
});

/* ============================================================
   CTA BAR — explosive entrance
   ============================================================ */
gsap.from(".cta-bar", {
  scrollTrigger: {
    trigger: ".cta-bar",
    start: "top 90%",
  },
  scaleX: 0,
  transformOrigin: "left center",
  duration: .9,
  ease: EXPO,
});

gsap.from(".cta-bar", {
  scrollTrigger: {
    trigger: ".cta-bar",
    start: "top 90%",
  },
  opacity: 0,
  duration: .3,
});

/* Subtle shimmer sweep on CTA bar */
(function ctaShimmer() {
  const shimmer = document.createElement("div");
  shimmer.style.cssText = `
    position:absolute;top:0;left:-100%;width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
    pointer-events:none;
  `;
  const bar = document.querySelector(".cta-bar");
  if (!bar) return;
  bar.style.position = "relative";
  bar.style.overflow = "hidden";
  bar.appendChild(shimmer);

  function loopShimmer() {
    gsap.fromTo(shimmer,
      { x: "-100%", opacity: 1 },
      {
        x: "280%", duration: 1.4, ease: "power2.inOut",
        onComplete: () => gsap.delayedCall(2.5, loopShimmer)
      }
    );
  }
  gsap.delayedCall(2, loopShimmer);
})();

/* ============================================================
   NEWSLETTER — layered entrance
   ============================================================ */
const nlTl = gsap.timeline({
  scrollTrigger: { trigger: ".newsletter", start: "top 80%" },
});
nlTl
  .from(".newsletter .section-badge", { opacity: 0, y: 24, duration: .55, ease: SILK })
  .from(".newsletter h2", { opacity: 0, y: 55, duration: .85, ease: SILK }, "-=0.2")
  .from(".newsletter p", { opacity: 0, y: 32, duration: .65, ease: SILK }, "-=0.4")
  .from(".email-form", {
    opacity: 0, scaleX: 0, transformOrigin: "left center",
    duration: .7, ease: EXPO,
  }, "-=0.35");

/* ============================================================
   FOOTER — orchestrated column reveal
   ============================================================ */
gsap.from(".footer-grid > *", {
  scrollTrigger: { trigger: "footer", start: "top 88%" },
  opacity: 0,
  y: 55,
  duration: .75,
  stagger: .1,
  ease: SILK,
});

gsap.from(".footer-logo-box", {
  scrollTrigger: { trigger: ".footer-bottom", start: "top 92%" },
  opacity: 0,
  scale: 0.5,
  rotation: -12,
  duration: .9,
  ease: SPRING,
});

gsap.from(".footer-wordmark-sub", {
  scrollTrigger: { trigger: ".footer-bottom", start: "top 92%" },
  opacity: 0,
  letterSpacing: "22px",
  duration: 1.1,
  ease: SILK,
  delay: .2,
});

/* ============================================================
   MAGNETIC NAV LINKS
   ============================================================ */
document.querySelectorAll(".nav-links a, .nav-cta").forEach(el => {
  el.addEventListener("mousemove", e => {
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.3;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
    gsap.to(el, { x: dx, y: dy, duration: .35, ease: "power2.out" });
  });
  el.addEventListener("mouseleave", () =>
    gsap.to(el, { x: 0, y: 0, duration: .55, ease: SILK })
  );
});

/* ============================================================
   SECTION LINE ACCENTS — orange rule draws in on each section
   ============================================================ */
document.querySelectorAll(".testimonials, .newsletter, .luxury-section").forEach(sec => {
  const line = document.createElement("div");
  line.style.cssText = `
    height:2px;background:var(--orange);width:0;
    margin-bottom:2px;border-radius:2px;
  `;
  sec.prepend(line);

  gsap.to(line, {
    scrollTrigger: { trigger: sec, start: "top 85%" },
    width: "60px",
    duration: .8,
    ease: EXPO,
  });
});

/* ============================================================
   AMBIENT PARALLAX on body scroll for depth
   ============================================================ */
gsap.to(".luxury-wm", {
  scrollTrigger: {
    trigger: ".luxury-section",
    start: "top center",
    end: "bottom top",
    scrub: 1.5,
  },
  opacity: 0,
});