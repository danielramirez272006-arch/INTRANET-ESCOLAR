# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto se adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [0.4.1] - 2026-08-12

### Corregido

- Al guardar, el módulo de calificaciones crea los registros que no existían previamente; las notas nuevas ya persisten en `localStorage`.
- Las entregas de tareas se vinculan por estudiante y material, por lo que la familia ve el estado real de entrega de su estudiante.
- Se integró la vista y el script de gestión de usuarios en el dashboard para docentes.
- El restablecimiento de contraseña solicita una nueva clave válida en lugar de asignar una contraseña común.

### Cambiado

- Las cuatro cuentas demo ahora usan contraseñas individuales, verificadas por hash SHA-256 con sal. Las credenciales de uso están documentadas en `README.md`.
- La versión de datos locales se elevó a 6 e incluye una migración de credenciales demo y entregas existentes.

## [0.4.0] - 2026-08-12

### Visuales & UX
- Identidad visual e institucional del **Liceo Escolar San Miguel**:
  - Escudo escolar oficial (`frontend/img/escudo.png`) e insignia del "Ciclo Lectivo 2026".
  - Hero banner educativo con ilustración (`frontend/img/banner.png`) y bienvenida contextual por rol.
  - Paleta de colores académica (azul marino, zafiro, verde esmeralda y oro) con tipografía Inter y sombras elevadas.
  - Menú lateral categorizado por secciones: **Portal**, **Gestión Académica** y **Vida Escolar**.
  - Tarjetas motivacionales con citas educativas e insignias de rol coloreadas.

### Criptografía & Pruebas
- Soporte para codificación UTF-8 en `sha256()` para procesar correctamente acentos, caracteres especiales y emojis (`frontend/js/crypto.js`).
- Suite de pruebas unitarias automatizada (`tests/crypto.test.js`) ejecutable con `node --test` (10/10 pruebas superadas).

## [0.3.0] - 2026-08-12

### Seguridad

- Las contraseñas de demostración ya no se almacenan ni se muestran en texto plano: se guardan como hash SHA-256 con sal (`js/crypto.js`).
- La página de acceso deja de mostrar la pista con la contraseña en claro de cada cuenta.
- El inicio de sesión valida ahora la contraseña de la cuenta y usa los datos persistidos del navegador (antes solo consultaba los datos iniciales, por lo que los usuarios creados no podían entrar y los desactivados seguían pudiendo).
- Las cuentas desactivadas no pueden iniciar sesión ni mantener una sesión activa (`usuarioActual` rechaza usuarios inactivos).

### Corregido

- Permisos del personal administrativo: ahora puede consultar asistencia, igual que el resto del módulo académico.
- Accesibilidad: el enlace «Saltar al contenido» del panel dirige al contenido principal.
- Login: los usuarios dados de alta y las bajas se reflejan correctamente en la página de acceso.
- Gestión de usuarios: al crear un docente se asignan curso y materia, y al crear un estudiante/familia se vincula el estudiante (evita vistas vacías); se agregó campo de contraseña inicial y el botón de restablecimiento de contraseña ahora funciona de verdad.
- Reservas: celda vacía con número de columnas correcto según el rol y validación de fecha pasada.
- Calificaciones: se valida que las notas estén dentro de 0–10 antes de guardar.
- Asistencia: no se permite registrar en fechas futuras.
- Persistencia: migración de datos guardados con versiones previas (versión 2 → 3) que convierte contraseñas en claro a hash y garantiza colecciones faltantes.

### Cambiado

- El prototipo limita el acceso a los roles docente, estudiante y familia; se retiraron administración y personal administrativo, junto con sus cuentas demo y vistas exclusivas.
- La carga/persistencia de datos (`cargarDatos`, `guardarDatos`, `resetearDatos`, `nextId`) se centralizó en `js/datos.js`, compartida por las páginas de acceso y el dashboard.
- Nuevo archivo `js/crypto.js` con SHA-256 síncrono y helpers de contraseñas (funciona al abrir `index.html` directo, sin depender de `crypto.subtle`).
- Mejoras visuales: favicon, `theme-color`, animación de entrada de vistas, estilo del menú móvil, barra de desplazamiento personalizada y soporte de `prefers-reduced-motion`.

### Agregado

- Gestión de usuarios: edición de nombre y correo con validación de formato y duplicados.
- Comunicados: administración puede editar comunicados publicados, además de retirarlos.
- Materiales y tareas: docentes pueden publicar materiales y tareas con fecha de entrega.
- Documentación raíz del proyecto:
  - `README.md`: presentación, instalación paso a paso, uso y licencia.
  - `CONTRIBUTING.md`: guía de colaboración (ramas, commits, pull requests).
  - `CLAUDE.md`: memoria de trabajo para el asistente de IA.
- Documentación en `docs/`:
  - `docs/requerimientos.md`: requerimientos funcionales y no funcionales.
  - `docs/arquitectura.md`: decisiones técnicas, stack, estructura y API propuesta.
- `CHANGELOG.md`: historial de versiones del proyecto.

### Eliminado

- Eliminada la carpeta `client` (no versionada en Git) con todo su contenido, incluido el frontend de prueba.

### Agregado

- Prototipo funcional frontend en `frontend/` (HTML5 + CSS3 + JavaScript + Bootstrap 5, sin backend):
  - Inicio de sesión con cuentas de demostración por rol.
  - Menú según el rol y módulos de usuarios, calificaciones, asistencia, comunicados, reservas, calendario, materiales/tareas y horarios.
  - Datos de prueba ficticios con persistencia en `localStorage` y botón de restablecimiento.
- Actualización de `docs/requerimientos.md` (v0.2.0): cinco roles y módulos nuevos.
- Actualización de `docs/arquitectura.md` (v0.2.0): prototipo frontend y ADR de la desviación del stack.
- Actualización de `README.md` con instrucciones de uso del prototipo.
- `docs/guia-construccion-prototipo.md`: proceso seguido para construir el prototipo (decisiones, estructura, datos y verificación).
- Requisito no funcional precisado: el código se versiona en Git desde el inicio del proyecto (RNF-03.1).

## [0.1.0] - 2026-08-12

### Agregado

- Repositorio Git inicializado (commit inicial).
- Esqueleto inicial del proyecto con documentación base.

---

## Guía del formato

- **Agregado (Added)** — nuevas funcionalidades o contenidos.
- **Cambiado (Changed)** — cambios en funcionalidad existente.
- **Corregido (Fixed)** — corrección de errores.
- **Eliminado (Removed)** — funcionalidades o contenidos retirados.
- **Seguridad (Security)** — correcciones o mejoras de seguridad.

Las versiones siguen la regla `MAJOR.MINOR.PATCH` (semver): se incrementa `MAJOR` ante cambios incompatibles, `MINOR` ante nuevas funcionalidades retrocompatibles y `PATCH` ante correcciones retrocompatibles.
