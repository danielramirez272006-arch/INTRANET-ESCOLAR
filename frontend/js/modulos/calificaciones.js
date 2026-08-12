registrarVista("calificaciones", renderCalificaciones);

function renderCalificaciones() {
  const usuario = usuarioActual();
  if (usuario.rol === "docente") return vistaCalificacionesDocente();
  if (usuario.rol === "estudiante" || usuario.rol === "familia") return vistaCalificacionesEstudiante(usuario);
  return vistaCalificacionesGeneral();
}

function notaFormateada(nota) {
  if (nota == null) return "—";
  return String(Number(nota).toFixed(1)).replace(/\.0$/, "");
}

function tablaNotasDocente(estudiantes, materiaId, periodoId) {
  if (!estudiantes.length) return cardVacio("No hay estudiantes en el curso.");
  const filas = estudiantes.map((estudiante) => {
    const registro = DB.calificaciones.find((c) => c.estudianteId === estudiante.id && c.materiaId === materiaId && c.periodoId === periodoId);
    const nota = registro && registro.nota != null ? registro.nota : "";
    return `<tr>
      <td>${esc(estudiante.nombre)}</td>
      <td class="text-center" style="width:150px">
        <input type="number" min="0" max="10" step="0.1" class="form-control form-control-sm nota-input mx-auto" value="${nota}"
          data-estudiante="${estudiante.id}" data-materia="${materiaId}" data-periodo="${periodoId}">
      </td>
    </tr>`;
  }).join("");
  return `<table class="table table-hover align-middle mb-0">
    <thead><tr><th>Estudiante</th><th class="text-center">Nota (0-10)</th></tr></thead>
    <tbody>${filas}</tbody>
  </table>`;
}

function vistaCalificacionesDocente() {
  const usuario = usuarioActual();
  const contenedor = $("#vista-calificaciones");
  const materia = DB.materias.find((m) => m.id === usuario.materiaId);
  const estudiantes = DB.estudiantes.filter((e) => e.cursoId === usuario.cursoId);

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Calificaciones</h4>
    <p class="text-muted">${esc(materia ? materia.nombre : "")} · ${esc(nombreCursoPorId(usuario.cursoId))}</p>
    <div class="tarjeta p-3 mb-3 d-flex flex-wrap gap-2 align-items-center">
      <label class="fw-medium me-2">Periodo</label>
      <select class="form-select w-auto" id="sel-periodo-calif">${DB.periodos.map((p) => `<option value="${p.id}">${p.nombre}</option>`).join("")}</select>
      <button class="btn btn-primary ms-auto" id="btn-guardar-notas"><i class="bi bi-save"></i> Guardar notas</button>
    </div>
    <div class="tarjeta p-3 table-responsive" id="contenedor-tabla-notas"></div>`;

  const dibujar = () => {
    const periodoId = Number($("#sel-periodo-calif").value);
    $("#contenedor-tabla-notas").innerHTML = tablaNotasDocente(estudiantes, usuario.materiaId, periodoId);
  };
  dibujar();
  $("#sel-periodo-calif").addEventListener("change", dibujar);

  $("#btn-guardar-notas").addEventListener("click", () => {
    const periodoId = Number($("#sel-periodo-calif").value);
    const pendientes = [];
    $$("#contenedor-tabla-notas input[type=number]").forEach((input) => {
      if (input.value === "") return;
      const valor = Number(input.value);
      if (!Number.isFinite(valor) || valor < 0 || valor > 10) pendientes.push(valor);
    });
    if (pendientes.length) {
      notificar("Hay notas fuera del rango permitido (0 a 10).", "warning");
      return;
    }
    $$("#contenedor-tabla-notas input[type=number]").forEach((input) => {
      const registro = DB.calificaciones.find((c) =>
        c.estudianteId === Number(input.dataset.estudiante)
        && c.materiaId === Number(input.dataset.materia)
        && c.periodoId === Number(input.dataset.periodo));
      const valor = input.value === "" ? null : Number(input.value);
      if (registro) registro.nota = valor;
    });
    guardarDatos();
    notificar("Notas guardadas correctamente.");
  });
}

function matrizNotas(cursoId, periodoId) {
  const estudiantes = DB.estudiantes.filter((e) => e.cursoId === cursoId);
  if (!estudiantes.length) return cardVacio("No hay estudiantes en el curso.");
  const filas = estudiantes.map((estudiante) => {
    const celdas = DB.materias.map((materia) => {
      const registro = DB.calificaciones.find((c) => c.estudianteId === estudiante.id && c.materiaId === materia.id && c.periodoId === periodoId);
      return `<td class="text-center">${notaFormateada(registro ? registro.nota : null)}</td>`;
    }).join("");
    return `<tr><td>${esc(estudiante.nombre)}</td>${celdas}</tr>`;
  }).join("");
  return `<table class="table table-sm table-hover mb-0">
    <thead><tr><th>Estudiante</th>${DB.materias.map((m) => `<th class="text-center">${esc(m.nombre)}</th>`).join("")}</tr></thead>
    <tbody>${filas}</tbody>
  </table>`;
}

function vistaCalificacionesGeneral() {
  const contenedor = $("#vista-calificaciones");
  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Calificaciones</h4>
    <p class="text-muted">Consulta general por curso y periodo.</p>
    <div class="tarjeta p-3 mb-3 d-flex flex-wrap gap-2 align-items-center">
      <label class="fw-medium me-2">Curso</label>
      <select class="form-select w-auto" id="sel-curso-consulta">${DB.cursos.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join("")}</select>
      <label class="fw-medium me-2 ms-3">Periodo</label>
      <select class="form-select w-auto" id="sel-periodo-consulta">${DB.periodos.map((p) => `<option value="${p.id}">${p.nombre}</option>`).join("")}</select>
    </div>
    <div class="tarjeta p-3 table-responsive" id="contenedor-matriz"></div>`;

  const dibujar = () => {
    const cursoId = Number($("#sel-curso-consulta").value);
    const periodoId = Number($("#sel-periodo-consulta").value);
    $("#contenedor-matriz").innerHTML = matrizNotas(cursoId, periodoId);
  };
  dibujar();
  $("#sel-curso-consulta").addEventListener("change", dibujar);
  $("#sel-periodo-consulta").addEventListener("change", dibujar);
}

function vistaCalificacionesEstudiante(usuario) {
  const contenedor = $("#vista-calificaciones");
  const estudiante = DB.estudiantes.find((e) => e.id === usuario.estudianteId);
  const filas = DB.materias.map((materia) => {
    const celdas = DB.periodos.map((periodo) => {
      const registro = DB.calificaciones.find((c) => c.estudianteId === usuario.estudianteId && c.materiaId === materia.id && c.periodoId === periodo.id);
      return `<td class="text-center">${notaFormateada(registro ? registro.nota : null)}</td>`;
    }).join("");
    return `<tr><td>${esc(materia.nombre)}</td>${celdas}</tr>`;
  }).join("");

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Calificaciones</h4>
    <p class="text-muted">${esc(estudiante ? estudiante.nombre : "")} · ${esc(nombreCursoPorId(estudiante ? estudiante.cursoId : null))}</p>
    <div class="tarjeta p-3 table-responsive">
      <table class="table table-sm table-hover mb-0">
        <thead><tr><th>Materia</th>${DB.periodos.map((p) => `<th class="text-center">${p.nombre}</th>`).join("")}</tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>`;
}
