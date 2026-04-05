# UPGRADES — Pablo Peralta
## Rama: pabloperalta

Este archivo documenta todas las mejoras y cambios realizados sobre
el esqueleto original del proyecto ISPC-ProgIII-Front.

---

## Mejora 1 — Guardar token JWT + "Recordarme" + Validaciones + Manejo de errores

### Archivos modificados
`src/app/login/login.ts`
`src/app/login/login.html`

### ¿Qué se agregó?

**Token JWT**
Siguiendo la sección 6.2 del marco teórico, se modificó el `next`
del subscribe para guardar el `access_token` y los datos del `user`
en el storage del navegador al hacer login exitoso.

**"Recordarme"**
Se agregó un checkbox que determina dónde se guarda el token:
- Tildado → `localStorage` (persiste aunque se cierre el navegador)
- Sin tildar → `sessionStorage` (se borra al cerrar la pestaña)

**Validaciones en tiempo real**
Se agregó `Validators.minLength(8)` al campo password en el
`FormGroup`. El mensaje de validación aparece en el template
usando `*ngIf` cuando el campo fue tocado y es inválido.

**Manejo de errores visible**
Se agregó la propiedad `errorMessage` en el componente. Cuando
el servidor responde con error 401, el mensaje se muestra en el
template usando `*ngIf` en lugar de solo imprimirse en consola.

### Conceptos del marco teórico aplicados
- `Validators.required` y `Validators.minLength()` — validación en FormGroup
- `*ngIf` — directiva Angular para mostrar/ocultar elementos
- `localStorage` / `sessionStorage` — storage del navegador
- `.subscribe({ next, error })` — manejo de éxito y error en Observables

## Mejora 2 — Rediseño visual del login

### Archivos modificados
`src/app/login/login.css`
`src/app/login/login.html`
`src/styles.css`

### ¿Qué se cambió?
Se rediseñó completamente la interfaz visual del login manteniendo
la misma estructura de componente Angular — solo se modificaron
estilos y template, sin tocar la lógica del componente.

### Paleta de colores
- Azul oscuro: #042C53 (color principal)
- Azul medio: #185fa5 (base del fondo)
- Verde oscuro: #1a6b3a (esquina superior derecha del fondo)
- Plateado: #c8d0db (parte inferior del fondo)
- Dorado: #EF9F27 (acento — borde superior del card, link, gradiente del botón)

### Fondo
Se aplicó un fondo con tres radial-gradient superpuestos sobre
un background-color base, logrando un efecto de tres colores
en esquinas distintas: azul oscuro (superior izquierda), verde
(superior derecha) y plateado (inferior centro).

### Card del formulario
- Fondo blanco con border-radius de 16px
- Borde superior de 4px en dorado como acento visual
- Avatar con ícono de usuario y borde dorado
- Inputs con fondo #f8fbff y borde azul al hacer foco

### Botón "Ingresar"
- Gradiente horizontal de azul oscuro a dorado
- Efecto shine: destello blanco que cruza el botón al hacer hover
  usando el pseudo-elemento `::after` con CSS puro
- Efecto de presión: `scale(0.97)` al hacer clic con `:active`
- Deshabilitado con opacidad 0.5 cuando el formulario no es válido

### Estilos globales actualizados
Se simplificó `src/styles.css` eliminando `overflow: hidden`
del body que cortaba el contenido en pantallas pequeñas.
El control del alto de pantalla se maneja ahora desde el
propio componente con `min-height: 100vh`.

### Responsive design
Se implementó diseño responsive para todos los tamaños de pantalla:
- `:host` usa `min-height: 100vh` y `padding: 1.5rem` para que
  el card nunca toque los bordes en pantallas pequeñas
- `.remember-row` usa `flex-wrap: wrap` para que los elementos
  se acomoden en pantallas angostas
- `@media (max-width: 480px)` ajusta padding y font-size en móvil
- Se eliminó `overflow: hidden` del body para no cortar contenido
  en dispositivos pequeños

  