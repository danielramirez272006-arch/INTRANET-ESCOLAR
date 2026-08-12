const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

registrarVista("inicio", renderInicio);

function promedioEstudiante(estudianteId) {
  const notas = DB.calificaciones.filter((c) => c.estudianteId === estudianteId && c.nota != null).map((c) => c.nota);
  if (!notas.length) return "—";
  return (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1);
}

function asistenciaPorcentaje(estudianteId) {
  const registros = DB.asistencia.filter((a) => a.estudianteId === estudianteId);
  if (!registros.length) return 0;
  const presentes = registros.filter((a) => a.estado === "Presente").length;
  return Math.round((presentes / registros.length) * 100);
}

function tarjetaResumen(icono, color, valor, etiqueta) {
  return `<div class="col-6 col-xl-3">
    <div class="tarjeta tarjeta-resumen p-3 d-flex align-items-center gap-3 h-100">
      <div class="icono-tarjeta text-bg-${color}"><i class="bi bi-${icono}"></i></div>
      <div class="min-w-0"><div class="fs-4 fw-bold">${valor}</div><div class="text-muted small">${etiqueta}</div></div>
    </div>
  </div>`;
}

function tarjetasInicio(usuario) {
  const hoy = new Date().toISOString().slice(0, 10);
  switch (usuario.rol) {
    case "docente":
      return tarjetaResumen("people", "primary", DB.estudiantes.filter((e) => e.cursoId === usuario.cursoId).length, "Estudiantes en el curso")
        + tarjetaResumen("clipboard-data", "success", DB.materias.length, "Materias")
        + tarjetaResumen("calendar2-check", "info", DB.asistencia.filter((a) => a.fecha === hoy).length, "Registros hoy")
        + tarjetaResumen("megaphone", "warning", DB.comunicados.length, "Comunicados");
    case "estudiante": {
      const promedio = promedioEstudiante(usuario.estudianteId);
      return tarjetaResumen("clipboard-data", "primary", promedio, "Promedio general")
        + tarjetaResumen("mortarboard", "success", DB.materias.length, "Materias")
        + tarjetaResumen("calendar-event", "info", DB.calendario.filter((c) => c.tipo === "Examen").length, "Evaluaciones")
        + tarjetaResumen("megaphone", "warning", DB.comunicados.length, "Comunicados");
    }
    case "familia": {
      const estudiante = DB.estudiantes.find((e) => e.id === usuario.estudianteId);
      return tarjetaResumen("people", "primary", estudiante ? estudiante.nombre.split(" ")[0] : "—", "Estudiante a cargo")
        + tarjetaResumen("clipboard-data", "success", promedioEstudiante(usuario.estudianteId), "Promedio")
        + tarjetaResumen("calendar2-check", "info", asistenciaPorcentaje(usuario.estudianteId) + "%", "Asistencia")
        + tarjetaResumen("megaphone", "warning", DB.comunicados.length, "Comunicados");
    }
    default:
      return "";
  }
}

function renderInicio() {
  const usuario = usuarioActual();
  const contenedor = $("#vista-inicio");
  const comunicados = DB.comunicados.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3);
  const hoy = new Date().toISOString().slice(0, 10);
  const eventos = DB.calendario.slice().sort((a, b) => a.fecha.localeCompare(b.fecha)).filter((c) => c.fecha >= hoy).slice(0, 3);

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Hola, ${esc(usuario.nombre)}</h4>
    <p class="text-muted">Resumen de ${nombreRol(usuario.rol).toLowerCase()}</p>
    <div class="row g-3 mb-4">${tarjetasInicio(usuario)}</div>
    <div class="row g-4">
      <div class="col-lg-7">
        <div class="tarjeta p-3 h-100">
          <h6 class="fw-semibold mb-3"><i class="bi bi-megaphone text-primary"></i> Últimos comunicados</h6>
          ${comunicados.length ? comunicados.map((c) => `
            <div class="border-bottom pb-2 mb-2">
              <div class="d-flex justify-content-between gap-2">
                <span class="fw-medium">${esc(c.titulo)}</span>
                <small class="text-muted text-nowrap">${formatearFecha(c.fecha)}</small>
              </div>
              <div class="text-muted small">${esc(c.categoria)} · ${esc(c.autor)}</div>
            </div>`).join("") : cardVacio("Sin comunicados publicados.")}
        </div>
      </div>
      <div class="col-lg-5">
        <div class="tarjeta p-3 h-100">
          <h6 class="fw-semibold mb-3"><i class="bi bi-calendar-event text-primary"></i> Próximos eventos</h6>
          ${eventos.length ? eventos.map((c) => `
            <div class="d-flex gap-2 mb-2 border-bottom pb-2">
              <div class="text-center" style="min-width:44px">
                <div class="fw-bold">${c.fecha.slice(8)}</div>
                <div class="text-muted small">${MESES[Number(c.fecha.slice(5, 7)) - 1]}</div>
              </div>
              <div><div class="fw-medium">${esc(c.titulo)}</div><div class="text-muted small">${esc(c.tipo)}</div></div>
            </div>`).join("") : cardVacio("Sin eventos próximos.")}
        </div>
      </div>
    </div>`;
}
