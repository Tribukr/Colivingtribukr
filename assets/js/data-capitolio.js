/* =========================================================
   DATOS — Coliving Capitolio
   Estado y precio se pueden sobrescribir desde la hoja de Google.
   estado: "disponible" | "ocupada"
   ========================================================= */
(function () {
  const img = (n) => "../img/capitolio/thumb/" + n + ".webp";
  const full = (n) => "../img/capitolio/full/" + n + ".webp";
  const seq = (p, count, cover) => {
    const list = [];
    for (let i = 1; i <= count; i++) list.push(p + "_" + String(i).padStart(2, "0"));
    if (cover) { const c = p + "_" + String(cover).padStart(2, "0"); list.splice(list.indexOf(c), 1); list.unshift(c); }
    return list;
  };

  const rooms = [
    { id: "101", piso: 1, bano: "compartido", con: "102", precio: 550000, nota: "", fotos: seq("h101", 8, 8) },
    { id: "102", piso: 1, bano: "compartido", con: "101", precio: 550000, nota: "", fotos: seq("h102", 8, 8) },
    { id: "103", piso: 1, bano: "privado", precio: 700000, nota: "Habitación grande", fotos: seq("h103", 4, 2) },
    { id: "104", piso: 1, bano: "privado", precio: 730000, nota: "Mejores especificaciones", fotos: seq("h104", 6, 3) },
    { id: "201", piso: 2, bano: "privado", precio: 700000, nota: "", fotos: seq("h201", 8, 7) },
    { id: "202", piso: 2, bano: "compartido", con: "203", precio: 650000, nota: "Habitación grande", fotos: seq("h202", 7, 7) },
    { id: "203", piso: 2, bano: "compartido", con: "202", precio: 550000, nota: "", fotos: ["h203_01", "h203_02", "h203_03", "h203_04", "h202_01", "h202_02", "h202_03"] },
    { id: "204", piso: 2, bano: "privado", precio: 700000, nota: "", fotos: seq("h204", 5, 4) },
    { id: "205", piso: 2, bano: "privado", precio: 730000, nota: "", fotos: seq("h205", 9, 7) },
    { id: "301", piso: 3, bano: "privado", precio: 730000, nota: "La más grande del coliving", fotos: seq("h301", 9, 8) },
    { id: "302", piso: 3, bano: "privado", precio: 600000, nota: "", fotos: ["h302_07", "h302_03", "h302_04", "h302_05", "h302_06", "h302_01", "h302_02"] },
    { id: "303", piso: 3, bano: "privado", precio: 730000, nota: "", fotos: seq("h303", 8, 7) },
    { id: "304", piso: 3, bano: "privado", precio: 730000, nota: "", fotos: seq("h304", 5, 5) }
  ].map((r) => Object.assign({ estado: "disponible", airbnb: "" }, r));

  window.CAPITOLIO = { rooms, img, full };
})();
