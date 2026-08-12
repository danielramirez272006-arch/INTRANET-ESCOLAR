const CLAVE_SESION = "intranet_sesion";

const ROLES = {
  docente: { etiqueta: "Docente", icono: "mortarboard" },
  estudiante: { etiqueta: "Estudiante", icono: "book" },
  familia: { etiqueta: "Familia", icono: "people" }
};

/**
 * Inicia la sesión guardando los datos esenciales del usuario en localStorage.
 * @param {Object} usuario - Objeto usuario autenticado.
 */
function iniciarSesion(usuario) {
  if (!usuario || typeof usuario !== "object") return;
  localStorage.setItem(CLAVE_SESION, JSON.stringify({
    userId: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol,
    email: usuario.email,
    inicioAt: new Date().toISOString()
  }));
}

/**
 * Obtiene la sesión guardada actual devolviendo null si los datos son inválidos o corruptos.
 * @returns {Object|null} Datos de sesión o null.
 */
function sesionActual() {
  try {
    const raw = localStorage.getItem(CLAVE_SESION);
    if (!raw) return null;
    const sesion = JSON.parse(raw);
    if (sesion && typeof sesion === "object" && sesion.userId) {
      return sesion;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Cierra la sesión activa eliminando la clave de localStorage.
 */
function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch (error) {
    // Ignorar errores de acceso al almacenamiento
  }
}

/**
 * Obtiene el usuario activo correspondiente a la sesión guardada desde la BD en memoria.
 * @returns {Object|null} Objeto usuario activo o null.
 */
function usuarioActual() {
  const sesion = sesionActual();
  if (!sesion || !DB || !Array.isArray(DB.usuarios)) return null;
  const usuario = DB.usuarios.find((u) => u.id === sesion.userId);
  if (!usuario || !usuario.activo) {
    cerrarSesion();
    return null;
  }
  return usuario;
}

/**
 * Retorna la etiqueta legible correspondiente a un rol.
 * @param {string} rol - Identificador del rol.
 * @returns {string} Etiqueta en español.
 */
function nombreRol(rol) {
  return ROLES[rol] ? ROLES[rol].etiqueta : (rol || "");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CLAVE_SESION,
    ROLES,
    iniciarSesion,
    sesionActual,
    cerrarSesion,
    usuarioActual,
    nombreRol
  };
}
