const COLORES_TIPO = { Examen: "danger", Evento: "primary", Actividad: "success", Reunión: "warning" };
const COLORES_MATERIAL = { PDF: "danger", Enlace: "info", Tarea: "warning" };

registrarVista("calendario", renderCalendario);
registrarVista("materiales", renderMateriales);
registrarVista("horarios", renderHorarios);

function tarjetaEvento(evento) {
  return `<div class="col-md-6 col-xl-4">
    <div class="tarjeta p-3 h-100">
      <div class="d-flex justify-content-between align-items-start gap-2">
        <span class="badge text-bg-${COLORES_TIPO[evento.tipo] || "secondary"}">${esc(evento.tipo)}</span>
        <small class="text-muted text-nowrap"><i class="bi bi-calendar3"></i> ${formatearFecha(evento.fecha)}</small>
      </div>
      <h6 class="mt-2 mb-1">${esc(evento.titulo)}</h6>
      <p class="text-muted small mb-0">${esc(evento.descripcion)}</p>
      ${evento.destino ? `<div class="text-muted small mt-1"><i class="bi bi-people"></i> ${esc(evento.destino)}</div>` : ""}
    </div>
  </div>`;
}

function renderCalendario() {
  const contenedor = $("#vista-calendario");
  const tipos = ["Todos", ...new Set(DB.calendario.map((c) => c.tipo))];

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Calendario de actividades y exámenes</h4>
    <p class="text-muted">Fechas de evaluaciones, actividades y eventos institucionales.</p>
    <div class="tarjeta p-3 mb-3 d-flex flex-wrap gap-2 align-items-center">
      <label class="fw-medium me-2">Filtrar</label>
      <select class="form-select w-auto" id="sel-filtro-calendario">${tipos.map((t) => `<option>${t}</option>`).join("")}</select>
    </div>
    <div class="row g-3" id="lista-calendario"></div>`;

  const dibujar = () => {
    const filtro = $("#sel-filtro-calendario").value;
    const eventos = DB.calendario.filter((c) => filtro === "Todos" || c.tipo === filtro)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
    $("#lista-calendario").innerHTML = eventos.length
      ? eventos.map(tarjetaEvento).join("")
      : cardVacio("Sin eventos para el filtro seleccionado.");
  };
  dibujar();
  $("#sel-filtro-calendario").addEventListener("change", dibujar);
}

function badgeMaterial(material) {
  return `<span class="badge text-bg-${COLORES_MATERIAL[material.tipo] || "secondary"}">${esc(material.tipo)}</span>`;
}

function tablaMateriales(items) {
  const usuario = usuarioActual();
  if (!items.length) return cardVacio("No hay materiales para esta materia.");
  const hayEntregas = items.some((m) => m.entrega === true);

  const filas = items.map((material) => {
    const materia = DB.materias.find((m) => m.id === material.materiaId);
    const esTarea = material.entrega === true;
    const entregada = esTarea && (DB.entregas || {})[`${usuario.email}:${material.id}`];

    let accion;
    if (esTarea && usuario.rol === "estudiante") {
      accion = `<button class="btn btn-sm ${entregada ? "btn-success" : "btn-outline-success"} btn-entregar" data-id="${material.id}">
        <i class="bi ${entregada ? "bi-check2-circle" : "bi-send"}"></i> ${entregada ? "Entregada" : "Entregar"}
      </button>`;
    } else if (esTarea) {
      accion = `<span class="text-muted small">${entregada ? "Entregada" : "Pendiente de entrega"}</span>`;
    } else {
      accion = `<button class="btn btn-sm btn-outline-primary btn-descargar" data-titulo="${esc(material.titulo)}"><i class="bi bi-download"></i> Descargar</button>`;
    }

    return `<tr>
      <td>
        <div class="fw-medium">${esc(material.titulo)}</div>
        <div class="text-muted small">${esc(materia ? materia.nombre : "")}</div>
      </td>
      <td>${badgeMaterial(material)}</td>
      <td class="text-muted">${formatearFecha(material.fecha)}</td>
      ${hayEntregas ? `<td class="text-muted small">${material.fechaEntrega ? "Vence: " + formatearFecha(material.fechaEntrega) : "—"}</td>` : ""}
      <td class="text-end text-nowrap">${accion}</td>
    </tr>`;
  }).join("");

  return `<table class="table table-hover align-middle mb-0">
    <thead><tr><th>Material</th><th>Tipo</th><th>Publicado</th>${hayEntregas ? "<th>Entrega</th>" : ""}<th></th></tr></thead>
    <tbody>${filas}</tbody>
  </table>`;
}

function renderMateriales() {
  const usuario = usuarioActual();
  const contenedor = $("#vista-materiales");

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Materiales y tareas</h4>
    <p class="text-muted">Recursos educativos y tareas por asignatura.</p>
    ${usuario.rol === "docente" ? `<div class="tarjeta p-3 mb-3"><h6 class="fw-semibold mb-3">Publicar material</h6>
      <form id="form-material" class="row g-2 align-items-end">
        <div class="col-md-5"><label class="form-label">Título</label><input required class="form-control" id="mat-titulo"></div>
        <div class="col-md-3"><label class="form-label">Tipo</label><select class="form-select" id="mat-tipo"><option>PDF</option><option>Enlace</option><option>Tarea</option></select></div>
        <div class="col-md-4"><label class="form-label">Fecha de entrega (solo tareas)</label><input class="form-control" type="date" id="mat-entrega"></div>
        <div class="col-12 text-end"><button class="btn btn-primary"><i class="bi bi-plus-circle"></i> Publicar</button></div>
      </form></div>` : ""}
    <div class="tarjeta p-3 mb-3 d-flex flex-wrap gap-2 align-items-center">
      <label class="fw-medium me-2">Materia</label>
      <select class="form-select w-auto" id="sel-materia-materiales">
        <option value="0">Todas</option>
        ${DB.materias.map((m) => `<option value="${m.id}">${esc(m.nombre)}</option>`).join("")}
      </select>
    </div>
    <div class="tarjeta p-3 table-responsive" id="tabla-materiales"></div>`;

  const dibujar = () => {
    const filtro = Number($("#sel-materia-materiales").value);
    const items = DB.materiales.filter((m) => !filtro || m.materiaId === filtro)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    $("#tabla-materiales").innerHTML = tablaMateriales(items);

    $$("#tabla-materiales .btn-descargar").forEach((btn) => btn.addEventListener("click", () => {
      notificar(`Descarga simulada de «${btn.dataset.titulo}».`, "info");
    }));

    $$("#tabla-materiales .btn-entregar").forEach((btn) => btn.addEventListener("click", () => {
      const entregas = DB.entregas || (DB.entregas = {});
      const clave = `${usuario.email}:${btn.dataset.id}`;
      entregas[clave] = !entregas[clave];
      guardarDatos();
      dibujar();
      notificar(entregas[clave] ? "Tarea entregada." : "Entrega anulada.");
    }));
  };
  dibujar();
  $("#sel-materia-materiales").addEventListener("change", dibujar);

  const formulario = $("#form-material");
  if (formulario) {
    formulario.addEventListener("submit", (event) => {
      event.preventDefault();
      const tipo = $("#mat-tipo").value;
      const fechaEntrega = $("#mat-entrega").value;
      if (tipo === "Tarea" && !fechaEntrega) {
        notificar("Indicá la fecha de entrega de la tarea.", "warning");
        return;
      }
      DB.materiales.push({
        id: nextId(DB.materiales),
        materiaId: usuario.materiaId,
        titulo: $("#mat-titulo").value.trim(),
        tipo,
        fecha: new Date().toISOString().slice(0, 10),
        ...(tipo === "Tarea" ? { entrega: true, fechaEntrega } : {})
      });
      guardarDatos();
      notificar("Material publicado.");
      renderMateriales();
    });
  }
}

