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

  ## Mejora 3 — Pantalla "Olvidé mi contraseña" con flujo OTP

### Archivos creados
`src/app/forgot-password/forgot-password.ts`
`src/app/forgot-password/forgot-password.html`
`src/app/forgot-password/forgot-password.css`

### Archivos modificados
`src/app/app.routes.ts` — nueva ruta `/forgot-password`
`src/app/login/login.ts` — método `goToForgotPassword()`
`src/app/login/login.html` — link "¿Olvidaste tu contraseña?" conectado

### ¿Qué se agregó?
Se creó un componente nuevo `ForgotPassword` siguiendo el mismo
patrón que el componente `Login` — con su propio `.ts`, `.html`
y `.css`. El componente maneja 3 pasos internos usando la nueva
sintaxis de control de flujo de Angular 17+ (`@if` en lugar de
`*ngIf`).

### Flujo de 3 pasos

**Paso 1 — Email**
- Formulario con `emailForm` y validación `Validators.email`
- Consume `POST /api/password-reset/request/`
- Si el email existe, avanza al paso 2

**Paso 2 — Código OTP**
- Formulario con `otpForm` y validación `minLength(6) + maxLength(6)`
- Consume `POST /api/password-reset/verify/`
- Si el código es válido, avanza al paso 3

**Paso 3 — Nueva contraseña**
- Formulario con `passwordForm` y validación `minLength(8)`
- Consume `POST /api/password-reset/confirm/`
- Al confirmar muestra mensaje de éxito y redirige al login
  automáticamente después de 2.5 segundos con `setTimeout()`

### Indicador de pasos visual
Se implementó un indicador de pasos con círculos numerados y
líneas conectoras. Usa `[class.active]` y `[class.done]` para
cambiar el color de cada paso según el progreso:
- Gris → paso pendiente
- Azul oscuro → paso actual
- Dorado → paso completado

### Sintaxis moderna de Angular
Se usó `@if` en lugar de `*ngIf` (deprecado en Angular 17+)
para el control de flujo en los templates. Esto aplica tanto
al componente `ForgotPassword` como al `Login`.

### Diseño consistente
El componente usa la misma paleta de colores, fondo y estilos
que el login — azul metalizado, dorado y responsive con
`@media (max-width: 480px)`.

## Mejora 4 — Loaders y feedback visual

### Archivos modificados
`src/app/login/login.ts`
`src/app/login/login.html`
`src/app/forgot-password/forgot-password.ts`
`src/app/forgot-password/forgot-password.html`

### ¿Qué se agregó?
Se implementó feedback visual durante las peticiones HTTP
mediante la propiedad `isLoading` en cada componente.

### Patrón implementado
Se agregó la propiedad `isLoading: boolean = false` en cada
componente. Se activa antes de llamar al servidor y se
desactiva cuando llega la respuesta (tanto en `next` como
en `error`). En el template el botón muestra un texto
alternativo y se deshabilita mientras espera:
```typescript
this.isLoading = true;
this.http.post(...).subscribe({
  next: () => { this.isLoading = false; },
  error: () => { this.isLoading = false; }
});
```

### Textos de loader por componente
- Login: "Ingresando..."
- Forgot Password paso 1: "Enviando..."
- Forgot Password paso 2: "Verificando..."
- Forgot Password paso 3: "Confirmando..."

### ChangeDetectorRef
Se inyectó `ChangeDetectorRef` en el componente Login para
forzar la detección de cambios cuando llega un error desde
el servidor. Esto es necesario porque Angular a veces no
detecta cambios que ocurren fuera de su zona de ejecución.
Se llama `this.cdr.detectChanges()` en el bloque `error`
del subscribe.

## Mejora 5 — Mostrar usuario en Home + Logout

### Archivos modificados
`src/app/home/home.ts`
`src/app/home/home.html`
`src/app/home/home.css`

### ¿Qué se agregó?

**Mostrar usuario en Home**
Se implementó `ngOnInit()` en el componente `Home` para recuperar
el objeto `user` del storage al cargar la pantalla. Se busca
primero en `localStorage` (si usó "Recordarme") y luego en
`sessionStorage`. Los datos se muestran en el template usando
interpolación `{{ user.username }}`, `{{ user.email }}` y
`{{ user.id }}`.

