/* =========================================================
   PIE DE PÁGINA LEGAL — igual en todas las páginas
   Se llena con los datos de config.js → legal
   ========================================================= */
(function () {
  const BASE = (document.currentScript && document.currentScript.src || "").replace(/assets\/js\/footer\.js.*$/, "");
  const L = (window.TRIBU_CONFIG && window.TRIBU_CONFIG.legal) || {};
  const val = (v, ph) => (v ? v : `<span class="todo">${ph}</span>`);

  // Rellenar datos en páginas legales: <span data-cfg="correo">
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const v = L[el.dataset.cfg];
    if (v) { el.textContent = v; el.classList.remove("todo"); }
  });

  const f = document.querySelector("footer.footer");
  if (!f) return;
  f.innerHTML = `
    <div class="wrap">
      <div class="footer__grid">
        <a class="brand" href="${BASE}"><img src="${BASE}assets/img/logo.svg" alt="" /><span>TRIBU KR<small>coliving</small></span></a>
        <span>Carrera 2B Este #72-35 · Tunja, Boyacá</span>
        <a data-wa="Hola TribuKR">WhatsApp 312 468 9603</a>
        ${L.correo ? `<a href="mailto:${L.correo}">${L.correo}</a>` : ""}
        <span>© <span data-year></span> TribuKR Coliving</span>
      </div>
      <nav class="footer__legal" aria-label="Información legal">
        <a href="${BASE}legal/privacidad.html">Política de tratamiento de datos</a>
        <a href="${BASE}legal/terminos.html">Términos y condiciones</a>
        <a href="${BASE}legal/cookies.html">Política de cookies</a>
        <a data-wa="Hola TribuKR, quiero presentar una petición, queja o reclamo.">PQRS</a>
      </nav>
      <p class="footer__note">
        Responsable: ${val(L.razonSocial, "[razón social]")} · NIT/C.C. ${val(L.nit, "[número]")}${L.rnt ? ` · RNT ${L.rnt}` : ""}.
        Al escribirnos por WhatsApp autorizas el tratamiento de tus datos según nuestra política de datos personales (Ley 1581 de 2012).
        TribuKR rechaza la explotación sexual y comercial de niños, niñas y adolescentes (Ley 679 de 2001 y Ley 1336 de 2009). Denuncia al 141 o al 123.
      </p>
    </div>`;
})();
