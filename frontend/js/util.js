const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

/**
 * Sanitiza valores para inserción segura en plantillas HTML evitando ataques XSS.
 * @param {*} valor - Valor a sanitizar.
 * @returns {string} Cadena sanitizada con entidades HTML.
 */
function esc(valor) {
  if (valor === null || valor === undefined) return "";
  const str = typeof valor === "object" ? JSON.stringify(valor) : String(valor);
  return str.replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caracter]);
}

/**
 * Valida el formato básico de una dirección de correo electrónico.
 * @param {string} email - Correo a validar.
 * @returns {boolean} `true` si la cadena cumple el formato.
 */
function esEmailValido(email) {
  if (typeof email !== "string") return false;
  return /^\S+@\S+\.\S+$/.test(email.trim());
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { $, $$, esc, esEmailValido };
}
