# Arquitectura — Intranet Escolar

> Documento de arquitectura del proyecto **Intranet Escolar**.
> Versión: 0.4.1 · Estado: prototipo frontend funcional + identidad visual escolar + arquitectura objetivo · Última actualización: 2026-08-12

## 1. Visión general

La Intranet Escolar se construirá como una **aplicación web de tres capas** con frontend y backend separados:

- **Frontend:** SPA en React que consume la API REST del backend.
- **Backend:** API REST en Node.js (Express) que concentra la lógica de negocio y la autorización.
- **Base de datos:** PostgreSQL, única fuente de verdad de los datos.

La comunicación entre capas se realizará exclusivamente a través de la API REST. El frontend **nunca** decide autorizaciones: solo presenta la interfaz y envía peticiones; el servidor valida cada operación.

```
+----------------+     HTTPS      +----------------+      SQL      +--------------+
|  Frontend React | ------------> |  Backend Node   | -----------> | PostgreSQL   |
|  (SPA)         | <------------ |  (Express API)  | <----------- | (datos)      |
+----------------+    JSON       +----------------+              +--------------+
```

## 1.1 Prototipo actual (frontend estático sin backend)

Para validar la interfaz y los flujos de docente, estudiante y familia se construyó un **prototipo funcional** en `frontend/` con tecnología distinta al stack objetivo:

- **Tecnología:** HTML5 + CSS3 + JavaScript (vanilla) + Bootstrap 5 (vía CDN).
- **Datos:** mock ficticios en `frontend/js/datos.js`, con persistencia en `localStorage` (botón "Restablecer datos de demo").
- **Sesión:** simulada en `localStorage`; los roles se conmutan con cuentas de demostración.
- **Autorización:** el menú y las vistas se filtran por rol en el frontend.

> ⚠️ **Advertencia:** este prototipo es solo para demostración. La autenticación y autorización simuladas en el frontend **no son seguras** y deben reemplazarse por la solución con backend (sección 3). Bootstrap se consume por CDN; en producción se descargará/versionará o se migrará al stack objetivo.

Estructura del prototipo:

```
frontend/
├── index.html            # Inicio de sesión (cuentas de demostración por rol)
├── dashboard.html        # Aplicación principal con menú por rol
├── css/styles.css        # Estilos propios sobre Bootstrap
└── js/
    ├── util.js           # Helpers ($, $$, escape HTML)
    ├── crypto.js         # SHA-256 síncrono y helpers de contraseñas (hash + sal)
    ├── datos.js          # Datos mock ficticios, persistencia (cargar/guardar/migrar) y generadores
    ├── auth.js           # Sesión simulada (localStorage) y roles
    ├── app.js            # Menú, enrutado de vistas
    ├── login.js          # Lógica de la página de acceso
    └── modulos/          # Renderizadores por módulo
        ├── inicio.js     # Resumen por rol
        ├── calificaciones.js
        ├── asistencia.js
        ├── comunicados.js
        ├── reservas.js
        ├── consultas.js  # Calendario, materiales y horarios
        └── usuarios.js   # Gestión local de usuarios para docentes
```

> Las contraseñas demo se guardan hasheadas (SHA-256 con sal) en `localStorage` y cada cuenta demo tiene una contraseña distinta. Los cambios de versión de los datos locales migran las credenciales y las entregas ya almacenadas. Sigue siendo una simulación de demostración: la seguridad real requiere el backend (sección 3).

## 2. Decisiones técnicas

| Decisión | Opción | Justificación |
|----------|--------|---------------|
| Frontend (objetivo) | React (Vite) | Componentes reutilizables, ecosistema maduro, requisito del proyecto. |
| Frontend (prototipo) | HTML/CSS/JS + Bootstrap 5 | Validación rápida de interfaz sin toolchain; **desviación justificada** y documentada. |
| Backend | Node.js + Express | API ligera, mismo lenguaje que el frontend, control total sobre la autorización. |
| Base de datos | PostgreSQL | Relacional, robusta, transacciones ACID para datos académicos. |
| Autenticación | JWT (sesión con token de acceso de corta duración) | Stateless, válido para API REST. |
| Contraseñas | bcrypt (hash con sal) | Almacenamiento seguro de credenciales. |
| Variables de entorno | `.env` (no versionado) | Credenciales y secretos fuera del repositorio. |
| Migraciones de BD | Scripts SQL versionados | Cambios de esquema reproducibles y revisables. |
| Persistencia del prototipo | `localStorage` del navegador | Solo demo; los datos quedan aislados por navegador. |

> Estas decisiones son de referencia. Cualquier desviación debe justificarse, documentarse y registrarse en la sección de decisiones de este documento y en `CLAUDE.md`.

## 3. Modelo de roles y autorización

Tres roles: `docente`, `estudiante` y `familia`.

La autorización se aplicará en el servidor mediante un **middleware de autenticación** (valida el token) y un **middleware de autorización** (valida el rol por ruta y por operación). En el prototipo el rol solo oculta/ muestra opciones en la interfaz, lo cual **no es una medida de seguridad**.

Matriz de permisos (ver `docs/requerimientos.md`, sección 7).

## 4. Modelo de datos (borrador)

Entidades principales propuestas para la base de datos:

