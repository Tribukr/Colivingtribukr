/* =========================================================
   TribuKR — animaciones compartidas
   Requiere: GSAP + ScrollTrigger + Lenis (cargados por CDN)
   ========================================================= */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  document.documentElement.classList.toggle("reduced", reduced || !hasGsap);

  // Ruta base del sitio (sirve igual en / , /capitolio/ y /legal/)
  const BASE = (document.currentScript && document.currentScript.src || "").replace(/assets\/js\/site\.js.*$/, "");
  const WA_ICON = '<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3 29l7.3-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.7 12.7-12.6C28.8 8.6 23 3 16 3zm5.8 15.2c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.9 1.1 3.4.9 4.1.8.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4z"/></svg>';

  /* ---- menú de celular: se arma con los enlaces del menú de escritorio ---- */
  const navEl = document.querySelector(".nav");
  const links = navEl && navEl.querySelector(".nav__links");
  if (navEl && links) {
    const burger = document.createElement("button");
    burger.className = "burger"; burger.type = "button"; burger.setAttribute("aria-label", "Abrir menú"); burger.setAttribute("aria-expanded", "false");
    burger.innerHTML = "<span></span><span></span><span></span>";
    const right = document.createElement("div"); right.className = "nav__right";
    const cta = navEl.querySelector(":scope > .btn");
    if (cta) right.appendChild(cta);
    right.appendChild(burger); navEl.appendChild(right);

    const m = document.createElement("div"); m.className = "mnav"; m.id = "mnav";
    const items = Array.from(links.querySelectorAll("a")).map((a) => `<a href="${a.getAttribute("href")}">${a.textContent}</a>`).join("");
    const home = document.body.dataset.page === "home" ? "" : `<a href="${BASE}">Inicio · Mundo TribuKR</a>`;
    m.innerHTML = `<nav class="mnav__links">${items}${home}</nav>
      <div class="mnav__foot">
        <a class="btn btn-sage" data-wa="Hola TribuKR, quiero información del coliving.">Escríbenos por WhatsApp <span class="dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
        <span>Tunja, Boyacá · 312 468 9603</span>
      </div>`;
    document.body.appendChild(m);
    const toggle = (open) => {
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    };
    burger.addEventListener("click", () => toggle(!document.body.classList.contains("menu-open")));
    // captura: se cierra el menú ANTES de que el scroll suave se mueva a la sección
    m.addEventListener("click", (e) => { if (e.target.closest("a")) toggle(false); }, true);
    document.addEventListener("keydown", (e) => e.key === "Escape" && toggle(false));
  }

  /* ---- barra fija abajo en celular: <body data-mbar="texto|#destino|mensaje WhatsApp"> ---- */
  if (document.body.dataset.mbar) {
    const [label, href, msg] = document.body.dataset.mbar.split("|");
    const bar = document.createElement("div"); bar.className = "mbar";
    bar.innerHTML = `<a class="a1" href="${href}">${label}</a><a class="a2" data-wa="${msg}">${WA_ICON} WhatsApp</a>`;
    document.body.appendChild(bar); document.body.classList.add("has-mbar");
    const showBar = () => bar.classList.toggle("show", window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", showBar, { passive: true }); showBar();
  }

  /* ---- aviso de cookies y mapa con consentimiento ---- */
  const CK = "tribu-cookies";
  const consent = () => { try { return localStorage.getItem(CK); } catch (e) { return null; } };
  const setConsent = (v) => { try { localStorage.setItem(CK, v); } catch (e) {} };
  function loadMaps() {
    document.querySelectorAll("iframe[data-src]").forEach((f) => { f.src = f.dataset.src; f.removeAttribute("data-src"); f.hidden = false; });
    document.querySelectorAll(".map-ph").forEach((p) => p.remove());
  }
  document.addEventListener("click", (e) => { if (e.target.closest("[data-load-map]")) loadMaps(); });
  if (consent() === "todas") loadMaps();
  if (!consent()) {
    const c = document.createElement("div"); c.className = "cookies"; c.setAttribute("role", "dialog"); c.setAttribute("aria-label", "Aviso de cookies");
    c.innerHTML = `<p>Usamos cookies técnicas para que la página funcione. Si aceptas, también cargamos el mapa de Google, que usa sus propias cookies. <a href="${BASE}legal/cookies.html">Más información</a></p>
      <div class="cookies__btns"><button class="ok" type="button" data-ck="todas">Aceptar</button><button type="button" data-ck="basicas">Solo necesarias</button></div>`;
    document.body.appendChild(c);
    requestAnimationFrame(() => setTimeout(() => c.classList.add("show"), 1800));
    c.addEventListener("click", (e) => {
      const b = e.target.closest("[data-ck]"); if (!b) return;
      setConsent(b.dataset.ck); if (b.dataset.ck === "todas") loadMaps();
      c.classList.remove("show"); setTimeout(() => c.remove(), 600);
    });
  }

  /* ---- enlaces de WhatsApp: <a data-wa="mensaje"> ---- */
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = window.waLink(a.getAttribute("data-wa"));
    a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---- nav: se esconde al bajar, aparece al subir ---- */
  const nav = document.querySelector(".nav");
  let lastY = 0;
  function onScroll(y) {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > lastY && y > 400);
    lastY = y;
  }

  if (!hasGsap || reduced) {
    window.addEventListener("scroll", () => onScroll(window.scrollY));
    const l = document.querySelector(".loader");
    if (l) l.remove();
    document.body.classList.remove("is-loading");
    document.dispatchEvent(new Event("tribu:ready"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---- scroll suave ---- */
  let lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", (e) => { ScrollTrigger.update(); onScroll(e.scroll); });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const t = document.querySelector(a.getAttribute("href"));
        if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -20 }); }
      })
    );
  } else {
    window.addEventListener("scroll", () => onScroll(window.scrollY));
  }

  /* ---- preloader ---- */
  // Si viene de la transición del mundo TribuKR, no se repite la pantalla de carga
  let fromWarp = false;
  try { fromWarp = sessionStorage.getItem("tribu-warp") === "1"; sessionStorage.removeItem("tribu-warp"); } catch (e) {}
  if (fromWarp) {
    const l = document.querySelector(".loader");
    if (l) l.remove();
    document.body.classList.remove("is-loading");
  }
  const loader = document.querySelector(".loader");
  function intro() { document.dispatchEvent(new Event("tribu:ready")); }
  if (loader) {
    lenis && lenis.stop();
    const bar = loader.querySelector(".loader__bar span");
    const pct = loader.querySelector("[data-pct]");
    const counter = { v: 0 };
    const imgs = Array.from(document.images).filter((im) => im.loading !== "lazy").slice(0, 8);
    let loaded = 0;
    const target = { v: 0 };
    const done = () => { loaded++; target.v = Math.round((loaded / Math.max(imgs.length, 1)) * 100); };
    imgs.forEach((im) => (im.complete ? done() : (im.addEventListener("load", done), im.addEventListener("error", done))));
    if (!imgs.length) target.v = 100;
    const minTime = 1.4;
    const start = performance.now();
    let finished = false;
    const tick = (force) => {
      if (finished) return;
      const t = force === true ? 99 : (performance.now() - start) / 1000;
      const cap = Math.min(target.v, Math.round((t / minTime) * 100));
      counter.v += (cap - counter.v) * 0.12;
      const v = Math.min(100, Math.round(counter.v + 0.4));
      bar.style.width = v + "%";
      if (pct) pct.textContent = String(v).padStart(3, "0") + "%";
      if ((v >= 100 && t >= minTime) || t > 3.2) {
        finished = true;
        gsap.ticker.remove(tick);
        gsap.timeline()
          .to(loader.querySelector(".loader__inner"), { y: -30, opacity: 0, duration: .6, ease: "power3.in" })
          .to(loader, { yPercent: -100, duration: .9, ease: "expo.inOut" }, "-=.1")
          .add(() => { loader.remove(); document.body.classList.remove("is-loading"); lenis && lenis.start(); ScrollTrigger.refresh(); }, "-=.35")
          .add(intro, "-=.55");
      }
    };
    gsap.ticker.add(tick);
    setTimeout(() => tick(true), 4000); // seguro: nunca se queda pegado
  } else {
    document.body.classList.remove("is-loading");
    intro();
  }

  /* ---- reveals ---- */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  /* ---- parallax: [data-speed] ---- */
  gsap.utils.toArray("[data-speed]").forEach((el) => {
    const s = parseFloat(el.dataset.speed);
    gsap.to(el, { yPercent: s * 100, ease: "none", scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* ---- texto que se ilumina palabra por palabra ---- */
  gsap.utils.toArray(".manifesto").forEach((p) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
            const s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(p);
    gsap.to(p.querySelectorAll(".w"), {
      opacity: 1, stagger: 0.08, ease: "none",
      scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 45%", scrub: true }
    });
  });

  /* ---- sección zoom: la imagen crece hasta pantalla completa ---- */
  gsap.utils.toArray(".zoom").forEach((sec) => {
    const frame = sec.querySelector(".zoom__frame");
    const img = frame.querySelector("img");
    const words = sec.querySelectorAll(".zoom__text .h2 > span");
    const l = sec.querySelector(".zoom__side.l"), r = sec.querySelector(".zoom__side.r");
    const small = window.innerWidth < 700 ? { w: 70, h: 40 } : { w: 34, h: 46 };
    const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: "top top", end: "+=180%", scrub: 1, pin: true, refreshPriority: 10 } });
    tl.fromTo(frame, { width: small.w + "vw", height: small.h + "vh", borderRadius: 28 }, { width: "100vw", height: "100vh", borderRadius: 0, ease: "power2.inOut" }, 0)
      .to(img, { scale: 1, ease: "power2.inOut" }, 0);
    if (l) tl.to(l, { xPercent: -140, opacity: 0, ease: "power2.in" }, 0);
    if (r) tl.to(r, { xPercent: 140, opacity: 0, ease: "power2.in" }, 0);
    if (words.length) tl.from(words, { yPercent: 120, opacity: 0, stagger: 0.08, ease: "power3.out", duration: .4 }, 0.55);
  });

  /* ---- contadores ---- */
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const o = { v: 0 };
    const fmt = (v) => (el.dataset.money ? "$" + Math.round(v).toLocaleString("es-CO") : Math.round(v));
    ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: "power3.out", onUpdate: () => (el.textContent = fmt(o.v) + (el.dataset.suffix || "")) })
    });
  });

  ScrollTrigger.sort();
  window.addEventListener("load", () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
})();
