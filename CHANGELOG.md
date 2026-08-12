# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto se adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Agregado

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