- `usuarios` — credenciales, rol y datos de contacto.
- `estudiantes` — datos académicos de los menores (vinculados a usuarios familia/estudiante).
- `cursos` — agrupaciones de estudiantes.
- `materias` — asignaturas impartidas.
- `periodos` — periodos/trimestres académicos.
- `calificaciones` — notas por estudiante, materia y periodo.
- `asistencias` — registros de presencia por estudiante y fecha (Presente/Ausente/Justificado/Tardanza).
- `comunicados` — avisos publicados en el tablón (con categoría).
- `recursos` — aulas, laboratorios y equipos.
- `reservas` — reservas de recursos con fecha y horario.
- `calendario` — evaluaciones, actividades y eventos institucionales.
- `materiales` — recursos educativos y tareas por materia.
- `entregas` — entregas de tareas por estudiante.

> El esquema detallado (columnas, relaciones, constraints) se definirá en la fase de implementación y se registrará aquí. El prototipo ya modela estas entidades con datos ficticios en `frontend/js/datos.js`.

## 5. Estructura de carpetas propuesta

```
INTRANET-ESCOLAR/
├── frontend/               # Prototipo funcional (HTML/CSS/JS + Bootstrap)
│   ├── index.html
│   ├── dashboard.html
│   ├── css/
│   └── js/                 # util, datos, auth, app, login, modulos/
├── client/                 # Frontend React (objetivo, pendiente)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/       # Cliente de la API
│       └── ...
├── server/                 # Backend Node.js (pendiente)
│   ├── src/
│   │   ├── middleware/     # auth, autorización por rol
│   │   ├── routes/         # endpoints de la API
│   │   ├── controllers/
│   │   ├── models/         # acceso a PostgreSQL
│   │   ├── utils/          # validaciones, helpers
│   │   └── ...
│   ├── migrations/         # scripts SQL de migración
│   └── tests/
├── docs/                   # documentación del proyecto
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── CLAUDE.md
```

> El prototipo convive en `frontend/`; el `client/` React se creará cuando comience la implementación con backend.

## 6. API propuesta (endpoints principales)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/auth/login` | público | Iniciar sesión, devuelve token. |
| POST | `/api/auth/logout` | autenticado | Cerrar sesión. |
| GET/POST | `/api/calificaciones` | docente | Consultar/registrar calificaciones. |
| GET | `/api/calificaciones/:estudianteId` | autorizado | Consultar calificaciones de un estudiante. |
| GET/POST | `/api/asistencias` | docente | Consultar/registrar asistencia. |
| GET | `/api/asistencias/:estudianteId` | autorizado | Consultar asistencia de un estudiante. |
| GET/POST | `/api/comunicados` | autenticado / publicar | Listar / publicar avisos. |
| PUT/DELETE | `/api/comunicados/:id` | docente autor | Editar/retirar avisos propios. |
| GET/POST | `/api/recursos/:id/reservas` | docente | Consultar/reservar recursos. |
| GET | `/api/calendario` | autenticado | Consultar actividades y exámenes. |
| GET/POST | `/api/materiales` | autenticado / docente | Consultar/publicar materiales y tareas. |

> Los endpoints se documentarán en detalle (request/response) en la fase de implementación.

## 7. Consideraciones de seguridad

- Autenticación y autorización resueltas **siempre en el servidor** (el prototipo solo la simula).
- Contraseñas hasheadas con bcrypt; nunca en texto plano.
- Consultas SQL parametrizadas (previene inyección).
- Validación de toda entrada de usuario en el servidor.
- Tokens con expiración y revocación en el servidor.
- Sin datos personales de menores en logs, errores o respuestas no autorizadas.
- Datos de prueba siempre ficticios.

## 8. Registro de decisiones (ADR)

| Fecha | Decisión | Justificación |
|-------|----------|---------------|
| 2026-08-12 | Stack React + Node.js + PostgreSQL | Requisito del proyecto y capacidades del equipo. |
| 2026-08-12 | API REST con JWT | Separación frontend/backend y sesiones stateless. |
| 2026-08-12 | Prototipo frontend en HTML/CSS/JS + Bootstrap con datos mock | Validar interfaz y flujos de los 5 roles sin backend; **desviación temporal** del stack objetivo, documentada y registrada. |
| 2026-08-12 | Credenciales demo individuales y migración local v6 | Evitar una clave compartida entre cuentas demo y preservar el estado local al corregir el modelo de entregas. |

## 9. Historial del documento

| Fecha | Versión | Descripción |
|-------|---------|-------------|
| 2026-08-12 | 0.1.0 | Versión inicial: visión, decisiones, roles, modelo de datos, estructura y API propuesta. |
| 2026-08-12 | 0.2.0 | Se agrega el prototipo frontend funcional (`frontend/`), tres roles y módulos nuevos; se registra la desviación del stack en ADR. |
| 2026-08-12 | 0.3.0 | Se documenta el acceso con contraseña demo, la eliminación de acceso rápido y la limitación a tres roles. |
| 2026-08-12 | 0.4.0 | Identidad visual de Liceo Escolar San Miguel (escudo, badges, hero banner, categorías), soporte UTF-8 en crypto y suite de pruebas unitarias. |
| 2026-08-12 | 0.4.1 | Corrección del registro de notas, entregas vinculadas al estudiante, módulo de usuarios integrado y credenciales demo individuales. |
