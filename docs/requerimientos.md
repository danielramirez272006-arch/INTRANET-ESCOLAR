# Requerimientos — Intranet Escolar

> Documento de requerimientos del proyecto **Intranet Escolar**.
> Versión: 0.1.0 · Estado: en planificación · Última actualización: 2026-08-12

## 1. Descripción general

La Intranet Escolar es una plataforma web que centraliza la gestión académica y la comunicación institucional de una institución educativa pública. Permite la interacción entre tres perfiles de usuario —administración, docente y estudiante/familia— garantizando que cada rol acceda únicamente a la información y operaciones que le corresponden.

**Principio rector:** el sistema maneja datos de menores de edad; la protección y privacidad de esos datos prevalece sobre cualquier otra consideración funcional o técnica.

## 2. Requerimientos funcionales (RF)

> Se presentan como listas de tareas verificables. Un ítem marcado `[x]` está implementado y aceptado.

### RF-01 Autenticación por roles
- [ ] RF-01.1 El sistema permite iniciar sesión con usuario y contraseña.
- [ ] RF-01.2 La contraseña se almacena de forma segura (hash con sal) y nunca en texto plano.
- [ ] RF-01.3 Existen tres perfiles de acceso: `administracion`, `docente` y `estudiante/familia`.
- [ ] RF-01.4 El sistema permite cerrar sesión de forma segura (invalida la sesión en el servidor).
- [ ] RF-01.5 El rol se asigna al crear el usuario y no puede modificarse desde el frontend.

### RF-02 Gestión de usuarios
- [ ] RF-02.1 Alta de usuarios: el perfil `administracion` puede crear usuarios de cualquier rol.
- [ ] RF-02.2 Baja de usuarios: el perfil `administracion` puede desactivar/eliminar usuarios.
- [ ] RF-02.3 Edición de usuarios: el perfil `administracion` puede modificar datos y resetear contraseñas.
- [ ] RF-02.4 El sistema valida que no existan usuarios duplicados (p. ej. correo o documento único).
- [ ] RF-02.5 Solo el perfil `administracion` tiene acceso a la gestión de usuarios.

### RF-03 Módulo académico
- [ ] RF-03.1 El perfil `docente` puede registrar calificaciones de sus estudiantes.
- [ ] RF-03.2 El perfil `docente` puede registrar asistencia de sus estudiantes.
- [ ] RF-03.3 Las calificaciones y la asistencia quedan asociadas a un curso y a un periodo/trimestre.
- [ ] RF-03.4 El perfil `estudiante/familia` puede consultar calificaciones y asistencia de sus estudiantes.
- [ ] RF-03.5 El perfil `estudiante/familia` no puede modificar datos académicos.
- [ ] RF-03.6 El perfil `administracion` puede consultar el módulo académico sin modificarlo.

### RF-04 Tablón de comunicados
- [ ] RF-04.1 El perfil `administracion` y `docente` pueden publicar comunicados.
- [ ] RF-04.2 Los comunicados muestran título, cuerpo, autor, fecha de publicación y visibilidad.
- [ ] RF-04.3 Todos los roles pueden leer los comunicados publicados.
- [ ] RF-04.4 El perfil `administracion` puede editar y retirar comunicados.
- [ ] RF-04.5 Solo los roles autorizados pueden publicar o retirar comunicados.

### RF-05 Restricción de acceso según rol
- [ ] RF-05.1 La autorización se valida en el servidor en cada operación (nunca solo en el frontend).
- [ ] RF-05.2 Cada rol solo ve en la interfaz las opciones que le corresponden.
- [ ] RF-05.3 El acceso a una ruta o API no autorizada devuelve error y no filtra datos.
- [ ] RF-05.4 El sistema impide que un usuario consulte datos de otro curso/grupo no autorizado.

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

## 4. Criterios de aceptación generales

Un entregable se considera **aceptado** cuando:

1. Cumple el requisito funcional o no funcional correspondiente según su lista de verificación.
2. Pasa las pruebas definidas sin romper el estado verde de la rama principal.
3. La autorización está resuelta en el servidor para toda operación involucrada.
4. No se expone información sensible de menores.
5. La documentación (README, CHANGELOG, docs/) refleja el cambio.

## 5. Fuera de alcance (v0.1)

- Mensajería privada entre usuarios.
- Gestión de títulos o trámites administrativos digitales.
- Aplicación móvil nativa (la plataforma es web responsive).
- Integración con sistemas externos de pago o transporte.

## 6. Historial del documento

| Fecha       | Versión | Descripción                                       |
|-------------|---------|---------------------------------------------------|
| 2026-08-12  | 0.1.0   | Versión inicial de requerimientos funcionales y no funcionales. |
