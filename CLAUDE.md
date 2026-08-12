# CLAUDE.md — Memoria del Asistente

Este archivo es la **memoria de trabajo** para el asistente de IA que colabore en este repositorio. Consúltalo al inicio de cada sesión y respétalo en todo momento. Está alineado con la documentación de `docs/requerimientos.md` y `docs/arquitectura.md`.

## 1. Contexto

- **Proyecto:** Intranet Escolar para una institución educativa pública.
- **Propósito:** Centralizar la gestión académica y la comunicación institucional entre docentes, estudiantes y familias en una sola plataforma web.
- **Beneficiarios:** Personal docente, estudiantes y familias.
- **Naturaleza del dato:** El sistema maneja **datos de menores de edad**; todo diseño, desarrollo y operación debe priorizar su protección y privacidad.
- **Estado actual:** Proyecto en fase de planificación; se construye de forma incremental con control de versiones en Git.

## 2. Requerimientos

### Funcionales
- [ ] **Autenticación por roles:** acceso con tres perfiles — docente, estudiante y familia.
- [ ] **Módulo académico:** registro de calificaciones y/o asistencia por parte de docentes.
- [ ] **Tablón de comunicados:** publicación y lectura de avisos del centro.
- [ ] **Reserva de aulas y recursos:** disponibilidad, reservas y gestión de conflictos de horario.
- [ ] **Calendario académico:** evaluaciones, actividades y eventos institucionales.
- [ ] **Materiales y tareas:** recursos educativos y entrega de tareas en línea.
- [ ] **Restricción de acceso:** cada rol solo puede ver y operar sobre lo que le corresponde.

### No funcionales
- [ ] **Usabilidad:** interfaz clara, sencilla y accesible.
- [ ] **Privacidad:** protección de datos sensibles (especialmente de menores) conforme a la normativa vigente.
- [ ] **Control de versiones:** todo el código versionado en Git con historial limpio y documentado.

> El detalle completo de criterios de aceptación vive en `docs/requerimientos.md`.

## 3. Reglas

- La **autenticación y autorización** se resuelven siempre en el servidor; nunca confiar en la interfaz para restringir acceso.
- Cada cambio de código debe **verse reflejado en un commit descriptivo** siguiendo la convención definida en `CONTRIBUTING.md`.
- Las **credenciales y secretos** nunca se versionan; se cargan mediante variables de entorno.
- Los **datos personales** se minimizan: solo se almacena la información estrictamente necesaria.
- Toda nueva funcionalidad debe actualizar la documentación correspondiente (README, CHANGELOG, docs).
- **Toda funcionalidad nueva debe ir acompañada de pruebas**, tal como se define en `CONTRIBUTING.md`.
- Ante ambigüedad entre este archivo y la documentación, se resuelve **a favor de la seguridad y privacidad de los menores**.

## 4. Restricciones

- No exponer datos personales o académicos en logs, mensajes de error o respuestas de API no autorizadas.
- No implementar "roles" o permisos únicamente en el frontend.
- No usar contraseñas en texto plano; siempre hasheadas y con sal.
- No incluir datos reales de estudiantes en demos, fixtures o capturas de pantalla (usar datos de prueba ficticios).
- No saltarse el proceso de Git: no commits directos a la rama principal sin pasar por pull request/revisión.
- No introducir dependencias innecesarias sin justificación y sin actualizar la documentación.
- El stack técnico de referencia es **React + Node.js + PostgreSQL**; cualquier desviación debe justificarse y documentarse.

## 5. Objetivos

1. Entregar una intranet funcional que cumpla todos los requerimientos mínimos funcionales y no funcionales.
2. Garantizar que la plataforma sea segura y cumpla con la protección de datos de menores.
3. Lograr un código limpio, legible y fácil de mantener.
4. Documentar el proyecto de forma completa y accesible para cualquier persona que se incorpore.
5. Trabajar con Git de forma profesional: historial claro, ramas por funcionalidad y revisiones.

## 6. Memoria

- **Decisiones tomadas:**
  - Stack propuesto (objetivo): React (frontend), Node.js (backend), PostgreSQL (base de datos).
  - Modelo de tres roles: docente, estudiante y familia.
  - Prototipo frontend funcional en HTML/CSS/JS + Bootstrap con datos mock y sin backend (2026-08-12). Es una **desviación temporal** del stack objetivo, justificada para validar interfaz; documentada en `docs/arquitectura.md` (ADR).
- **Progreso del proyecto:**
  - Repositorio Git inicializado (commit inicial).
  - Documentación raíz (README, CLAUDE.md, CONTRIBUTING.md, CHANGELOG.md, docs/).
  - Prototipo frontend en `frontend/` con login por cuenta y contraseña, tres roles (docente, estudiante y familia) y módulos de calificaciones, asistencia, comunicados, reservas, calendario, materiales/tareas y horarios. Datos ficticios con persistencia en `localStorage`.
- **Próximos pasos pendientes:**
  - Definir el modelo de datos definitivo y la estructura de la API.
  - Implementar backend Node.js/Express con autorización en servidor y PostgreSQL.
  - Migrar el frontend del prototipo a React (stack objetivo).
  - Reemplazar la sesión simulada del prototipo por autenticación real (JWT + bcrypt).
  - Agregar pruebas automatizadas del prototipo.
  - Registrar decisiones futuras aquí a medida que se tomen.

## 7. Buenas Prácticas

- **Commits:** mensajes claros, en español o inglés (elegir uno y mantenerlo), con prefijo semántico (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- **Ramas:** una rama por funcionalidad, nombres descriptivos (ej. `feature/login-roles`).
- **Código:** seguir el estilo del proyecto, sin comentarios innecesarios y con nombres de variables autoexplicativos.
- **Seguridad:** validar toda entrada de usuario; usar consultas parametrizadas; aplicar control de acceso en el servidor.
- **Documentación:** toda decisión técnica relevante debe registrarse en `docs/arquitectura.md` y este archivo.
- **Pruebas:** correr las pruebas antes de proponer cambios; no romper el estado verde de la rama principal.
- **Código limpio:** si cambias una línea, deja la línea; si dejas la línea, cambia la línea: no mezclar cambios no relacionados en un mismo commit.
