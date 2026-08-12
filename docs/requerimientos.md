# Requerimientos — Intranet Escolar

> Documento de requerimientos del proyecto **Intranet Escolar**.
> Versión: 0.2.0 · Estado: en desarrollo (prototipo funcional frontend) · Última actualización: 2026-08-12

## 1. Descripción general

La Intranet Escolar es una plataforma web que centraliza la gestión académica, administrativa y comunicativa de una institución educativa. Permite que docentes, personal administrativo, estudiantes y familias accedan a la información relevante de manera segura, rápida y organizada, garantizando que cada rol acceda únicamente a lo que le corresponde.

**Principio rector:** el sistema maneja datos de menores de edad; la protección y privacidad de esos datos prevalece sobre cualquier otra consideración funcional o técnica.

## 2. Requerimientos funcionales (RF)

> Se presentan como listas de tareas verificables. Un ítem marcado `[x]` está implementado y aceptado en el sistema completo. El estado del prototipo se detalla en la [sección 6](#6-protipo-funcional-frontend).

### RF-01 Autenticación por roles
- [ ] RF-01.1 El sistema permite iniciar sesión con usuario y contraseña.
- [ ] RF-01.2 La contraseña se almacena de forma segura (hash con sal) y nunca en texto plano.
- [ ] RF-01.3 Existen cinco perfiles de acceso: `administracion`, `docente`, `personal_administrativo`, `estudiante` y `familia`.
- [ ] RF-01.4 El sistema permite cerrar sesión de forma segura (invalida la sesión en el servidor).
- [ ] RF-01.5 El rol se asigna al crear el usuario y no puede modificarse desde el frontend.

### RF-02 Gestión de usuarios
- [ ] RF-02.1 Alta de usuarios: el perfil `administracion` puede crear usuarios de cualquier rol.
- [ ] RF-02.2 Baja de usuarios: el perfil `administracion` puede desactivar/eliminar usuarios.
- [ ] RF-02.3 Edición de usuarios: el perfil `administracion` puede modificar datos y resetear contraseñas.
- [ ] RF-02.4 El sistema valida que no existan usuarios duplicados (p. ej. correo o documento único).
- [ ] RF-02.5 Solo el perfil `administracion` tiene acceso a la gestión de usuarios.

### RF-03 Módulo académico: calificaciones y asistencia
- [ ] RF-03.1 El perfil `docente` puede registrar calificaciones de sus estudiantes.
- [ ] RF-03.2 El perfil `docente` puede registrar asistencia de sus estudiantes.
- [ ] RF-03.3 El perfil `docente` puede justificar ausencias y registrar tardanzas.
- [ ] RF-03.4 Las calificaciones y la asistencia quedan asociadas a un curso, una materia y un periodo/trimestre.
- [ ] RF-03.5 El perfil `estudiante/familia` puede consultar calificaciones y asistencia de sus estudiantes.
- [ ] RF-03.6 El perfil `estudiante/familia` no puede modificar datos académicos.
- [ ] RF-03.7 El perfil `administracion` y `personal_administrativo` pueden consultar el módulo académico sin modificarlo.
- [ ] RF-03.8 El sistema genera reportes de asistencia por curso y alerta ausencias recurrentes.

### RF-04 Tablón de comunicados y circulares
- [ ] RF-04.1 Los perfiles `administracion`, `docente` y `personal_administrativo` pueden publicar comunicados.
- [ ] RF-04.2 Los comunicados se clasifican por categoría (General, Académico, Administrativo, Suspensión, Evento).
- [ ] RF-04.3 Los comunicados muestran título, cuerpo, autor, fecha de publicación y categoría.
- [ ] RF-04.4 Todos los roles pueden leer los comunicados publicados.
- [ ] RF-04.5 El perfil `administracion` puede editar y retirar comunicados.
- [ ] RF-04.6 El sistema mantiene un historial de publicaciones.

### RF-05 Reserva de aulas y recursos
- [ ] RF-05.1 Los perfiles `docente` y `personal_administrativo` pueden reservar aulas, laboratorios y equipos.
- [ ] RF-05.2 El sistema muestra el calendario de disponibilidad de cada recurso.
- [ ] RF-05.3 El sistema detecta conflictos de horario y rechaza reservas superpuestas.
- [ ] RF-05.4 La reserva confirma automáticamente si no hay conflicto.
- [ ] RF-05.5 El perfil `administracion` puede gestionar y cancelar reservas.

### RF-06 Calendario de actividades y exámenes
- [ ] RF-06.1 Todos los roles consultan el calendario de evaluaciones, actividades y eventos institucionales.
- [ ] RF-06.2 El calendario muestra fecha, tipo y destinatarios de cada evento.
- [ ] RF-06.3 El sistema permite filtrar eventos por tipo.
- [ ] RF-06.4 El sistema envía recordatorios automáticos de fechas relevantes.

### RF-07 Materiales, tareas y recursos educativos
- [ ] RF-07.1 El perfil `docente` publica materiales por asignatura (PDF, enlaces, tareas).
- [ ] RF-07.2 El perfil `estudiante` descarga materiales y entrega tareas en línea.
- [ ] RF-07.3 El perfil `familia` consulta el material y el estado de entrega de las tareas de su estudiante.
- [ ] RF-07.4 El sistema mantiene un historial de materiales publicados.

### RF-08 Restricción de acceso según rol
- [ ] RF-08.1 La autorización se valida en el servidor en cada operación (nunca solo en el frontend).
- [ ] RF-08.2 Cada rol solo ve en la interfaz las opciones que le corresponden.
- [ ] RF-08.3 El acceso a una ruta o API no autorizada devuelve error y no filtra datos.
- [ ] RF-08.4 El sistema impide que un usuario consulte datos de otro curso/grupo no autorizado.

## 3. Requerimientos no funcionales (RNF)

### RNF-01 Usabilidad
- [ ] RNF-01.1 La interfaz es clara, sencilla e intuitiva para personas no técnicas.
- [ ] RNF-01.2 La navegación entre módulos se realiza en máximo tres clics.
- [ ] RNF-01.3 La interfaz es accesible (contraste suficiente, etiquetas en formularios, navegación por teclado).

### RNF-02 Privacidad y seguridad
- [ ] RNF-02.1 Los datos personales y académicos se minimizan: solo se almacena lo estrictamente necesario.
- [ ] RNF-02.2 Los datos sensibles (especialmente de menores) no se exponen en logs, errores o respuestas no autorizadas.
- [ ] RNF-02.3 Toda entrada de usuario se valida y las consultas a base de datos son parametrizadas.
- [ ] RNF-02.4 Las credenciales y secretos se cargan mediante variables de entorno y nunca se versionan.
- [ ] RNF-02.5 Los datos de prueba son ficticios; nunca se usan datos reales de estudiantes en demos.

### RNF-03 Mantenibilidad y control de versiones
- [ ] RNF-03.1 Todo el código está versionado en Git con historial limpio y descriptivo.
- [ ] RNF-03.2 El código sigue convenciones de estilo y nombres autoexplicativos.
- [ ] RNF-03.3 Toda funcionalidad nueva incluye pruebas y actualización de la documentación.

### RNF-04 Diseño responsivo
- [ ] RNF-04.1 La interfaz se adapta a computadoras, tabletas y teléfonos móviles.
- [ ] RNF-04.2 Los módulos principales son operables en pantallas táctiles.

## 4. Criterios de aceptación generales

Un entregable se considera **aceptado** cuando:

1. Cumple el requisito funcional o no funcional correspondiente según su lista de verificación.
2. Pasa las pruebas definidas sin romper el estado verde de la rama principal.
3. La autorización está resuelta en el servidor para toda operación involucrada.
4. No se expone información sensible de menores.
5. La documentación (README, CHANGELOG, docs/) refleja el cambio.

## 5. Fuera de alcance (prototipo v0.2)

- Mensajería privada entre usuarios.
- Gestión de títulos o trámites administrativos digitales.
- Aplicación móvil nativa (la plataforma es web responsive).
- Integración con sistemas externos de pago o transporte.
- Notificaciones automáticas reales (correo/push): en el prototipo son simuladas.

## 6. Prototipo funcional frontend

> Construido el 2026-08-12 para validar la interfaz y los flujos de los cinco roles **sin backend**.

**Qué incluye:**

- Página de inicio de sesión con cuentas de demostración por rol (`frontend/index.html`).
- Aplicación de una sola vista con menú lateral según el rol (`frontend/dashboard.html`).
- Módulos funcionales con datos de prueba ficticios y persistencia local:
  - Gestión de usuarios (alta, activar/desactivar, restablecer contraseña simulada).
  - Calificaciones: el docente registra/edita notas; los demás roles consultan.
  - Asistencia: el docente registra Presente/Ausente/Justificado/Tardanza; el resto consulta.
  - Comunicados: publicación por roles autorizados y retiro por administración.
  - Reservas de aulas y recursos con detección de conflictos de horario.
  - Calendario de actividades y exámenes con filtro por tipo.
  - Materiales y tareas con descarga simulada y entrega de tareas en línea.
  - Horarios semanales por curso.
- Datos de ejemplo **ficticios** en `frontend/js/datos.js`; las ediciones se guardan en `localStorage` y pueden restablecerse desde el menú.

**Limitaciones conocidas (se resolverán con el backend):**

- La autenticación y la autorización están **simuladas en el frontend**; no son seguras y no deben usarse en producción. El sistema final resuelve ambas en el servidor (RF-08.1).
- Las contraseñas no se almacenan ni se validan realmente (RF-01.2 pendiente).
- No hay notificaciones reales, correo electrónico ni persistencia centralizada.

## 7. Roles y matriz de permisos (referencia)

| Operación | administracion | docente | personal_administrativo | estudiante | familia |
|-----------|:-:|:-:|:-:|:-:|:-:|
| Gestionar usuarios | ✅ | ❌ | ❌ | ❌ | ❌ |
| Registrar calificaciones/asistencia | ❌ | ✅ | ❌ | ❌ | ❌ |
| Consultar datos académicos propios | ✅ (consulta) | ✅ (su curso) | ✅ (consulta) | ✅ (propias) | ✅ (de su estudiante) |
| Publicar comunicados | ✅ | ✅ | ✅ | ❌ | ❌ |
| Leer comunicados | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gestionar comunicados (editar/retirar) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reservar aulas y recursos | ✅ | ✅ | ✅ | ❌ | ❌ |
| Consultar calendario | ✅ | ✅ | ✅ | ✅ | ✅ |
| Consultar materiales y tareas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Entregar tareas | ❌ | ❌ | ❌ | ✅ | ❌ |

## 8. Historial del documento

| Fecha       | Versión | Descripción                                       |
|-------------|---------|---------------------------------------------------|
| 2026-08-12  | 0.1.0   | Versión inicial de requerimientos funcionales y no funcionales. |
| 2026-08-12  | 0.2.0   | Nuevos roles (personal_administrativo, estudiante, familia), módulos de reservas, calendario y materiales/tareas; sección de prototipo frontend. |
