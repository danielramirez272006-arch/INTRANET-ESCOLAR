document.addEventListener("DOMContentLoaded", () => {
  if (sesionActual()) {
    location.href = "dashboard.html";
    return;
  }

  const select = $("#demo-usuario");
  const form = $("#form-login");
  const alerta = $("#alerta-login");
  const contenedorRapido = $("#accesos-rapidos");

  const usuarios = DATOS_INICIALES.usuarios.filter((u) => u.activo);
  select.innerHTML = usuarios.map((u) =>
    `<option value="${u.id}">${esc(u.nombre)} — ${ROLES[u.rol].etiqueta}</option>`
  ).join("");

  const coloresRol = { admin: "primary", docente: "info", staff: "secondary", estudiante: "success", familia: "warning" };

  contenedorRapido.innerHTML = Object.keys(ROLES).map((rol) => {
    const existe = usuarios.some((u) => u.rol === rol);
    return existe
      ? `<button type="button" class="btn btn-sm btn-outline-${coloresRol[rol]} acceso-rol" data-rol="${rol}"><i class="bi bi-${ROLES[rol].icono}"></i> ${ROLES[rol].etiqueta}</button>`
      : "";
  }).join("");

  document.querySelectorAll(".acceso-rol").forEach((btn) => {
    btn.addEventListener("click", () => {
      const usuario = usuarios.find((u) => u.rol === btn.dataset.rol);
      if (!usuario) return;
      iniciarSesion(usuario);
      location.href = "dashboard.html";
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const contrasena = $("#contrasena").value.trim();
    alerta.classList.add("d-none");
    if (!contrasena) {
      alerta.textContent = "Ingresá una contraseña para continuar.";
      alerta.classList.remove("d-none");
      return;
    }
    const usuario = usuarios.find((u) => u.id === Number(select.value));
    if (!usuario) {
      alerta.textContent = "La cuenta seleccionada no está disponible.";
      alerta.classList.remove("d-none");
      return;
    }
    iniciarSesion(usuario);
    location.href = "dashboard.html";
  });
});
