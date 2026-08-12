registrarVista("comunicados", renderComunicados);

function tarjetaComunicado(comunicado) {
  return `<div class="col-md-6 col-xl-4">
    <div class="tarjeta p-3 h-100">
      <div class="d-flex justify-content-between align-items-start gap-2">
        <span class="badge text-bg-primary">${esc(comunicado.categoria)}</span>
        ${usuarioActual().rol === "admin" ? `<button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${comunicado.id}" title="Retirar"><i class="bi bi-trash"></i></button>` : ""}
      </div>
      <h6 class="mt-2 mb-1">${esc(comunicado.titulo)}</h6>
      <p class="text-muted small mb-2">${esc(comunicado.cuerpo)}</p>
      <div class="text-muted small"><i class="bi bi-person"></i> ${esc(comunicado.autor)} · ${formatearFecha(comunicado.fecha)}</div>
    </div>
  </div>`;
}

function renderComunicados() {
  const usuario = usuarioActual();
  const puedePublicar = ["admin", "docente", "staff"].includes(usuario.rol);
  const lista = DB.comunicados.slice().sort((a, b) => b.fecha.localeCompare(a.fecha));
  const contenedor = $("#vista-comunicados");

  contenedor.innerHTML = `
    <h4 class="titulo-seccion mb-1">Tablón de comunicados</h4>
    <p class="text-muted">Avisos oficiales del centro.</p>
    ${puedePublicar ? `
      <div class="tarjeta p-3 mb-3">
        <form id="form-comunicado" class="row g-2 align-items-end">
          <div class="col-md-4"><label class="form-label">Título</label><input required class="form-control" id="com-titulo"></div>
          <div class="col-md-3"><label class="form-label">Categoría</label>
            <select class="form-select" id="com-categoria">
              ${["General", "Académico", "Administrativo", "Suspensión", "Evento"].map((c) => `<option>${c}</option>`).join("")}
            </select>
          </div>
          <div class="col-md-5"><label class="form-label">Mensaje</label><textarea required class="form-control" id="com-cuerpo" rows="2"></textarea></div>
          <div class="col-12 text-end"><button class="btn btn-primary"><i class="bi bi-megaphone"></i> Publicar</button></div>
        </form>
      </div>` : ""}
    <div class="row g-3" id="lista-comunicados"></div>`;

  $("#lista-comunicados").innerHTML = lista.length
    ? lista.map(tarjetaComunicado).join("")
    : cardVacio("Aún no hay comunicados publicados.");

  $$("#lista-comunicados .btn-eliminar").forEach((btn) => btn.addEventListener("click", () => {
    DB.comunicados = DB.comunicados.filter((c) => c.id !== Number(btn.dataset.id));
    guardarDatos();
    renderComunicados();
    notificar("Comunicado retirado.");
  }));

  const formulario = $("#form-comunicado");
  if (formulario) {
    formulario.addEventListener("submit", (event) => {
      event.preventDefault();
      const titulo = $("#com-titulo").value.trim();
      const cuerpo = $("#com-cuerpo").value.trim();
      const categoria = $("#com-categoria").value;
      DB.comunicados.push({
        id: nextId(DB.comunicados),
        titulo,
        cuerpo,
        autor: usuario.nombre,
        fecha: new Date().toISOString().slice(0, 10),
        categoria
      });
      guardarDatos();
      renderComunicados();
      notificar("Comunicado publicado.");
    });
  }
}
