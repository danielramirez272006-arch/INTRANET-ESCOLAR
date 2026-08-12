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

function tarjetaResumen(icono, color, valor, etiqueta, bordeColor = "primary") {
  return `<div class="col-6 col-xl-3">
    <div class="tarjeta tarjeta-resumen borde-${bordeColor} p-3 d-flex align-items-center gap-3 h-100">
      <div class="icono-tarjeta text-bg-${color}"><i class="bi bi-${icono}"></i></div>
      <div class="min-w-0">
        <div class="fs-4 fw-bold text-slate-800">${valor}</div>
        <div class="text-muted small fw-medium text-truncate">${etiqueta}</div>
      </div>
    </div>
  </div>`;
}

function tarjetasInicio(usuario) {
  const hoy = new Date().toISOString().slice(0, 10);
  switch (usuario.rol) {
    case "docente":
      return tarjetaResumen("people-fill", "primary", DB.estudiantes.filter((e) => e.cursoId === usuario.cursoId).length, "Estudiantes a cargo", "primary")
        + tarjetaResumen("journal-bookmark-fill", "success", DB.materias.length, "Materias dictadas", "success")
        + tarjetaResumen("calendar2-check-fill", "info", DB.asistencia.filter((a) => a.fecha === hoy).length, "Asistencia registrada hoy", "info")
        + tarjetaResumen("megaphone-fill", "warning", DB.comunicados.length, "Comunicados publicados", "warning");
    case "estudiante": {
      const promedio = promedioEstudiante(usuario.estudianteId);
      return tarjetaResumen("award-fill", "primary", promedio, "Promedio académico", "primary")
        + tarjetaResumen("journal-bookmark-fill", "success", DB.materias.length, "Materias inscritas", "success")
        + tarjetaResumen("calendar-event-fill", "info", DB.calendario.filter((c) => c.tipo === "Examen").length, "Evaluaciones próximas", "info")
        + tarjetaResumen("megaphone-fill", "warning", DB.comunicados.length, "Novedades institucionales", "warning");
    }
    case "familia": {
      const estudiante = DB.estudiantes.find((e) => e.id === usuario.estudianteId);
      return tarjetaResumen("person-badge-fill", "primary", estudiante ? estudiante.nombre.split(" ")[0] : "—", "Estudiante monitoreado", "primary")
        + tarjetaResumen("award-fill", "success", promedioEstudiante(usuario.estudianteId), "Promedio del alumno", "success")
        + tarjetaResumen("calendar2-check-fill", "info", asistenciaPorcentaje(usuario.estudianteId) + "%", "Asistencia del periodo", "info")
        + tarjetaResumen("megaphone-fill", "warning", DB.comunicados.length, "Comunicados a padres", "warning");
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
    <!-- Hero Banner Educativo -->
    <div class="hero-academico mb-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
      <div>
        <span class="badge bg-white text-primary fw-bold mb-2">
          <i class="bi bi-mortarboard-fill me-1"></i> Portal Escolar San Miguel
        </span>
        <h2 class="fw-bold mb-1">¡Hola, ${esc(usuario.nombre)}!</h2>
        <p class="mb-0 opacity-90">
          Perfil activo: <strong>${nombreRol(usuario.rol)}</strong> · Ciclo Lectivo 2026 (Semestre I)
        </p>
      </div>
      <img src="img/banner.png" alt="Ilustración educativa" class="hero-imagen d-none d-md-block">
    </div>

    <!-- Tarjetas de Resumen Estadístico -->
    <div class="row g-3 mb-4">${tarjetasInicio(usuario)}</div>

    <!-- Secciones de Novedades y Agenda Escolar -->
    <div class="row g-4 mb-4">
      <div class="col-lg-7">
        <div class="tarjeta p-4 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h5 class="fw-bold m-0"><i class="bi bi-megaphone-fill text-primary me-2"></i> Boletín e Información Institucional</h5>
            <button class="btn btn-sm btn-outline-primary" onclick="mostrarVista('comunicados')">Ver todos</button>
          </div>
          ${comunicados.length ? comunicados.map((c) => `
            <div class="border-bottom pb-3 mb-3">
              <div class="d-flex justify-content-between gap-2 align-items-center">
                <span class="fw-bold text-dark fs-6"><i class="bi bi-pin-angle-fill text-warning me-1"></i> ${esc(c.titulo)}</span>
                <small class="badge bg-light text-secondary border">${formatearFecha(c.fecha)}</small>
              </div>
              <p class="text-muted small mb-1 mt-1">${esc(c.contenido || c.resumen || "Sin descripción breve.")}</p>
              <div class="text-muted small fw-medium">
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle">${esc(c.categoria)}</span> · Publicado por: ${esc(c.autor)}
              </div>
            </div>`).join("") : cardVacio("Sin comunicados recientes.")}
        </div>
      </div>

      <div class="col-lg-5">
        <div class="tarjeta p-4 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h5 class="fw-bold m-0"><i class="bi bi-calendar-check-fill text-primary me-2"></i> Próximas Fechas Clave</h5>
            <button class="btn btn-sm btn-outline-primary" onclick="mostrarVista('calendario')">Agenda</button>
          </div>
          ${eventos.length ? eventos.map((c) => `
            <div class="d-flex gap-3 mb-3 border-bottom pb-2 align-items-center">
              <div class="text-center rounded-3 bg-light p-2 border" style="min-width:54px">
                <div class="fw-bold fs-5 text-primary lh-1">${c.fecha.slice(8)}</div>
                <div class="text-muted small fw-bold text-uppercase">${MESES[Number(c.fecha.slice(5, 7)) - 1]}</div>
              </div>
              <div class="min-w-0">
                <div class="fw-bold text-slate-800">${esc(c.titulo)}</div>
                <div class="text-muted small"><span class="badge bg-info-subtle text-info-emphasis border">${esc(c.tipo)}</span></div>
              </div>
            </div>`).join("") : cardVacio("No hay eventos programados en los próximos días.")}
        </div>
      </div>
    </div>

    <!-- Cita Inspiradora Educativa -->
    <div class="tarjeta p-3 bg-light text-center border-start border-4 border-primary">
      <blockquote class="blockquote mb-0 fs-6 italic">
        <p class="mb-1 text-secondary">"La educación no es la preparación para la vida; la educación es la vida misma."</p>
        <footer class="blockquote-footer mt-1 small">John Dewey · <cite title="Cita Educativa">Filósofo y pedagogo</cite></footer>
      </blockquote>
    </div>`;
}

