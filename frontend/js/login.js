document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();
  if (usuarioActual()) {
    location.href = "dashboard.html";
    return;
  }

  const select = $("#demo-usuario");
  const form = $("#form-login");
  const alerta = $("#alerta-login");
  const contrasenaInput = $("#contrasena");
  const ayudaContrasena = $("#ayuda-contrasena");

  const usuarios = DB.usuarios.filter((u) => u.activo);
  select.innerHTML = usuarios.map((u) =>
    `<option value="${u.id}">${esc(u.nombre)} — ${nombreRol(u.rol)}</option>`
  ).join("");

  select.addEventListener("change", () => {
    alerta.classList.add("d-none");
    ayudaContrasena.textContent = "";
  });

  contrasenaInput.addEventListener("input", () => alerta.classList.add("d-none"));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const contrasena = contrasenaInput.value;
    alerta.classList.add("d-none");
    if (!contrasena) {
      alerta.textContent = "Ingresá la contraseña para continuar.";
      alerta.classList.remove("d-none");
      return;
    }
    const usuario = usuarios.find((u) => u.id === Number(select.value));
    if (!usuario) {
      alerta.textContent = "La cuenta seleccionada no está disponible.";
      alerta.classList.remove("d-none");
      return;
    }
    if (!verificarContrasena(contrasena, usuario.sal, usuario.contrasenaHash)) {
      alerta.textContent = "Contraseña incorrecta. Verificá los datos e intentá nuevamente.";
      alerta.classList.remove("d-none");
      contrasenaInput.select();
      return;
    }
    iniciarSesion(usuario);
    location.href = "dashboard.html";
  });
});