function tablaHorario(cursoId) {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const bloques = [...new Set(DB.horarios.filter((h) => h.cursoId === cursoId).map((h) => h.hora))];
  if (!bloques.length) return cardVacio("Sin horario definido para el curso.");

  const celdas = (hora) => dias.map((dia) => {
    const horario = DB.horarios.find((h) => h.cursoId === cursoId && h.hora === hora && h.dia === dia);
    const materia = horario ? DB.materias.find((m) => m.id === horario.materiaId) : null;
    return horario
      ? `<td><div class="fw-medium small">${esc(materia ? materia.nombre : "")}</div><div class="text-muted small">${esc(horario.docente)} · Aula ${esc(horario.aula)}</div></td>`
      : `<td class="text-center text-muted">—</td>`;
  }).join("");

  return `<table class="table table-sm table-hover mb-0">
    <thead><tr><th>Hora</th>${dias.map((d) => `<th>${d}</th>`).join("")}</tr></thead>
    <tbody>${bloques.map((hora) => `<tr><td class="text-muted text-nowrap">${hora}</td>${celdas(hora)}</tr>`).join("")}</tbody>
  </table>`;
}

function renderHorarios() {
  const usuario = usuarioActual();
  const contenedor = $("#vista-horarios");
  const estudiante = usuario.estudianteId ? DB.estudiantes.find((e) => e.id === usuario.estudianteId) : null;
  const cursoFijo = usuario.rol === "docente" ? usuario.cursoId : (estudiante ? estudiante.cursoId : null);

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Horarios de clases</h4>
    <p class="text-muted">Distribución semanal por curso.</p>
    <div class="tarjeta p-3 mb-3 d-flex flex-wrap gap-2 align-items-center">
      <label class="fw-medium me-2">Curso</label>
      <select class="form-select w-auto" id="sel-curso-horario">${DB.cursos.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join("")}</select>
    </div>
    <div class="tarjeta p-3 table-responsive" id="tabla-horario"></div>`;

  const selector = $("#sel-curso-horario");
  if (cursoFijo) selector.value = cursoFijo;

  const dibujar = () => {
    $("#tabla-horario").innerHTML = tablaHorario(Number(selector.value));
  };
  dibujar();
  selector.addEventListener("change", dibujar);
}
