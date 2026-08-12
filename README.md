# Intranet Escolar

Plataforma web para la gestión académica y comunicativa de una institución educativa. Centraliza calificaciones, asistencia, comunicados, reservas de aulas, calendario, materiales y tareas, con acceso restringido para **docentes**, **estudiantes** y **familias**.

> ⚠️ **Estado:** existe un **prototipo funcional frontend** (HTML/CSS/JS + Bootstrap con datos de prueba) para validar la interfaz y los flujos de docente, estudiante y familia. El backend (Node.js + PostgreSQL) y el frontend definitivo (React) están pendientes. La autenticación del prototipo es simulada y **no es segura**.

## Tabla de contenidos

- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Prototipo funcional](#prototipo-funcional)
- [Requisitos previos](#requisitos-previos)
- [Instalación paso a paso](#instalación-paso-a-paso)
- [Uso](#uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
- [Licencia](#licencia)

## Características

- **Autenticación por roles:** cinco perfiles con permisos diferenciados.
- **Módulo académico:** registro de calificaciones y asistencia por docentes, consulta para estudiantes y familias.
- **Tablón de comunicados:** publicación por roles autorizados y lectura por toda la comunidad.
- **Reserva de aulas y recursos:** calendario de disponibilidad y detección de conflictos de horario.
- **Calendario de actividades y exámenes:** evaluaciones, eventos y actividades con filtro por tipo.
- **Materiales y tareas:** descarga de recursos y entrega de tareas en línea.
- **Diseño responsivo:** se adapta a computadoras, tabletas y teléfonos móviles.
- **Contraseñas protegidas:** se guardan como hash (SHA-256 con sal) en `localStorage`, nunca en texto plano.

## Stack tecnológico

### Prototipo (actual)

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, CSS3, JavaScript y Bootstrap 5 (CDN) |
| Persistencia | Datos mock en `localStorage` (solo demo) |

### Objetivo (pendiente)

| Capa | Tecnología |
|------|------------|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT |
| Contraseñas | bcrypt |

## Prototipo funcional

Incluye:

- Página de inicio de sesión con **cuentas de demostración por rol**.
- Menú lateral adaptado al rol con los módulos: Inicio, Usuarios, Calificaciones, Asistencia, Comunicados, Reservas, Calendario, Materiales y Tareas, y Horarios.
- Datos de ejemplo **ficticios** (nunca datos reales de menores) que pueden restablecerse desde el menú.
- Las ediciones (notas, asistencia, comunicados, reservas, tareas, usuarios) se guardan en el navegador.

## Requisitos previos

- Un navegador moderno. Opcional: Python o Node.js para servir la carpeta estáticamente.

## Instalación paso a paso

### Opción A — abrir directamente

Abre `frontend/index.html` en el navegador.

### Opción B — servidor estático (recomendado)

```bash
cd frontend
python -m http.server 8080
```

Luego entra en `http://localhost:8080`.

## Uso

1. Abre la página de inicio (`index.html`).
2. Selecciona una cuenta de demostración e ingresa la contraseña `demo2026`.
3. Explora los módulos según el rol:

| Cuenta | Rol | Puede hacer |
|--------|-----|-------------|
| Carlos Ríos | Docente | Registrar calificaciones y asistencia, publicar comunicados, reservar recursos |
| Ana Torres | Estudiante | Consultar notas, horario y asistencia; entregar tareas |
| Raquel Torres | Familia | Seguimiento académico de su estudiante |

## Estructura del proyecto

```
intranet-escolar/
├── frontend/       # Prototipo funcional (HTML/CSS/JS + Bootstrap)
│   ├── index.html
│   ├── dashboard.html
│   ├── css/styles.css
│   └── js/         # util, crypto, datos, auth, app, login, modulos/
├── docs/           # Documentación del proyecto
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── CLAUDE.md
```

> `client/` (React) y `server/` (Node.js) se crearán en la implementación con backend.

## Documentación

- [Requerimientos](docs/requerimientos.md) — requerimientos funcionales y no funcionales, roles y prototipo.
- [Arquitectura](docs/arquitectura.md) — decisiones técnicas, prototipo, estructura y API propuesta.
- [Cómo se construyó el prototipo](docs/guia-construccion-prototipo.md) — decisiones, estructura y verificación del prototipo frontend.
- [Contribución](CONTRIBUTING.md) — guía para colaborar.
- [Cambios](CHANGELOG.md) — historial de versiones.

## Licencia

Sin licencia asignada todavía. Antes de su distribución se definirá la licencia del proyecto.
