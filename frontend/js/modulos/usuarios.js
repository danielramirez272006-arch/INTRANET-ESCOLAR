registrarVista("usuarios", renderUsuarios);

function rolEtiqueta(rol) {
  return ROLES[rol] ? ROLES[rol].etiqueta : rol;
}

function filaUsuario(usuario) {
  const iniciales = usuario.nombre.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const detalle = usuario.rol === "docente"
    ? `${nombreCursoPorId(usuario.cursoId)} · ${DB.materias.find((m) => m.id === usuario.materiaId)?.nombre || ""}`
    : usuario.rol === "estudiante" || usuario.rol === "familia"
      ? `${nombreCursoPorId(DB.estudiantes.find((e) => e.id === usuario.estudianteId)?.cursoId)}`
      : "";
  return `<tr>
    <td>
      <div class="d-flex align-items-center gap-2">
        <span class="avatar-inicial">${esc(iniciales)}</span>
        <div>
          <div class="fw-medium">${esc(usuario.nombre)}</div>
          ${detalle ? `<small class="text-muted">${esc(detalle)}</small>` : ""}
        </div>
      </div>
    </td>
    <td>${esc(usuario.email)}</td>
    <td><span class="badge text-bg-secondary">${esc(rolEtiqueta(usuario.rol))}</span></td>
    <td>${usuario.activo ? '<span class="badge text-bg-success">Activo</span>' : '<span class="badge text-bg-danger">Inactivo</span>'}</td>
    <td class="text-end text-nowrap">
      <button class="btn btn-sm btn-outline-secondary btn-editar" data-id="${usuario.id}" title="Editar usuario"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-sm btn-outline-primary btn-password" data-id="${usuario.id}" data-nombre="${esc(usuario.nombre)}" title="Restablecer contraseña"><i class="bi bi-key"></i></button>
      <button class="btn btn-sm ${usuario.activo ? "btn-outline-danger" : "btn-outline-success"} btn-estado" data-id="${usuario.id}" title="${usuario.activo ? "Desactivar" : "Activar"}">
        <i class="bi ${usuario.activo ? "bi-person-dash" : "bi-person-check"}"></i>
      </button>
    </td>
  </tr>`;
}

function seleccionCursos(selected = "") {
  return DB.cursos.map((c) => `<option value="${c.id}" ${c.id === Number(selected) ? "selected" : ""}>${esc(c.nombre)}</option>`).join("");
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
            <div class="mb-2"><label class="form-label">Contraseña inicial</label><input required type="password" minlength="6" class="form-control" id="nuevo-contrasena" autocomplete="new-password"></div>
            <div class="mb-2"><label class="form-label">Rol</label>
              <select class="form-select" id="nuevo-rol">
                ${Object.keys(ROLES).map((r) => `<option value="${r}">${ROLES[r].etiqueta}</option>`).join("")}
              </select>
            </div>
            <div class="d-none" id="campos-docente">
              <div class="mb-2"><label class="form-label">Curso</label><select class="form-select" id="nuevo-curso">${seleccionCursos()}</select></div>
              <div class="mb-2"><label class="form-label">Materia</label>
                <select class="form-select" id="nuevo-materia">${DB.materias.map((m) => `<option value="${m.id}">${esc(m.nombre)}</option>`).join("")}</select>
              </div>
            </div>
            <div class="d-none" id="campos-estudiante">
              <div class="mb-2"><label class="form-label">Curso</label><select class="form-select" id="nuevo-curso-estudiante">${seleccionCursos()}</select></div>
            </div>
            <div class="d-none" id="campos-familia">
              <div class="mb-2"><label class="form-label">Estudiante a cargo</label>
                <select class="form-select" id="nuevo-estudiante">${DB.estudiantes.map((e) => `<option value="${e.id}">${esc(e.nombre)}</option>`).join("")}</select>
              </div>
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

  const camposPorRol = {
    docente: $("#campos-docente"),
    estudiante: $("#campos-estudiante"),
    familia: $("#campos-familia")
  };

  const actualizarCampos = () => {
    const rol = $("#nuevo-rol").value;
    Object.entries(camposPorRol).forEach(([clave, contenedor]) => {
      contenedor.classList.toggle("d-none", clave !== rol);
    });
  };
  $("#nuevo-rol").addEventListener("change", actualizarCampos);

  $("#form-usuario").addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = $("#nuevo-nombre").value.trim();
    const email = $("#nuevo-email").value.trim();
    const rol = $("#nuevo-rol").value;
    const contrasena = $("#nuevo-contrasena").value;

    if (DB.usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      notificar("Ya existe un usuario con ese correo.", "warning");
      return;
    }
    if (contrasena.length < 6) {
      notificar("La contraseña debe tener al menos 6 caracteres.", "warning");
      return;
    }

    const sal = generarSal();
    const nuevoUsuario = {
      id: nextId(DB.usuarios),
      nombre,
      email,
      rol,
      sal,
      contrasenaHash: hashContrasena(contrasena, sal),
      activo: true
    };

    if (rol === "docente") {
      nuevoUsuario.cursoId = Number($("#nuevo-curso").value);
      nuevoUsuario.materiaId = Number($("#nuevo-materia").value);
    } else if (rol === "estudiante") {
      const cursoId = Number($("#nuevo-curso-estudiante").value);
      const estudiante = { id: nextId(DB.estudiantes), nombre, cursoId };
      DB.estudiantes.push(estudiante);
      nuevoUsuario.estudianteId = estudiante.id;
    } else if (rol === "familia") {
      if (!DB.estudiantes.length) {
        notificar("No hay estudiantes para vincular.", "warning");
        return;
      }
      nuevoUsuario.estudianteId = Number($("#nuevo-estudiante").value);
    }

    DB.usuarios.push(nuevoUsuario);
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

  $$("#vista-usuarios .btn-editar").forEach((btn) => btn.addEventListener("click", () => {
    const usuario = DB.usuarios.find((u) => u.id === Number(btn.dataset.id));
    if (!usuario) return;
    const nombre = prompt("Nombre completo:", usuario.nombre);
    if (nombre === null) return;
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      notificar("El nombre no puede estar vacío.", "warning");
      return;
    }
    const email = prompt("Correo electrónico:", usuario.email);
    if (email === null) return;
    const emailLimpio = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(emailLimpio)) {
      notificar("Ingresá un correo válido.", "warning");
      return;
    }
    if (DB.usuarios.some((u) => u.id !== usuario.id && u.email.toLowerCase() === emailLimpio)) {
      notificar("Ya existe un usuario con ese correo.", "warning");
      return;
    }
    usuario.nombre = nombreLimpio;
    usuario.email = emailLimpio;
    const estudiante = DB.estudiantes.find((e) => e.id === usuario.estudianteId);
    if (usuario.rol === "estudiante" && estudiante) estudiante.nombre = nombreLimpio;
    guardarDatos();
    renderUsuarios();
    notificar("Usuario actualizado correctamente.");
  }));

  $$("#vista-usuarios .btn-password").forEach((btn) => btn.addEventListener("click", () => {
    const usuario = DB.usuarios.find((u) => u.id === Number(btn.dataset.id));
    if (!usuario) return;
    usuario.sal = generarSal();
    usuario.contrasenaHash = hashContrasena("demo2026", usuario.sal);
    guardarDatos();
    renderUsuarios();
    notificar(`Contraseña de ${btn.dataset.nombre} restablecida a «demo2026».`);
  }));
}
