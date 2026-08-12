const COLORES_ESTADO = { Presente: "success", Ausente: "danger", Justificado: "warning", Tardanza: "info" };

registrarVista("asistencia", renderAsistencia);

function estadoDe(estudianteId, fecha) {
  const registro = DB.asistencia.find((a) => a.estudianteId === estudianteId && a.fecha === fecha);
  return registro ? registro.estado : "Presente";
}

function badgeEstado(estado) {
  return `<span class="badge text-bg-${COLORES_ESTADO[estado] || "secondary"}">${esc(estado)}</span>`;
}

function botonesEstado(estudiante, fecha) {
  const estado = estadoDe(estudiante.id, fecha);
  return Object.keys(COLORES_ESTADO).map((e) =>
    `<button class="btn btn-sm ${estado === e ? "btn-" + COLORES_ESTADO[e] : "btn-outline-" + COLORES_ESTADO[e]} btn-estado" data-estudiante="${estudiante.id}" data-estado="${e}">${e}</button>`
  ).join(" ");
}

function resumenAsistencia(estudiantes, fecha) {
  const total = estudiantes.length;
  const contar = (estado) => estudiantes.filter((e) => estadoDe(e.id, fecha) === estado).length;
  const chips = Object.keys(COLORES_ESTADO).map((e) => `<span class="badge text-bg-${COLORES_ESTADO[e]}">${e}: ${contar(e)}</span>`).join(" ");
  const presentes = contar("Presente") + contar("Justificado") + contar("Tardanza");
  const porcentaje = total ? Math.round((presentes / total) * 100) : 0;
  return `<div class="small fw-medium me-2">${porcentaje}% de asistencia</div>${chips}`;
}

function renderAsistencia() {
  const usuario = usuarioActual();
  if (usuario.rol === "docente") return vistaAsistenciaDocente();
  if (usuario.rol === "estudiante" || usuario.rol === "familia") return vistaAsistenciaEstudiante(usuario);
  return vistaAsistenciaGeneral();
}

function vistaAsistenciaDocente() {
  const usuario = usuarioActual();
  const estudiantes = DB.estudiantes.filter((e) => e.cursoId === usuario.cursoId);
  const contenedor = $("#vista-asistencia");
  const hoy = new Date().toISOString().slice(0, 10);

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Asistencia</h4>
    <p class="text-muted">Registro diario de asistencia · ${esc(nombreCursoPorId(usuario.cursoId))}</p>
    <div class="tarjeta p-3 mb-3 d-flex flex-wrap gap-2 align-items-center">
      <label class="fw-medium me-2">Fecha</label>
      <input type="date" class="form-control w-auto" id="fecha-asistencia" value="${hoy}">
      <div class="ms-auto d-flex flex-wrap gap-2 align-items-center" id="resumen-asistencia"></div>
    </div>
    <div class="tarjeta p-3 table-responsive" id="tabla-asistencia"></div>`;

  const dibujar = () => {
    const fecha = $("#fecha-asistencia").value;
    const filas = estudiantes.map((estudiante) =>
      `<tr><td>${esc(estudiante.nombre)}</td><td>${botonesEstado(estudiante, fecha)}</td></tr>`
    ).join("");
    $("#tabla-asistencia").innerHTML = estudiantes.length
      ? `<table class="table table-hover align-middle mb-0"><thead><tr><th>Estudiante</th><th>Estado</th></tr></thead><tbody>${filas}</tbody></table>`
      : cardVacio("No hay estudiantes en el curso.");
    $("#resumen-asistencia").innerHTML = resumenAsistencia(estudiantes, fecha);

    $$("#tabla-asistencia .btn-estado").forEach((btn) => btn.addEventListener("click", () => {
      const estudianteId = Number(btn.dataset.estudiante);
      const estado = btn.dataset.estado;
      let registro = DB.asistencia.find((a) => a.estudianteId === estudianteId && a.fecha === fecha);
      if (!registro) {
        registro = { id: nextId(DB.asistencia), estudianteId, fecha, estado };
        DB.asistencia.push(registro);
      }
      registro.estado = estado;
      guardarDatos();
      dibujar();
    }));
  };
  dibujar();
  $("#fecha-asistencia").addEventListener("change", dibujar);
}

function vistaAsistenciaGeneral() {
  const contenedor = $("#vista-asistencia");
  const hoy = new Date().toISOString().slice(0, 10);

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Asistencia</h4>
    <p class="text-muted">Consulta de asistencia por curso y fecha.</p>
    <div class="tarjeta p-3 mb-3 d-flex flex-wrap gap-2 align-items-center">
      <label class="fw-medium me-2">Curso</label>
      <select class="form-select w-auto" id="sel-curso-asis">${DB.cursos.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join("")}</select>
      <label class="fw-medium me-2 ms-3">Fecha</label>
      <input type="date" class="form-control w-auto" id="fecha-asis" value="${hoy}">
    </div>
    <div class="tarjeta p-3 table-responsive" id="tabla-asis"></div>`;

  const dibujar = () => {
    const cursoId = Number($("#sel-curso-asis").value);
    const fecha = $("#fecha-asis").value;
    const estudiantes = DB.estudiantes.filter((e) => e.cursoId === cursoId);
    const filas = estudiantes.map((estudiante) =>
      `<tr><td>${esc(estudiante.nombre)}</td><td>${badgeEstado(estadoDe(estudiante.id, fecha))}</td></tr>`
    ).join("");
    $("#tabla-asis").innerHTML = estudiantes.length
      ? `<table class="table table-hover align-middle mb-0"><thead><tr><th>Estudiante</th><th>Estado</th></tr></thead><tbody>${filas}</tbody></table><div class="d-flex flex-wrap gap-2 align-items-center mt-3">${resumenAsistencia(estudiantes, fecha)}</div>`
      : cardVacio("No hay estudiantes en el curso.");
  };
  dibujar();
  $("#sel-curso-asis").addEventListener("change", dibujar);
  $("#fecha-asis").addEventListener("change", dibujar);
}

function vistaAsistenciaEstudiante(usuario) {
  const contenedor = $("#vista-asistencia");
  const estudiante = DB.estudiantes.find((e) => e.id === usuario.estudianteId);
  const registros = DB.asistencia.filter((a) => a.estudianteId === usuario.estudianteId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 15);
  const porcentaje = asistenciaPorcentaje(usuario.estudianteId);

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Asistencia</h4>
    <p class="text-muted">${esc(estudiante ? estudiante.nombre : "")}</p>
    <div class="tarjeta p-3 mb-3">
      <span class="fs-4 fw-bold">${porcentaje}%</span> <span class="text-muted">de asistencia registrada</span>
    </div>
    <div class="tarjeta p-3 table-responsive">
      ${registros.length
        ? `<table class="table table-sm table-hover mb-0">
            <thead><tr><th>Fecha</th><th>Estado</th></tr></thead>
            <tbody>${registros.map((r) => `<tr><td>${formatearFecha(r.fecha)}</td><td>${badgeEstado(r.estado)}</td></tr>`).join("")}</tbody>
          </table>`
        : cardVacio("Sin registros de asistencia.")}
    </div>`;
}
