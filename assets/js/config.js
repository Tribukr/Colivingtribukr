/* =========================================================
   CONFIGURACIÓN GENERAL — TribuKR Coliving
   Aquí se cambia lo más común sin tocar el resto del código.
   ========================================================= */
window.TRIBU_CONFIG = {
  // WhatsApp principal (código de país + número, sin espacios ni +)
  whatsapp: "573124689603",

  // Hoja de Google con la disponibilidad de las habitaciones.
  // Pega aquí el ID de la hoja (lo que va entre /d/ y /edit en el enlace).
  // Si está vacío, la página usa los datos de assets/js/data-capitolio.js
  sheetId: "1JxnECj9Yzjh0KwhP8oDKXbPzbL4WL6XmRW7T9o7LjCI",

  // Nombre de la pestaña dentro de la hoja
  sheetTab: "Capitolio",

  // Enlaces de Airbnb (opcional). Si están vacíos, el botón no aparece.
  airbnb: {
    capitolio: "https://airbnb.com.co/h/tribukr" // enlace general del coliving en Airbnb
  },

  instagram: "", // ej: "https://instagram.com/tribukr"

  // DATOS LEGALES — llénalos y aparecen solos en el pie de página y en las páginas legales
  legal: {
    razonSocial: "Kelvin Octavio Robles López", // titular de TribuKR
    nit: "7183005",    // NIT o cédula
    correo: "tribukr@gmail.com", // correo para datos personales y reclamos
    rnt: ""            // no aplica: las estadías son de un mes o más
  }
};

window.waLink = function (msg) {
  const n = window.TRIBU_CONFIG.whatsapp;
  return "https://wa.me/" + n + "?text=" + encodeURIComponent(msg || "Hola TribuKR, quiero información sobre el coliving.");
};
