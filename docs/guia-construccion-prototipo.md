# Cómo se construyó el prototipo frontend

> Guía del proceso seguido el 2026-08-12 para crear el prototipo funcional de `frontend/`.
> Detalla decisiones, estructura, datos de prueba y cómo se verificó. Sirve de referencia para quien se incorpore o quiera replicar el flujo.

## 1. Contexto y alcance

Se necesitaba una **página funcional** para validar la interfaz y los flujos de los cinco roles (administración, docente, personal administrativo, estudiante y familia) **sin backend**. Se eligió HTML5 + CSS3 + JavaScript + Bootstrap 5 (por CDN) porque permite iterar rápido y abrir la página sin toolchain.

> Es una **desviación temporal** del stack objetivo (React + Node.js + PostgreSQL). Está registrada como ADR en `docs/arquitectura.md` y en `CLAUDE.md`.

## 2. Decisiones tomadas

| Decisión | Alternativa descartada | Motivo |
|----------|------------------------|--------|
| Frontend vanilla + Bootstrap | React/Vite | Sin build, abre directo en el navegador; suficiente para validar flujos. |
| Datos mock en `localStorage` | Base de datos | Sin backend no hay BD; el almacenamiento local permite que las ediciones persistan entre recargas. |
| Multi-página (login → dashboard) | SPA con router | Estructura clásica y simple de HTML/CSS/JS; navegación obvia. |
| Vistas por módulo con menú por rol | Página por módulo | Evita repetir el layout (navbar + sidebar) en cada módulo. |
| Sesión simulada en `localStorage` | — | Solo para demo; se documentó que no es segura. |

## 3. Estructura creada

```
frontend/
├── index.html            # Página de inicio de sesión
├── dashboard.html        # Shell de la aplicación (navbar + sidebar + vistas)
├── css/styles.css        # Estilos propios sobre Bootstrap
└── js/
    ├── util.js           # Helpers compartidos: $, $$, esc (escape de HTML)
    ├── datos.js          # Datos mock ficticios y generadores deterministas
    ├── auth.js           # Sesión simulada y catálogo de roles
    ├── app.js            # Carga de datos, menú por rol, enrutado de vistas
    ├── login.js          # Lógica del formulario de acceso
    └── modulos/          # Un archivo por módulo (renderizado y eventos)
```

## 4. Pasos de construcción

### 4.1 Estilos y páginas base

1. Se creó `css/styles.css` (variables, sidebar fija, tarjetas, avatar) sobre Bootstrap 5.
2. `index.html`: tarjeta de login centrada con selector de cuenta de demostración, acceso rápido por rol y formulario.
3. `dashboard.html`: navbar superior, sidebar para escritorio, offcanvas para móvil y un contenedor `#vista-<modulo>` por módulo.

### 4.2 Datos de prueba (js/datos.js)

- Usuarios demo (uno por rol), cursos, materias, periodos y estudiantes **ficticios**.
- Calificaciones, asistencia y horarios se **generan de forma determinista** (fórmulas sobre los ids) para que sean estables entre cargas y verificables.
- Comunicados, recursos, reservas, calendario y materiales se definen manualmente con contenido de ejemplo.

### 4.3 Sesión y roles (js/auth.js)

- `iniciarSesion`/`cerrarSesion` guardan/limpian la sesión en `localStorage`.
- `usuarioActual()` resuelve el usuario activo desde los datos cargados.
- `ROLES` define etiqueta e icono de cada perfil.

### 4.4 Aplicación (js/app.js)

- `cargarDatos()` lee el estado de `localStorage` si coincide con `VERSION_DATOS`; si no, clona `DATOS_INICIALES`.
- `MENU` define las vistas permitidas por rol; `mostrarVista()` oculta el resto y redirige al inicio si la vista no corresponde al rol (control de acceso en la interfaz).
- `registrarVista()` conecta cada módulo con su contenedor.

### 4.5 Módulos (js/modulos/)

Cada módulo renderiza su vista y ata eventos:

- `inicio.js` — resumen de tarjetas por rol, últimos comunicados y próximos eventos.
- `usuarios.js` — alta, activar/desactivar y restablecer contraseña (simulado).
- `calificaciones.js` — el docente edita notas por periodo; los demás consultan (matriz por curso o por estudiante).
- `asistencia.js` — el docente registra Presente/Ausente/Justificado/Tardanza; el resto consulta con resumen.
- `comunicados.js` — publicar (admin/docente/staff) y retirar (admin).
- `reservas.js` — reserva de recursos con detección de conflictos de horario.
- `consultas.js` — calendario (filtro por tipo), materiales/tareas (descarga y entrega simulada) y horarios por curso.

## 5. Cómo se verificó

1. **Sintaxis JS:** `node --check` sobre cada archivo de `js/`.
2. **Coherencia:** las vistas declaradas en `dashboard.html` coinciden con los módulos registrados (`registrarVista`).
3. **Datos:** un script Node cargó `datos.js` y validó conteos (calificaciones = estudiantes × materias × periodos, asistencia sin fines de semana, notas dentro de rango, estados válidos).
4. **Render real:** servidor estático (`python -m http.server`) + Chrome headless (`--dump-dom`) con una sesión sembrada por rol, comprobando el contenido esperado de cada vista.

Para reproducir la prueba de render:

```bash
cd frontend
python -m http.server 8080
# luego abrir http://localhost:8080 con una cuenta demo
```

## 6. Limitaciones conocidas

- La autenticación y autorización están **simuladas en el frontend**: no son seguras y no deben usarse en producción.
- Cualquier contraseña inicia sesión; no hay validación real de credenciales.
- Bootstrap se consume por CDN (requiere conexión).
- Los cambios se guardan solo en el navegador (`localStorage`).
