registrarVista("reservas", renderReservas);

function recursoCard(recurso) {
  const icono = recurso.tipo === "Aula" ? "door-open" : recurso.tipo === "Laboratorio" ? "flask" : "easel";
  return `<div class="col-md-6 col-xl-4">
    <div class="tarjeta p-3 h-100">
      <div class="d-flex justify-content-between align-items-start">
        <i class="bi bi-${icono} fs-4 text-primary"></i>
        <span class="badge text-bg-secondary">${esc(recurso.tipo)}</span>
      </div>
      <h6 class="mt-2 mb-1">${esc(recurso.nombre)}</h6>
      <div class="text-muted small"><i class="bi bi-geo-alt"></i> ${esc(recurso.ubicacion)}</div>
      ${recurso.capacidad ? `<div class="text-muted small"><i class="bi bi-people"></i> ${recurso.capacidad} personas</div>` : ""}
    </div>
  </div>`;
}

function filaReserva(reserva) {
  const recurso = DB.recursos.find((r) => r.id === reserva.recursoId);
  const puedeCancelar = usuarioActual().rol === "docente" && usuarioActual().nombre === reserva.solicitante;
  return `<tr>
    <td>${esc(recurso ? recurso.nombre : "Recurso")}</td>
    <td>${formatearFecha(reserva.fecha)}</td>
    <td>${esc(reserva.hora)}</td>
    <td>${esc(reserva.solicitante)}</td>
    <td class="text-muted small">${esc(reserva.motivo)}</td>
    ${puedeCancelar ? `<td class="text-end"><button class="btn btn-sm btn-outline-danger btn-cancelar" data-id="${reserva.id}" title="Cancelar reserva"><i class="bi bi-x-circle"></i></button></td>` : ""}
  </tr>`;
}

function renderReservas() {
  const usuario = usuarioActual();
  const columnas = 6;
  const hoy = new Date().toISOString().slice(0, 10);
  const contenedor = $("#vista-reservas");

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Reserva de aulas y recursos</h4>
    <p class="text-muted">Aulas, laboratorios y equipos con confirmación de disponibilidad.</p>
    <div class="row g-3 mb-3">${DB.recursos.map(recursoCard).join("")}</div>
    <div class="tarjeta p-3 mb-3">
      <h6 class="fw-semibold mb-3">Nueva reserva</h6>
      <form id="form-reserva" class="row g-2 align-items-end">
        <div class="col-md-4"><label class="form-label">Recurso</label>
          <select class="form-select" id="res-recurso">${DB.recursos.map((r) => `<option value="${r.id}">${esc(r.nombre)}</option>`).join("")}</select>
        </div>
        <div class="col-md-3"><label class="form-label">Fecha</label><input required type="date" min="${hoy}" class="form-control" id="res-fecha"></div>
        <div class="col-md-3"><label class="form-label">Horario</label>
          <select class="form-select" id="res-hora">${["07:30-09:00", "09:15-10:45", "11:00-12:30", "14:00-15:30", "15:45-17:15"].map((h) => `<option>${h}</option>`).join("")}</select>
        </div>
        <div class="col-md-2"><button class="btn btn-primary w-100"><i class="bi bi-plus-circle"></i> Reservar</button></div>
        <div class="col-12"><label class="form-label">Motivo</label><input class="form-control" id="res-motivo" placeholder="Actividad a realizar"></div>
      </form>
    </div>
    <div class="tarjeta p-3 table-responsive">
      <h6 class="fw-semibold mb-3">Reservas registradas</h6>
      <table class="table table-sm align-middle mb-0">
        <thead><tr><th>Recurso</th><th>Fecha</th><th>Horario</th><th>Solicitante</th><th>Motivo</th><th></th></tr></thead>
        <tbody>${DB.reservas.length
          ? DB.reservas.slice().reverse().map(filaReserva).join("")
          : `<tr><td colspan="${columnas}" class="text-center text-muted py-4">Sin reservas registradas.</td></tr>`}</tbody>
      </table>
    </div>`;

  $("#form-reserva").addEventListener("submit", (event) => {
    event.preventDefault();
    const recursoId = Number($("#res-recurso").value);
    const fecha = $("#res-fecha").value;
    const hora = $("#res-hora").value;
    const motivo = $("#res-motivo").value.trim() || "Sin motivo especificado";
    const hoy = new Date().toISOString().slice(0, 10);
    if (fecha < hoy) {
      notificar("No se puede reservar en una fecha pasada.", "warning");
      return;
    }
    const conflicto = DB.reservas.some((r) => r.recursoId === recursoId && r.fecha === fecha && r.hora === hora);
    if (conflicto) {
      notificar("El recurso ya está reservado en ese horario.", "danger");
      return;
    }
    DB.reservas.push({ id: nextId(DB.reservas), recursoId, fecha, hora, solicitante: usuario.nombre, motivo });
    guardarDatos();
    renderReservas();
    notificar("Reserva confirmada.");
  });

  $$("#vista-reservas .btn-cancelar").forEach((btn) => btn.addEventListener("click", () => {
    DB.reservas = DB.reservas.filter((r) => r.id !== Number(btn.dataset.id));
    guardarDatos();
    renderReservas();
    notificar("Reserva cancelada.");
  }));
}
