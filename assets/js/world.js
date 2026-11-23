/* =========================================================
   MUNDO TRIBUKR — sedes en órbita alrededor del logo
   Lee la lista de window.TRIBU_SEDES (assets/js/sedes.js)
   ========================================================= */
(function () {
  const world = document.getElementById("world");
  if (!world) return;
  const orbit = world.querySelector(".world__orbit");
  const pop = document.getElementById("worldPop");
  const sedes = window.TRIBU_SEDES || [];
  const hasGsap = typeof window.gsap !== "undefined" && !document.documentElement.classList.contains("reduced");

  // Posiciones: las sedes abiertas más cerca del centro y más grandes
  const n = sedes.length;
  const small = window.innerWidth < 700;
  sedes.forEach((s, i) => {
    const open = s.estado === "abierta";
    const angle = -135 + (360 / n) * i;               // empieza arriba a la izquierda
    const r = (open ? 0.66 : (i % 2 ? 0.86 : 0.78)) * (small ? 0.84 : 1); // distancia al centro (0–1)
    const d = open ? (small ? 108 : 168) : (small ? 64 : 96); // diámetro de la bolita

    const el = document.createElement("div");
    el.className = "planet " + (open ? "planet--open" : "planet--soon");
    el.style.setProperty("--a", angle + "deg");
    el.style.setProperty("--r", r);
    el.style.setProperty("--d", d + "px");
    el.innerHTML = `
      <div class="planet__float">
        <button class="planet__btn" type="button" data-sede="${s.id}" aria-label="${open ? "Entrar a " + s.nombre : s.nombre + ", próximamente"}">
          <span class="planet__ball">${open ? `<img src="${s.foto}" alt="" />` : `<span>${String(i + 1).padStart(2, "0")}</span>`}</span>
          <span class="planet__label">
            <b>${open ? s.nombre : s.nombre}</b>
            <small>${open ? s.barrio : "Próximamente"}</small>
            ${open ? `<span class="pill pill--ok tagline"><span class="d"></span>Abierta</span>` : ""}
          </span>
        </button>
      </div>`;
    orbit.appendChild(el);
  });

  /* --- clic en una sede --- */
  function enter(btn, sede) {
    world.classList.add("is-paused");
    if (!hasGsap) { location.href = sede.url; return; }
    const ball = btn.querySelector(".planet__ball").getBoundingClientRect();
    const warp = document.createElement("div");
    warp.className = "warp";
    warp.innerHTML = `<img src="${(innerWidth > 700 && sede.portada) || sede.foto.replace("/thumb/", "/full/")}" alt="" /><span>${sede.nombre}</span>`;
    Object.assign(warp.style, { left: ball.left + "px", top: ball.top + "px", width: ball.width + "px", height: ball.height + "px" });
    document.body.appendChild(warp);
    window.__lenis && window.__lenis.stop();
    let gone = false;
    const go = () => { if (gone) return; gone = true; try { sessionStorage.setItem("tribu-warp", "1"); } catch (e) {} location.href = sede.url; };
    setTimeout(go, 1600); // respaldo por si la animación no corre
    gsap.timeline({ onComplete: go })
      .to(warp, { left: 0, top: 0, width: innerWidth, height: innerHeight, borderRadius: 0, duration: 1, ease: "expo.inOut" })
      .from(warp.querySelector("img"), { scale: 1.6, duration: 1, ease: "expo.inOut" }, 0)
      .to(warp.querySelector("span"), { opacity: 1, duration: .35 }, .7)
      .to({}, { duration: .25 });
  }

  function soon(sede) {
    pop.querySelector("h4").textContent = sede.nombre;
    pop.querySelector("a").href = window.waLink(`Hola TribuKR, quiero que me avisen cuando abra la ${sede.nombre}.`);
    pop.classList.add("open");
    world.classList.add("is-paused");
  }
  function closePop() { pop.classList.remove("open"); world.classList.remove("is-paused"); }

  world.addEventListener("click", (e) => {
    const btn = e.target.closest(".planet__btn"); if (!btn) return;
    const sede = sedes.find((s) => s.id === btn.dataset.sede);
    if (sede.estado === "abierta") enter(btn, sede); else soon(sede);
  });
  pop.querySelector(".world-pop__x").addEventListener("click", closePop);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closePop());

  // Si el usuario vuelve con el botón "atrás", limpiar la transición
  window.addEventListener("pageshow", () => {
    document.querySelectorAll(".warp").forEach((w) => w.remove());
    world.classList.remove("is-paused");
    window.__lenis && window.__lenis.start();
  });

  /* --- las bolitas salen del centro al llegar a la sección --- */
  if (hasGsap) {
    const planets = world.querySelectorAll(".planet");
    gsap.set(planets, { "--k": 0, opacity: 0 });
    gsap.set(world.querySelectorAll(".world__rings circle:not(.dot)"), { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(".world__core img", { scale: .4, opacity: 0 });
    ScrollTrigger.create({
      trigger: world, start: "top 70%", once: true,
      onEnter: () => {
        gsap.timeline()
          .to(".world__core img", { scale: 1, opacity: 1, duration: .9, ease: "back.out(1.7)" })
          .to(world.querySelectorAll(".world__rings circle:not(.dot)"), { scale: 1, duration: 1.2, stagger: .12, ease: "expo.out" }, "-=.6")
          .to(planets, { "--k": 1, opacity: 1, duration: 1.3, stagger: .15, ease: "expo.out" }, "-=1");
      }
    });
  }
})();
