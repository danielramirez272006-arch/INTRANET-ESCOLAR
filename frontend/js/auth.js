const CLAVE_SESION = "intranet_sesion";

const ROLES = {
  admin: { etiqueta: "Administrador", icono: "person-badge" },
  docente: { etiqueta: "Docente", icono: "mortarboard" },
  staff: { etiqueta: "Personal Administrativo", icono: "briefcase" },
  estudiante: { etiqueta: "Estudiante", icono: "book" },
  familia: { etiqueta: "Familia", icono: "people" }
};

function iniciarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({
    userId: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol,
    email: usuario.email
  }));
}

function sesionActual() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch (error) {
    return null;
  }
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

function usuarioActual() {
  const sesion = sesionActual();
  if (!sesion || !DB) return null;
  return DB.usuarios.find((u) => u.id === sesion.userId) || null;
}

function nombreRol(rol) {
  return ROLES[rol] ? ROLES[rol].etiqueta : rol;
}
