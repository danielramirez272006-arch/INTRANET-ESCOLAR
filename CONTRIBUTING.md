# Contributing — Intranet Escolar

Guía para colaborar en este proyecto. Léela antes de realizar cualquier cambio y respétala en todo momento. Toda contribución debe cumplir estas normas; las excepciones se debaten en la pull request.

## 1. Flujo de trabajo

1. Crea una rama por funcionalidad desde `main` (nunca commits directos a `main`).
2. Realiza commits atómicos y descriptivos siguiendo la convención de la sección 3.
3. Asegúrate de que las pruebas pasan localmente antes de subir cambios.
4. Abre una pull request hacia `main` con una descripción clara del cambio.
5. Espera la revisión. La rama principal solo se actualiza tras aprobación.

## 2. Ramas

- Una rama por funcionalidad, corrección o tarea de documentación.
- Nombre descriptivo y en minúsculas, con separación por guiones.
- Prefijos recomendados:
  - `feature/` — nueva funcionalidad (ej. `feature/login-roles`).
  - `fix/` — corrección de errores (ej. `fix/sesion-timeout`).
  - `docs/` — documentación (ej. `docs/arquitectura`).
  - `chore/` — tareas de mantenimiento (ej. `chore/deps-seguridad`).
  - `test/` — pruebas (ej. `test/modulo-academico`).
- Reglas:
  - Mantén la rama actualizada con `main` (rebase antes de abrir la PR).
  - Elimina la rama tras su fusión.
  - Una rama no debe mezclar cambios no relacionados.

## 3. Commits

- Mensajes claros, en imperativo, en **español** (idioma elegido para el proyecto).
- Prefijo semántico obligatorio: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`, `perf:`, `style:`.
- Formato: `tipo: descripción breve` (máximo 72 caracteres en el título).
- Ejemplos válidos:
  - `feat: agregar autenticación por roles`
  - `fix: corregir expiración de sesión`
  - `docs: actualizar arquitectura del backend`
- Reglas:
  - Un commit = un cambio lógico. No mezclar cambios no relacionados.
  - No commits vacíos ni mensajes genéricos como "cambios" o "update".
  - Nunca versionar credenciales, secretos o datos personales reales.
  - Si el commit corrige un fallo de seguridad, menciónalo explícitamente en el mensaje.

## 4. Pull requests

### Antes de abrir
- La rama está actualizada con `main`.
- Las pruebas pasan y el estado de la rama principal no se rompe.
- La documentación afectada (README, CHANGELOG, docs/) está actualizada.
- No se incluyen datos reales de estudiantes ni capturas sensibles.

### Contenido de la PR
- Título descriptivo que resuma el cambio.
- Descripción: qué se hace, por qué y cómo se verifica.
- Referencia a requisitos si aplica (ej. `RF-03.1`).
- Resultado de las pruebas ejecutadas.

### Revisión
- El autor responde los comentarios y hace los ajustes solicitados.
- La rama se fusiona con squash o merge convencional tras aprobación; se mantiene un historial limpio.

## 5. Pruebas

- **Toda funcionalidad nueva debe ir acompañada de pruebas.**
- Ejecuta la suite completa antes de abrir la PR:
  - Frontend: `npm test` (en la raíz del paquete correspondiente).
  - Backend: `npm test` (en el paquete correspondiente).
  - Lint: `npm run lint` (o el script definido en el paquete).
- No romper el estado verde de `main`.
- Las pruebas no deben depender de datos reales de estudiantes; usar fixtures ficticios.

## 6. Estilo de código

- Seguir el estilo del proyecto: sin comentarios innecesarios, nombres autoexplicativos.
- Validar toda entrada de usuario y usar consultas parametrizadas.
- Resolver autenticación y autorización siempre en el servidor.
- Si cambias una línea, deja la línea; si dejas la línea, cambia la línea (no mezclar cambios no relacionados en un commit).

## 7. Seguridad y privacidad

- Las credenciales y secretos se cargan por variables de entorno (`.env`), nunca en el código ni en el historial.
- Los datos de menores son protegidos: no se exponen en logs, errores o respuestas no autorizadas.
- No se usan datos reales de estudiantes en demos, fixtures o capturas.
- Ante cualquier duda entre este documento y otra guía, se resuelve **a favor de la seguridad y privacidad de los menores**.

## 8. Reporte de incidentes de seguridad

- No publiques vulnerabilidades en issues públicos.
- Reporta en privado al equipo de administración del repositorio antes de cualquier divulgación.
