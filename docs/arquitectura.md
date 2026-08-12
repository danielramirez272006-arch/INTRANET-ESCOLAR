# Arquitectura — Intranet Escolar

> Documento de arquitectura del proyecto **Intranet Escolar**.
> Versión: 0.1.0 · Estado: en planificación · Última actualización: 2026-08-12

## 1. Visión general

La Intranet Escolar se construye como una **aplicación web de tres capas** con frontend y backend separados:

- **Frontend:** SPA en React que consume la API REST del backend.
- **Backend:** API REST en Node.js (Express) que concentra la lógica de negocio y la autorización.
- **Base de datos:** PostgreSQL, única fuente de verdad de los datos.

La comunicación entre capas se realiza exclusivamente a través de la API REST. El frontend **nunca** decide autorizaciones: solo presenta la interfaz y envía peticiones; el servidor valida cada operación.

```
+----------------+     HTTPS      +----------------+      SQL      +--------------+
|  Frontend React | ------------> |  Backend Node   | -----------> | PostgreSQL   |
|  (SPA)         | <------------ |  (Express API)  | <----------- | (datos)      |
+----------------+    JSON       +----------------+              +--------------+
```

## 2. Decisiones técnicas

| Decisión | Opción | Justificación |
|----------|--------|---------------|
| Frontend | React (Vite) | Componentes reutilizables, ecosistema maduro, requisito del proyecto. |
| Backend | Node.js + Express | API ligera, mismo lenguaje que el frontend, control total sobre la autorización. |
| Base de datos | PostgreSQL | Relacional, robusta, transacciones ACID para datos académicos. |
| Autenticación | JWT (sesión con token de acceso de corta duración) | Stateless, válido para API REST. |
| Contraseñas | bcrypt (hash con sal) | Almacenamiento seguro de credenciales. |
| Variables de entorno | `.env` (no versionado) | Credenciales y secretos fuera del repositorio. |
| Migraciones de BD | Scripts SQL versionados | Cambios de esquema reproducibles y revisables. |

> Estas decisiones son de referencia. Cualquier desviación debe justificarse, documentarse y registrarse en la sección de decisiones de este documento y en `CLAUDE.md`.

## 3. Modelo de roles y autorización

- Tres roles: `administracion`, `docente`, `estudiante/familia`.
- La autorización se aplica en el servidor mediante un **middleware de autenticación** (valida el token) y un **middleware de autorización** (valida el rol por ruta y por operación).
- Cada rol tiene una matriz de permisos:

| Operación | administracion | docente | estudiante/familia |
|-----------|:---:|:---:|:---:|
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Registrar calificaciones/asistencia | ❌ | ✅ | ❌ |
| Consultar datos académicos propios | ✅ (consulta) | ✅ (su curso) | ✅ (sus estudiantes) |
| Publicar comunicados | ✅ | ✅ | ❌ |
| Leer comunicados | ✅ | ✅ | ✅ |
| Gestionar comunicados (editar/retirar) | ✅ | ❌ | ❌ |

## 4. Modelo de datos (borrador)

Entidades principales propuestas para la base de datos:

- `usuarios` — credenciales, rol y datos de contacto.
- `estudiantes` — datos académicos de los menores (vinculados a usuarios familia/estudiante).
- `cursos` — agrupaciones de estudiantes.
- `materias` — asignaturas impartidas.
- `calificaciones` — notas por estudiante, materia y periodo.
- `asistencias` — registros de presencia por estudiante y fecha.
- `comunicados` — avisos publicados en el tablón.
- `periodos` — periodos/trimestres académicos.

> El esquema detallado (columnas, relaciones, constraints) se definirá en la fase de implementación y se registrará aquí.

## 5. Estructura de carpetas propuesta

```
INTRANET-ESCOLAR/
├── client/                  # Frontend React
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/        # Cliente de la API
│       └── ...
├── server/                  # Backend Node.js
│   ├── src/
│   │   ├── middleware/      # auth, autorización por rol
│   │   ├── routes/          # endpoints de la API
│   │   ├── controllers/
│   │   ├── models/          # acceso a PostgreSQL
│   │   ├── utils/           # validaciones, helpers
│   │   └── ...
│   ├── migrations/          # scripts SQL de migración
│   └── tests/
├── docs/                    # documentación del proyecto
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── CLAUDE.md
```

> Se evaluará la separación en paquetes propios (`client/` y `server/`) con un workspace raíz para simplificar la instalación y ejecución.

## 6. API propuesta (endpoints principales)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/auth/login` | público | Iniciar sesión, devuelve token. |
| POST | `/api/auth/logout` | autenticado | Cerrar sesión. |
| GET/POST | `/api/usuarios` | administracion | Listar/crear usuarios. |
| PUT/DELETE | `/api/usuarios/:id` | administracion | Editar/desactivar usuarios. |
| GET/POST | `/api/calificaciones` | docente | Consultar/registrar calificaciones. |
| GET | `/api/calificaciones/:estudianteId` | autorizado | Consultar calificaciones de un estudiante. |
| GET/POST | `/api/asistencias` | docente | Consultar/registrar asistencia. |
| GET | `/api/asistencias/:estudianteId` | autorizado | Consultar asistencia de un estudiante. |
| GET/POST | `/api/comunicados` | autenticado / publicar | Listar / publicar avisos. |
| PUT/DELETE | `/api/comunicados/:id` | administracion | Editar/retirar avisos. |

> Los endpoints se documentarán en detalle (request/response) en la fase de implementación.

## 7. Consideraciones de seguridad

- Autenticación y autorización resueltas **siempre en el servidor**.
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

## 9. Historial del documento

| Fecha | Versión | Descripción |
|-------|---------|-------------|
| 2026-08-12 | 0.1.0 | Versión inicial: visión, decisiones, roles, modelo de datos, estructura y API propuesta. |
