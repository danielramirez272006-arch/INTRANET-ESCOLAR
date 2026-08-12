const CLAVE_DATOS = "intranet_datos";
const VISTAS = ["inicio", "usuarios", "calificaciones", "asistencia", "comunicados", "reservas", "calendario", "materiales", "horarios"];

const MENU = {
  admin: [
    { vista: "inicio", etiqueta: "Inicio", icono: "speedometer2" },
    { vista: "usuarios", etiqueta: "Usuarios", icono: "people" },
    { vista: "calificaciones", etiqueta: "Calificaciones", icono: "clipboard-data" },
    { vista: "asistencia", etiqueta: "Asistencia", icono: "calendar2-check" },
    { vista: "comunicados", etiqueta: "Comunicados", icono: "megaphone" },
    { vista: "reservas", etiqueta: "Reservas", icono: "door-open" },
    { vista: "calendario", etiqueta: "Calendario", icono: "calendar-event" },
    { vista: "materiales", etiqueta: "Materiales y Tareas", icono: "folder2-open" },
    { vista: "horarios", etiqueta: "Horarios", icono: "table" }
  ],
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
  staff: [
    { vista: "inicio", etiqueta: "Inicio", icono: "speedometer2" },
    { vista: "calificaciones", etiqueta: "Calificaciones", icono: "clipboard-data" },
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

let DB = null;
let vistaActual = "inicio";
window.RENDERERS = window.RENDERERS || {};

function registrarVista(vista, fn) {
  window.RENDERERS[vista] = fn;
}

function nextId(lista) {
  return Math.max(0, ...lista.map((x) => x.id)) + 1;
}

function cargarDatos() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_DATOS));
    if (guardado && guardado.version === VERSION_DATOS) {
      DB = guardado.datos;
      return;
    }
  } catch (error) {
    // sin datos válidos, se usan los iniciales
  }
  DB = JSON.parse(JSON.stringify(DATOS_INICIALES));
}

function guardarDatos() {
  localStorage.setItem(CLAVE_DATOS, JSON.stringify({ version: VERSION_DATOS, datos: DB }));
}

function resetearDatos() {
  localStorage.removeItem(CLAVE_DATOS);
  location.reload();
}

function notificar(mensaje, tipo = "success") {
  const colores = { success: "#198754", danger: "#dc3545", warning: "#ffc107", info: "#0dcaf0" };
  const div = document.createElement("div");
  div.textContent = mensaje;
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
  if (!iso) return "";
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}

function cardVacio(mensaje) {
  return `<div class="alert alert-light border text-center my-3">${esc(mensaje)}</div>`;
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
    enlace.classList.toggle("activo", enlace.dataset.vista === vista);
  });
  const render = window.RENDERERS[vista];
  if (render) render();
}

function construirLayout(usuario) {
  $("#usuario-nombre").textContent = usuario.nombre;
  $("#usuario-rol").textContent = nombreRol(usuario.rol);

  const items = (MENU[usuario.rol] || []).map((m) =>
    `<a class="nav-link" href="#" data-vista="${m.vista}"><i class="bi bi-${m.icono}"></i> ${esc(m.etiqueta)}</a>`
  ).join("");
  $("#sidebar-lista").innerHTML = items;
  $("#menu-movil-lista").innerHTML = items;

  document.querySelectorAll("#sidebar-lista, #menu-movil-lista").forEach((nav) => {
    nav.addEventListener("click", (event) => {
      const enlace = event.target.closest("a[data-vista]");
      if (!enlace) return;
      event.preventDefault();
      const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById("menu-movil"));
      if (offcanvas) offcanvas.hide();
      mostrarVista(enlace.dataset.vista);
    });
  });

  $("#btn-cerrar-sesion").addEventListener("click", () => {
    cerrarSesion();
    location.href = "index.html";
  });

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
