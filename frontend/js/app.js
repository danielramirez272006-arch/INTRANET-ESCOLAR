const VISTAS = ["inicio", "calificaciones", "asistencia", "comunicados", "reservas", "calendario", "materiales", "horarios"];

const MENU = {
  docente: [
    { vista: "inicio", etiqueta: "Inicio", icono: "speedometer2" },
    { vista: "calificaciones", etiqueta: "Calificaciones", icono: "clipboard-data" },
    { vista: "asistencia", etiqueta: "Asistencia", icono: "calendar2-check" },
    { vista: "comunicados", etiqueta: "Comunicados", icono: "megaphone" },
    { vista: "reservas", etiqueta: "Reservas", icono: "door-open" },
    { vista: "calendario", etiqueta: "Calendario", icono: "calendar-event" },
    { vista: "materiales", etiqueta: "Materiales y Tareas", icono: "folder2-open" },
    { vista: "horarios", etiqueta: "Horarios", icono: "table" }
  ],
  estudiante: [
    { vista: "inicio", etiqueta: "Inicio", icono: "speedometer2" },
    { vista: "calificaciones", etiqueta: "Mis notas", icono: "clipboard-data" },
    { vista: "asistencia", etiqueta: "Mi asistencia", icono: "calendar2-check" },
    { vista: "horarios", etiqueta: "Mi horario", icono: "table" },
    { vista: "calendario", etiqueta: "Calendario", icono: "calendar-event" },
    { vista: "materiales", etiqueta: "Materiales y Tareas", icono: "folder2-open" },
    { vista: "comunicados", etiqueta: "Comunicados", icono: "megaphone" }
  ],
  familia: [
    { vista: "inicio", etiqueta: "Inicio", icono: "speedometer2" },
    { vista: "calificaciones", etiqueta: "Notas del estudiante", icono: "clipboard-data" },
    { vista: "asistencia", etiqueta: "Asistencia", icono: "calendar2-check" },
    { vista: "horarios", etiqueta: "Horarios", icono: "table" },
    { vista: "calendario", etiqueta: "Calendario", icono: "calendar-event" },
    { vista: "materiales", etiqueta: "Materiales y Tareas", icono: "folder2-open" },
    { vista: "comunicados", etiqueta: "Comunicados", icono: "megaphone" }
  ]
};

let vistaActual = "inicio";
window.RENDERERS = window.RENDERERS || {};

function registrarVista(vista, fn) {
  window.RENDERERS[vista] = fn;
}

function notificar(mensaje, tipo = "success") {
  const colores = { success: "#198754", danger: "#dc3545", warning: "#ffc107", info: "#0dcaf0" };
  const div = document.createElement("div");
  div.textContent = mensaje;
  div.setAttribute("role", "status");
  div.setAttribute("aria-live", "polite");
  Object.assign(div.style, {
    position: "fixed",
    top: "70px",
    right: "16px",
    zIndex: "3000",
    background: colores[tipo] || colores.success,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,.2)",
    maxWidth: "320px"
  });
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

function formatearFecha(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "";
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}

function cardVacio(mensaje, icono = "inbox") {
  return `<div class="alert alert-light border text-center my-3 py-4" role="status">
    <i class="bi bi-${icono} d-block mb-2 fs-3 text-muted opacity-50"></i>
    ${esc(mensaje)}
  </div>`;
}

function nombreCursoPorId(cursoId) {
  const curso = DB.cursos.find((c) => c.id === cursoId);
  return curso ? curso.nombre : "—";
}

function mostrarVista(vista) {
  const usuario = usuarioActual();
  if (!usuario) {
    location.href = "index.html";
    return;
  }
  const permitidas = (MENU[usuario.rol] || []).map((m) => m.vista);
  if (!permitidas.includes(vista)) vista = "inicio";
  vistaActual = vista;
  VISTAS.forEach((v) => $("#vista-" + v).classList.toggle("d-none", v !== vista));
  document.querySelectorAll("#sidebar-lista .nav-link, #menu-movil-lista .nav-link").forEach((enlace) => {
    const activo = enlace.dataset.vista === vista;
    enlace.classList.toggle("activo", activo);
    enlace.toggleAttribute("aria-current", activo);
  });
  const render = window.RENDERERS[vista];
  if (render) render();
}

