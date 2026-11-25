/* =========================================================
   Coliving Capitolio — habitaciones, disponibilidad, galería
   ========================================================= */
(function () {
  const D = window.CAPITOLIO;
  const C = window.TRIBU_CONFIG;
  const hasGsap = typeof window.gsap !== "undefined" && !document.documentElement.classList.contains("reduced");
  const money = (n) => "$" + Number(n).toLocaleString("es-CO");
  const $ = (s, r) => (r || document).querySelector(s);

  /* ---------- 1. Leer disponibilidad desde Google Sheets ---------- */
  function parseCSV(text) {
    const rows = []; let row = [], cur = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
      else cur += c;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

  async function loadSheet() {
    if (!C.sheetId) return;
    const url = "https://docs.google.com/spreadsheets/d/" + C.sheetId + "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(C.sheetTab || "Capitolio");
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const rows = parseCSV(await res.text()).filter((r) => r.some((c) => c.trim()));
      const head = rows.shift().map(norm);
      const col = (name) => head.findIndex((h) => h.indexOf(name) === 0);
      const iHab = col("habitacion"), iEst = col("estado"), iPre = col("precio"), iAir = col("airbnb");
      rows.forEach((r) => {
        const id = String(r[iHab] || "").replace(/\D/g, "");
        const room = D.rooms.find((x) => x.id === id);
        if (!room) return;
        if (iEst > -1 && r[iEst]) { const e = norm(r[iEst]); room.estado = e.indexOf("disp") === 0 ? "disponible" : e.indexOf("pront") === 0 ? "pronto" : "ocupada"; }
        if (iPre > -1 && r[iPre]) { const p = parseInt(String(r[iPre]).replace(/\D/g, ""), 10); if (p) room.precio = p; }
        if (iAir > -1 && r[iAir] && /^https?:\/\//.test(r[iAir].trim())) room.airbnb = r[iAir].trim();
      });
    } catch (e) {
      console.warn("No se pudo leer la hoja de disponibilidad, se usan los datos locales.", e);
    }
  }

  /* ---------- 2. Pintar habitaciones ---------- */
  const grid = $("#rooms");
  let filter = "todas";

  function card(r) {
    const ok = r.estado === "disponible", soon = r.estado === "pronto";
    const msg = ok
      ? `Hola TribuKR, me interesa la habitación ${r.id} del Coliving Capitolio (${money(r.precio)}/mes). ¿Está disponible para visitarla?`
      : soon
      ? `Hola TribuKR, vi que la habitación ${r.id} del Coliving Capitolio se libera pronto (${money(r.precio)}/mes). ¿Desde qué fecha estaría disponible? Me gustaría apartarla.`
      : `Hola TribuKR, vi que la habitación ${r.id} del Coliving Capitolio está ocupada. ¿Me avisan cuando se libere?`;
    const bano = r.bano === "privado" ? "Baño privado" : `Baño compartido con la ${r.con}`;
    const air = r.airbnb || "";
    return `
      <article class="room ${ok ? "" : soon ? "is-soon" : "is-busy"}" data-id="${r.id}">
        <div class="room__img" data-open="${r.id}" role="button" tabindex="0" aria-label="Ver fotos de la habitación ${r.id}">
          <img src="${D.img(r.fotos[0])}" alt="Habitación ${r.id}" loading="lazy" />
          <span class="pill ${ok ? "pill--ok" : soon ? "pill--pronto" : "pill--busy"}"><span class="d"></span>${ok ? "Disponible" : soon ? "Pronto" : "Ocupada"}</span>
          <span class="room__num">${r.id}</span>
          <span class="room__count">${r.fotos.length} fotos</span>
        </div>
        <div class="room__body">
          <div class="room__tags">
            <span class="tag ${r.bano === "privado" ? "tag--hl" : ""}">${bano}</span>
            ${r.nota ? `<span class="tag tag--hl">${r.nota}</span>` : ""}
            <span class="tag">Piso ${r.piso}</span>
          </div>
          <div class="room__price"><b>${money(r.precio)}</b><span>/ mes · servicios incluidos</span></div>
          <div class="room__actions">
            <button type="button" data-open="${r.id}">Ver fotos</button>
            <a class="wa" href="${window.waLink(msg)}" target="_blank" rel="noopener">${ok ? "La quiero" : soon ? "Apártala" : "Avísame"}</a>
            ${air ? `<a href="${air}" target="_blank" rel="noopener" style="grid-column:1/-1">Reservar en Airbnb</a>` : ""}
          </div>
        </div>
      </article>`;
  }

  function render() {
    const list = D.rooms.filter((r) => {
      if (filter === "todas") return true;
      if (filter === "disponibles") return r.estado === "disponible";
      if (filter === "privado") return r.bano === "privado";
      return String(r.piso) === filter;
    });
    if (!list.length) { grid.innerHTML = `<p class="empty">No hay habitaciones con ese filtro en este momento. Escríbenos y te avisamos cuando se libere una.</p>`; return; }
    const floors = [...new Set(list.map((r) => r.piso))];
    grid.innerHTML = floors.map((p) => `
      <div class="floor-label"><b>Piso ${p}</b>${list.filter((r) => r.piso === p).length} habitaciones</div>
      <div class="rooms">${list.filter((r) => r.piso === p).map(card).join("")}</div>`).join("");

    const avail = D.rooms.filter((r) => r.estado === "disponible").length;
    document.querySelectorAll("[data-avail]").forEach((el) => (el.textContent = avail));

    if (hasGsap) {
      gsap.fromTo(grid.querySelectorAll(".room"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .05, ease: "power3.out", clearProps: "transform" });
      ScrollTrigger.refresh();
    }
  }

  document.querySelectorAll(".filters button").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll(".filters button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on"); filter = b.dataset.f; render();
    })
  );

  /* ---------- 3. Galería ---------- */
  const modal = $("#gallery");
  let cur = null, idx = 0;
  function show(i) {
    idx = (i + cur.fotos.length) % cur.fotos.length;
    $("#gStage").src = D.full(cur.fotos[idx]);
    $("#gCount").textContent = idx + 1 + " / " + cur.fotos.length;
    modal.querySelectorAll(".modal__thumbs img").forEach((t, k) => t.classList.toggle("on", k === idx));
  }
  function open(id) {
    cur = D.rooms.find((r) => r.id === id); if (!cur) return;
    $("#gTitle").textContent = "Habitación " + cur.id;
    $("#gThumbs").innerHTML = cur.fotos.map((f, k) => `<img src="${D.img(f)}" data-k="${k}" alt="" />`).join("");
    const ok = cur.estado === "disponible", soon = cur.estado === "pronto";
    const wa = $("#gWa");
    wa.href = window.waLink(`Hola TribuKR, me interesa la habitación ${cur.id} del Coliving Capitolio (${money(cur.precio)}/mes).`);
    wa.querySelector(".lbl").textContent = ok ? "La quiero" : soon ? "Apártala" : "Avísame cuando se libere";
    modal.classList.add("open"); document.body.style.overflow = "hidden"; window.__lenis && window.__lenis.stop();
    show(0);
  }
  function close() { modal.classList.remove("open"); document.body.style.overflow = ""; window.__lenis && window.__lenis.start(); }
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]"); if (o) return open(o.dataset.open);
    const t = e.target.closest(".modal__thumbs img"); if (t) return show(+t.dataset.k);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.matches && e.target.matches(".room__img")) open(e.target.dataset.open);
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
  });
  $("#gClose").addEventListener("click", close);
  $("#gPrev").addEventListener("click", () => show(idx - 1));
  $("#gNext").addEventListener("click", () => show(idx + 1));
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.classList.contains("modal__stage")) close(); });
  let sx = 0;
  modal.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  modal.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); });

  /* ---------- 4. Arranque ---------- */
  render();
  loadSheet().then(render);

  /* ---------- 5. Animaciones propias de la sede ---------- */
  function animations() {
    if (!hasGsap) return;

    // Entrada por la puerta: fachada → pasillo → adentro
    const door = $(".door");
    if (door) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: door, start: "top top", end: "+=260%", scrub: 1, pin: true, refreshPriority: 10 } });
      tl.to(".door__title", { opacity: 0, y: -60, duration: .25 }, 0)
        .to(".door .scroll-hint", { opacity: 0, duration: .1 }, 0)
        .to(".door__facade img", { scale: 3.2, duration: 1, ease: "power2.in" }, 0)
        .to(".door__facade", { opacity: 0, duration: .3 }, .7)
        .fromTo(".door__hall", { opacity: 0 }, { opacity: 1, duration: .3 }, .7)
        .fromTo(".door__hall img", { scale: 1.5 }, { scale: 2.6, duration: 1.1, ease: "power1.in" }, .7)
        .to(".door__hall", { opacity: 0, duration: .3 }, 1.55)
        .fromTo(".door__room", { opacity: 0 }, { opacity: 1, duration: .3 }, 1.55)
        .fromTo(".door__room img", { scale: 1.35 }, { scale: 1, duration: .8, ease: "power2.out" }, 1.55)
        .to(".door__welcome", { opacity: 1, duration: .3 }, 1.9)
        .from(".door__welcome .h2 > span", { yPercent: 100, opacity: 0, stagger: .06, duration: .3 }, 1.9)
        .to({}, { duration: .3 });
    }

    // Lista "incluye": cambia la foto según el ítem visible
    const incs = document.querySelectorAll(".inc");
    const pics = document.querySelectorAll(".include__media img");
    incs.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el, start: "top 60%", end: "bottom 60%",
        onToggle: (s) => {
          if (!s.isActive) return;
          incs.forEach((x) => x.classList.remove("on")); el.classList.add("on");
          pics.forEach((p, k) => p.classList.toggle("on", k === i));
        }
      });
    });

    // Zonas comunes: scroll horizontal
    const hs = $(".hscroll");
    if (hs && window.innerWidth > 860) {
      const track = hs.querySelector(".hscroll__track");
      const dist = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: hs, start: "center center", end: () => "+=" + dist(), scrub: 1, pin: true, invalidateOnRefresh: true, refreshPriority: 5 }
      });
    }
  }
  animations();
  if (hasGsap) { ScrollTrigger.sort(); ScrollTrigger.refresh(); }
})();
