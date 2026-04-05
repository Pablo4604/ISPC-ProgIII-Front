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
