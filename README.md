# Intranet Escolar

Plataforma web para la gestión académica y la comunicación institucional de una institución educativa pública. Centraliza la administración de usuarios, el registro de calificaciones y asistencia, y el tablón de comunicados, con acceso restringido según el rol: **administración**, **docente** y **estudiante/familia**.

> ⚠️ **Estado:** proyecto en fase de planificación. La documentación está completa; el código de la aplicación está por construir.

## Tabla de contenidos

- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Instalación paso a paso](#instalación-paso-a-paso)
- [Uso](#uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
- [Licencia](#licencia)

## Características

- **Autenticación por roles:** tres perfiles con permisos diferenciados.
- **Gestión de usuarios:** alta, baja y edición (solo administración).
- **Módulo académico:** registro de calificaciones y asistencia por docentes.
- **Tablón de comunicados:** publicación y lectura de avisos del centro.
- **Seguridad:** autorización en el servidor, contraseñas con hash y protección de datos de menores.

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT |
| Contraseñas | bcrypt |

## Requisitos previos

- Node.js **v18 o superior** — [nodejs.org](https://nodejs.org)
- PostgreSQL **v14 o superior**
- Git
- Gestor de paquetes: npm (incluido con Node.js)

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio> intranet-escolar
cd intranet-escolar
```

### 2. Configurar la base de datos

Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE intranet_escolar;
```

### 3. Configurar las variables de entorno

Copia el archivo de ejemplo y edítalo con tus valores locales:

```bash
cp server/.env.example server/.env
```

Configura al menos:

```env
PORT=3000
DATABASE_URL=postgres://usuario:contrasena@localhost:5432/intranet_escolar
JWT_SECRET=genera_un_secreto_largo_y_aleatorio
```

> ⚠️ **Importante:** `.env` no se versiona. Nunca subas credenciales o secretos reales al repositorio.

### 4. Ejecutar las migraciones

```bash
cd server
npm run migrate
```

### 5. Instalar dependencias del backend

```bash
cd server
npm install
```

### 6. Instalar dependencias del frontend

```bash
cd ../client
npm install
```

### 7. Ejecutar la aplicación en desarrollo

Terminal 1 — backend:

```bash
cd server
npm run dev
```

Terminal 2 — frontend:

```bash
cd client
npm run dev
```

## Uso

1. Abre el frontend en `http://localhost:5173` (por defecto en Vite).
2. Inicia sesión con las credenciales de tu rol (administración, docente o estudiante/familia).
3. Según tu rol podrás: gestionar usuarios, registrar calificaciones/asistencia o consultar datos y leer comunicados.

### Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` (server) | Ejecuta el backend en modo desarrollo con recarga automática. |
| `npm run dev` (client) | Ejecuta el frontend en modo desarrollo. |
| `npm test` | Ejecuta las pruebas del paquete. |
| `npm run lint` | Ejecuta el linter del paquete. |
| `npm run migrate` | Aplica las migraciones de la base de datos. |

## Estructura del proyecto

```
intranet-escolar/
├── client/          # Frontend React
├── server/          # Backend Node.js
├── docs/            # Documentación del proyecto
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── CLAUDE.md
```

## Documentación

- [Requerimientos](docs/requerimientos.md) — requerimientos funcionales y no funcionales.
- [Arquitectura](docs/arquitectura.md) — decisiones técnicas, estructura y API.
- [Contribución](CONTRIBUTING.md) — guía para colaborar.
- [Cambios](CHANGELOG.md) — historial de versiones.

## Licencia

Sin licencia asignada todavía. Antes de su distribución se definirá la licencia del proyecto.