**Logout**
Se implementó el método `logout()` que elimina el `access_token`
y el objeto `user` de ambos storages (localStorage y
sessionStorage) y redirige al login con
`this.router.navigate(['/'])`.

**Diseño consistente**
El componente Home usa la misma paleta de colores y fondo
que el login y forgot-password, manteniendo coherencia visual
en toda la aplicación.

## Mejora 6 — AuthGuard

### Archivos creados
`src/app/auth-guard.ts`

### Archivos modificados
`src/app/app.routes.ts`

### ¿Qué se agregó?
Se implementó un Guard funcional usando `CanActivateFn`, la forma
moderna de Angular para proteger rutas. El Guard verifica si existe
un `access_token` en `localStorage` o `sessionStorage` antes de
permitir el acceso a la ruta `/home`.

### Lógica del Guard
```typescript
const token =
  localStorage.getItem('access_token') ||
  sessionStorage.getItem('access_token');

if (token) return true;

router.navigate(['/']);
return false;
```

### ¿Cómo se registra en las rutas?
Se agrega `canActivate: [authGuard]` en la ruta `/home` dentro
de `app.routes.ts`. Angular ejecuta el Guard antes de renderizar
el componente — si retorna `false`, cancela la navegación.

### Casos protegidos
- Acceso directo por URL a `/home` sin token → redirige al login
- Botón "atrás" del navegador después del logout → redirige al login
- Cualquier intento de navegación a `/home` sin autenticación → redirige al login

## Mejora 7 — Consumir endpoint /api/profile/ desde Home

### Archivos modificados
`src/app/home/home.ts`

### ¿Qué se agregó?
Se modificó el componente Home para consumir el endpoint
`GET /api/profile/` en lugar de leer los datos del storage.
Esto garantiza que los datos mostrados siempre son frescos
y válidos desde el servidor.

### ¿Cómo se envía el token JWT?
Se construye el header `Authorization` manualmente usando
`HttpHeaders`:

```typescript
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});
this.http.get('/api/profile/', { headers }).subscribe(...)
```

### ChangeDetectorRef
Se inyectó `ChangeDetectorRef` para forzar la detección de
cambios cuando llegan los datos del servidor, siguiendo el
mismo patrón aplicado en el componente Login.

### Manejo de token expirado
Si el endpoint responde con error (token expirado o inválido),
el método `logout()` se ejecuta automáticamente limpiando el
storage y redirigiendo al login.

## Mejora 8 — HttpInterceptor y Refresh Token

### Archivos creados
`src/app/auth-interceptor.ts`

### Archivos modificados
`src/app/app.config.ts`
`src/app/login/login.ts`
`src/app/home/home.ts`

### ¿Qué se agregó?

**Endpoint de refresh en el backend**
Se registró el endpoint `POST /api/token/refresh/` de simplejwt
en `backend/urls.py`. Recibe el `refresh_token` y devuelve un
nuevo `access_token` sin que el usuario tenga que volver a
loguearse.

**HttpInterceptor en Angular**
Se creó `authInterceptor` usando `HttpInterceptorFn`, la forma
moderna de Angular para interceptar peticiones HTTP. Intercepta
automáticamente los errores 401 y ejecuta este flujo:

1. Detecta el error 401 (token expirado)
2. Busca el `refresh_token` en el storage
3. Llama a `POST /api/token/refresh/` con el refresh token
4. Guarda el nuevo `access_token` en el storage
5. Reintenta la request original con el nuevo token
6. Si el refresh también falla → limpia el storage y redirige al login

**Registro del interceptor**
Se registró en `app.config.ts` usando `withInterceptors()`:
```typescript
provideHttpClient(withInterceptors([authInterceptor]))
```

**Guardar refresh token al hacer login**
Se actualizó `login.ts` para guardar también el `refresh_token`
en el storage junto con el `access_token` y el `user`.

**Logout actualizado**
Se actualizó `logout()` en `home.ts` para limpiar también el
`refresh_token` del storage.