function construirLayout(usuario) {
  const nombreEl = $("#usuario-nombre");
  const rolBadgeEl = $("#usuario-rol-badge");
  const avatarNavEl = $("#usuario-avatar-nav");

  if (nombreEl) nombreEl.textContent = usuario.nombre;
  
  if (rolBadgeEl) {
    const rolClase = {
      docente: "badge-rol-docente",
      estudiante: "badge-rol-estudiante",
      familia: "badge-rol-familia"
    }[usuario.rol] || "bg-secondary text-white";
    
    const rolIcono = {
      docente: "mortarboard-fill",
      estudiante: "backpack-fill",
      familia: "people-fill"
    }[usuario.rol] || "person";

    rolBadgeEl.innerHTML = `<span class="badge-rol ${rolClase}">
      <i class="bi bi-${rolIcono}"></i> ${nombreRol(usuario.rol)}
    </span>`;
  }

  if (avatarNavEl && usuario.nombre) {
    const iniciales = usuario.nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    avatarNavEl.textContent = iniciales;
  }

  const itemsSidebar = `
    <div class="sidebar-categoria">Portal</div>
    <a class="nav-link" href="#" data-vista="inicio"><i class="bi bi-speedometer2"></i> Inicio</a>
    
    <div class="sidebar-categoria mt-2">Gestión Académica</div>
    ${(usuario.rol === 'docente' ? `
      <a class="nav-link" href="#" data-vista="calificaciones"><i class="bi bi-clipboard-data"></i> Calificaciones</a>
      <a class="nav-link" href="#" data-vista="asistencia"><i class="bi bi-calendar2-check"></i> Asistencia</a>
      <a class="nav-link" href="#" data-vista="horarios"><i class="bi bi-clock-history"></i> Horarios</a>
      <a class="nav-link" href="#" data-vista="materiales"><i class="bi bi-journal-bookmark-fill"></i> Materiales y Tareas</a>
    ` : `
      <a class="nav-link" href="#" data-vista="calificaciones"><i class="bi bi-clipboard-data"></i> ${usuario.rol === 'estudiante' ? 'Mis notas' : 'Notas del estudiante'}</a>
      <a class="nav-link" href="#" data-vista="asistencia"><i class="bi bi-calendar2-check"></i> Asistencia</a>
      <a class="nav-link" href="#" data-vista="horarios"><i class="bi bi-clock-history"></i> Mi Horario</a>
      <a class="nav-link" href="#" data-vista="materiales"><i class="bi bi-journal-bookmark-fill"></i> Materiales y Tareas</a>
    `)}

    <div class="sidebar-categoria mt-2">Vida Escolar</div>
    <a class="nav-link" href="#" data-vista="comunicados"><i class="bi bi-megaphone"></i> Comunicados</a>
    <a class="nav-link" href="#" data-vista="calendario"><i class="bi bi-calendar-event"></i> Calendario Escolar</a>
    ${usuario.rol === 'docente' ? '<a class="nav-link" href="#" data-vista="reservas"><i class="bi bi-door-open"></i> Reserva de Aulas</a>' : ''}
  `;

  const itemsMovil = (MENU[usuario.rol] || []).map((m) =>
    `<a class="nav-link" href="#" data-vista="${m.vista}"><i class="bi bi-${m.icono}"></i> ${esc(m.etiqueta)}</a>`
  ).join("");

  const sidebarEl = $("#sidebar-lista");
  const movilEl = $("#menu-movil-lista");

  if (sidebarEl) sidebarEl.innerHTML = itemsSidebar;
  if (movilEl) movilEl.innerHTML = itemsMovil;

  document.querySelectorAll("#sidebar-lista, #menu-movil-lista").forEach((nav) => {
    nav.addEventListener("click", (event) => {
      const enlace = event.target.closest("a[data-vista]");
      if (!enlace) return;
      event.preventDefault();
      const offcanvasEl = document.getElementById("menu-movil");
      if (offcanvasEl && bootstrap.Offcanvas.getInstance(offcanvasEl)) {
        bootstrap.Offcanvas.getInstance(offcanvasEl).hide();
      }
      mostrarVista(enlace.dataset.vista);
    });
  });

  const btnCerrar = $("#btn-cerrar-sesion");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      cerrarSesion();
      location.href = "index.html";
    });
  }

  const btnRestablecer = $("#btn-restablecer");
  if (btnRestablecer) {
    btnRestablecer.addEventListener("click", () => {
      if (confirm("¿Restablecer los datos de demostración?")) resetearDatos();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();
  const usuario = usuarioActual();
  if (!usuario) {
    location.href = "index.html";
    return;
  }
  construirLayout(usuario);
  const parametros = new URLSearchParams(location.search);
  mostrarVista(parametros.get("vista") || "inicio");
});
