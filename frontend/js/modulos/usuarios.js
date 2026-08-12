registrarVista("usuarios", renderUsuarios);

function filaUsuario(usuario) {
  const iniciales = usuario.nombre.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return `<tr>
    <td>
      <div class="d-flex align-items-center gap-2">
        <span class="avatar-inicial">${esc(iniciales)}</span>
        <span class="fw-medium">${esc(usuario.nombre)}</span>
      </div>
    </td>
    <td>${esc(usuario.email)}</td>
    <td><span class="badge text-bg-secondary">${ROLES[usuario.rol].etiqueta}</span></td>
    <td>${usuario.activo ? '<span class="badge text-bg-success">Activo</span>' : '<span class="badge text-bg-danger">Inactivo</span>'}</td>
    <td class="text-end text-nowrap">
      <button class="btn btn-sm btn-outline-primary btn-password" data-nombre="${esc(usuario.nombre)}" title="Restablecer contraseña"><i class="bi bi-key"></i></button>
      <button class="btn btn-sm ${usuario.activo ? "btn-outline-danger" : "btn-outline-success"} btn-estado" data-id="${usuario.id}" title="${usuario.activo ? "Desactivar" : "Activar"}">
        <i class="bi ${usuario.activo ? "bi-person-dash" : "bi-person-check"}"></i>
      </button>
    </td>
  </tr>`;
}

function renderUsuarios() {
  const contenedor = $("#vista-usuarios");
  const total = DB.usuarios.length;
  const activos = DB.usuarios.filter((u) => u.activo).length;

  contenedor.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div>
        <h4 class="titulo-seccion mb-1">Gestión de usuarios</h4>
        <p class="text-muted mb-0">Alta, baja y edición de usuarios del sistema.</p>
      </div>
      <div class="d-flex gap-3">
        <div class="tarjeta px-3 py-2"><small class="text-muted">Total</small><div class="fw-semibold">${total}</div></div>
        <div class="tarjeta px-3 py-2"><small class="text-muted">Activos</small><div class="fw-semibold">${activos}</div></div>
      </div>
    </div>
    <div class="row g-4">
      <div class="col-lg-4">
        <div class="tarjeta p-3">
          <h6 class="fw-semibold mb-3">Nuevo usuario</h6>
          <form id="form-usuario">
            <div class="mb-2"><label class="form-label">Nombre completo</label><input required class="form-control" id="nuevo-nombre"></div>
            <div class="mb-2"><label class="form-label">Correo</label><input required type="email" class="form-control" id="nuevo-email"></div>
            <div class="mb-3"><label class="form-label">Rol</label>
              <select class="form-select" id="nuevo-rol">
                ${Object.keys(ROLES).map((r) => `<option value="${r}">${ROLES[r].etiqueta}</option>`).join("")}
              </select>
            </div>
            <button class="btn btn-primary w-100"><i class="bi bi-person-plus"></i> Crear usuario</button>
          </form>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="tarjeta p-3 table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th class="text-end">Acciones</th></tr></thead>
            <tbody>${DB.usuarios.map(filaUsuario).join("")}</tbody>
          </table>
        </div>
      </div>
    </div>`;

  $("#form-usuario").addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = $("#nuevo-nombre").value.trim();
    const email = $("#nuevo-email").value.trim();
    const rol = $("#nuevo-rol").value;
    if (DB.usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      notificar("Ya existe un usuario con ese correo.", "warning");
      return;
    }
    DB.usuarios.push({ id: nextId(DB.usuarios), nombre, email, rol, activo: true });
    guardarDatos();
    notificar("Usuario creado correctamente.");
    renderUsuarios();
  });

  $$("#vista-usuarios .btn-estado").forEach((btn) => btn.addEventListener("click", () => {
    const usuario = DB.usuarios.find((u) => u.id === Number(btn.dataset.id));
    if (!usuario) return;
    if (usuario.id === usuarioActual().id) {
      notificar("No puedes desactivar tu propia cuenta.", "warning");
      return;
    }
    usuario.activo = !usuario.activo;
    guardarDatos();
    renderUsuarios();
  }));

  $$("#vista-usuarios .btn-password").forEach((btn) => btn.addEventListener("click", () => {
    notificar(`Contraseña de ${btn.dataset.nombre} restablecida (demo).`);
  }));
}
