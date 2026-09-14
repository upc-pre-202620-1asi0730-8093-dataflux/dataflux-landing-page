# RentBuild — DataFlux

Landing page responsive para la plataforma de alquiler y gestión de maquinaria RentBuild, construida a partir de las capturas y el logo proporcionados por el equipo.

Repositorio: [dataflux-landing-page](https://github.com/upc-pre-202620-1asi0730-8093-dataflux/dataflux-landing-page).

La arquitectura y el estilo de código siguen [BuildLine](https://github.com/RQLS26/buildline-landing-page). La inspección previa, las decisiones visuales y las diferencias están documentadas en [NOTES.md](NOTES.md).

## Ejecutar localmente

Usa Node.js 20.19+ o 22 LTS y npm.

```bash
npm ci
npm run dev
```

Abre la dirección que muestra Vite, normalmente `http://localhost:5173`.

```bash
npm run build
npm run preview
```

El build se genera en `dist/`. El sitio soporta raíz o subcarpeta gracias a `base: './'`. Subir el código a GitHub no publica automáticamente el sitio web: para tener una URL pública, configura por separado un servicio de hosting que ejecute `npm ci && npm run build` y publique `dist/`.

## Stack

| Herramienta | Versión |
| --- | --- |
| Vue | 3.5.33 |
| Vite | 5.4.21 |
| @vitejs/plugin-vue | 5.2.4 |
| vue-i18n | 9.14.5 |

JavaScript, ES Modules, Composition API con `<script setup>`, CSS puro con variables y clases BEM. Sin Tailwind, SCSS, Vue Router ni librería UI. Versiones fijadas a las resueltas por el lockfile de BuildLine.

## Estructura

```text
public/assets/
  images/references/                Capturas originales usadas como recursos visuales
  videos/                          Videos pendientes
src/
  shared/presentation/components/
    TheHeader.vue                  Navegación y selector EN/ES
    SiteFooter.vue                 Enlaces y newsletter
    BrandLogo.vue                  Logo proporcionado
    ReferenceArtwork.vue           Encuadre CSS de ilustraciones
    VideoPlaceholder.vue           Placeholder o reproductor nativo
    AccessDialog.vue               Accesos y documentos pendientes
  value-proposition/presentation/components/
    TheHero.vue                    Portada y ciclo de alquiler
    OperationOverview.vue          Disponibilidad, reservas y mantenimiento
    AppFeatures.vue                Tres funcionalidades principales
    RentalBenefits.vue             Beneficios y control de alquileres
    ProductShowcase.vue            Video demo y acordeones
    PricingPlans.vue               Selector mensual/anual
    PricingCard.vue                Tarjeta reutilizable
    OurTeam.vue                    Cinco integrantes
    AboutRentBuild.vue             Presentación y segundo video
  assets/styles/
    reset.css / variables.css / layout.css / main.css / responsive.css
    components/                    CSS por componente o sección
  locales/en.json
  locales/es.json
  i18n.js
  App.vue
  main.js
```

Los textos se editan en los JSON de `locales`; colores y medidas base en `variables.css`. Las secciones usan anclas reales: `#home`, `#how-it-works`, `#features`, `#benefits`, `#product-demo`, `#plans`, `#our-team`, `#about` y `#contact`.

## Funciones disponibles

- Navegación responsive, menú móvil y cierre con Escape.
- Selector EN/ES con persistencia de idioma cuando el navegador permite almacenamiento local.
- Acordeones con atributos accesibles y contenido real.
- Selector de período mensual/anual y elección de plan. El período elegido aparece en el diálogo; las capturas no especifican precios, por lo que no se inventaron importes.
- Formulario de newsletter con validación de email, carga, timeout y manejo de éxito/error.
- Diálogo nativo con Escape, bloqueo del scroll y restauración del foco.
- Soporte de movimiento reducido, navegación por teclado y enlace para saltar al contenido.

## Conectar los servicios reales

Copia `.env.example` a `.env.local` y completa únicamente los valores disponibles:

```dotenv
VITE_SIGNUP_URL=https://tu-aplicacion.example/registro
VITE_LOGIN_URL=https://tu-aplicacion.example/login
VITE_CONTACT_EMAIL=contacto@tu-dominio.example
VITE_NEWSLETTER_ENDPOINT=https://tu-api.example/newsletter
VITE_TERMS_URL=https://tu-dominio.example/terminos
VITE_PRIVACY_URL=https://tu-dominio.example/privacidad
```

Estas direcciones son ejemplos, no servicios de RentBuild. Reinicia Vite o recompila después de cambiarlas. Las variables `VITE_` son públicas en el navegador: no pongas claves privadas en ellas.

El endpoint de newsletter debe aceptar `POST` con JSON `{ "email": "..." }`, permitir el origen del sitio si está en otro dominio y responder con un estado HTTP exitoso solo cuando acepte la suscripción. El formulario informa errores y cancela la espera después de 10 segundos.

**Estado actual:** no se proporcionaron servicios de registro, login o suscripción. Login y Sign up muestran «próximamente» si no hay URL. El formulario sin endpoint informa que el correo no se envió ni guardó; no crea cuentas ni simula suscripciones. Los documentos legales pendientes también muestran un aviso.

## Assets pendientes

Todas las rutas siguientes son relativas a la raíz del proyecto. Los videos y retratos se detectan al reiniciar Vite/recompilar; las ilustraciones de referencia se reemplazan en los componentes indicados.

| Archivo esperado | Sección | Estado / cómo incorporarlo |
| --- | --- | --- |
| `public/assets/videos/product-demo.mp4` | Demostración de funciones | Falta. Añadir MP4 compatible con navegador; sustituye automáticamente el placeholder. |
| `public/assets/videos/about-rentbuild.mp4` | Presentación de RentBuild | Falta. Añadir MP4 compatible con navegador; sustituye automáticamente el placeholder. |
| `public/assets/images/team/luis-cisneros.jpg` | Equipo | Falta; actualmente muestra iniciales LC. |
| `public/assets/images/team/miroslav-manosalva.jpg` | Equipo | Falta; actualmente muestra iniciales MM. |
| `public/assets/images/team/bruno-montalvo.jpg` | Equipo | Falta; actualmente muestra iniciales BM. |
| `public/assets/images/team/deiby-vargas.jpg` | Equipo | Falta; actualmente muestra iniciales DV. |
| `public/assets/images/team/marlon-viza.jpg` | Equipo | Se usa su retrato desde la captura; añadir original para mayor calidad. |
| `public/assets/images/logo-dark.png` | Header | Ya incluido. Recomendable reemplazar por una exportación transparente del mismo logo. |
| `public/assets/images/logo-light.png` | Footer | Ya incluido. Se filtra el fondo gris al renderizar; recomendable reemplazar por PNG transparente para mayor nitidez. |
| `public/assets/images/hero/hero-visual.png` | Portada | Ilustración completa disponible como encuadre de captura; recomendable exportación original. Sustituir ReferenceArtwork en TheHero. |
| `public/assets/images/features/team-management.png` | Funcionalidades | Se usa encuadre de captura. Sustituir ilustración correspondiente en AppFeatures. |
| `public/assets/images/features/reservations-rentals.png` | Funcionalidades | Se usa encuadre de captura. Sustituir ilustración correspondiente en AppFeatures. |
| `public/assets/images/features/operational-reports.png` | Funcionalidades | Se usa encuadre de captura. Sustituir ilustración correspondiente en AppFeatures. |
| `public/assets/images/benefits-visual.png` | Beneficios | Ya incluido: fotografía del portátil con tarjetas. La tarjeta de devolución es HTML superpuesto. |

Los retratos admiten `.jpg`, `.jpeg`, `.png` o `.webp` conservando el nombre base de la tabla; usa una sola imagen por integrante. Recomendación: retratos cuadrados de al menos 320 × 320 px. Para las ilustraciones, exporta a 2× o superior para evitar pixelación en pantallas grandes.

Las capturas originales se mantienen sin alteraciones en `public/assets/images/references/`. Solo sus ilustraciones están encuadradas con CSS: títulos, descripciones, navegación, botones, planes y tarjetas son HTML real. Los textos integrados en los PNG no se traducen y no son controles interactivos.

No hay video en la portada de la captura; solo se esperan los dos videos de la tabla. Los TODO con nombres exactos están junto a cada instancia de VideoPlaceholder. Un error al cargar un video vuelve a mostrar el placeholder.

## Diseño e interpretación

Figma no permitió leer el archivo con la cuenta conectada. La implementación usa las capturas, el CSS exportado que el usuario pegó y la última imagen de paleta. Inter, Rubik y Poppins se confirmaron en ese CSS; el título principal usa 80/90 px en escritorio y el contenedor 1180 px. Los breakpoints siguen siendo decisiones de implementación responsive, no datos extraídos de Dev Mode.

Paleta actual: azul marino `#1E3A5F`, azul `#2563EB`, naranja `#F59E0B`, fondo `#F8FAFC`, blanco `#FFFFFF`, texto `#1E293B`, footer `#64748B` y bordes `#E2E8F0`. La etiqueta azul repetida bajo la muestra naranja se interpreta como un error de rotulado; el naranja procede del CSS exportado.

Orden final según la captura completa: portada y ciclo → operación → funcionalidades → beneficios → demo → equipo → presentación de RentBuild → planes → footer. La tarjeta Pro tiene exterior naranja e interior blanco. Los placeholders de video tienen fondo oscuro, play rojo y aviso visible de contenido pendiente.

La foto central de la portada se encuadra desde la captura; sus tarjetas flotantes son HTML traducible. `features-panels.png` proporciona las tres ilustraciones encuadradas individualmente mediante CSS. Los PNG originales no se modifican. Los elementos decorativos no se presentan como controles de la aplicación real.

Se conservó la estructura visual de las capturas. Se sustituyó el título editorial «Replace them…» por una frase de producto y se adaptaron los textos de Premium sobre entrenamiento físico al contexto de maquinaria. No se añadieron precios ni descuentos ausentes del diseño. Las estrellas decorativas de operación reproducen la composición suministrada y no se presentan como opiniones verificadas de clientes.

## Subir al repositorio de DataFlux

Esta carpeta ya tiene configurado `origin`:

```text
https://github.com/upc-pre-202620-1asi0730-8093-dataflux/dataflux-landing-page.git
```

Al inspeccionarla, la rama local todavía no tenía commits y el remoto no anunció HEAD. Para el primer commit de este repositorio vacío, desde la terminal de esta carpeta:

```bash
git status
git add .
git commit -m "feat: add RentBuild landing page"
git branch -M main
git push -u origin main
```

Necesitas una sesión de GitHub con permiso de escritura en el repositorio. Si Git informa que el remoto ya tiene cambios nuevos, no uses `--force`: trae y revisa ese historial antes de integrar tu trabajo. Los comandos anteriores son para el repositorio inicialmente vacío inspeccionado.

`.gitignore` excluye `node_modules`, `dist`, `.reference`, `.qa` y archivos de entorno privados. El código fuente, `package-lock.json`, documentación e imágenes necesarias sí se suben. No hace falta clonar de nuevo ni copiar esta landing a otra carpeta.

## Verificación realizada

- `npm run build`: correcto.
- Chrome/Playwright: secciones, imágenes, anclas, acordeones, selección de planes y período, diálogo/Escape/restauración del foco, idioma persistente, validación de email y respuesta honesta sin servicio, menú móvil y movimiento reducido.
- Anchos 320, 390, 768, 1024 y 1440 px: sin desbordamiento horizontal.
- Capturas de escritorio y móvil revisadas; sin errores JavaScript en las interacciones verificadas.

Las verificaciones locales están en `.qa/`, excluida del repositorio. No se han verificado servicios externos ausentes. No se ha realizado commit, push ni despliegue como parte de esta implementación.
