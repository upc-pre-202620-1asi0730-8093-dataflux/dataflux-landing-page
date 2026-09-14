# RentBuild — DataFlux

Landing page oficial de RentBuild, una plataforma inteligente para la gestión y control de alquileres de maquinaria en el sector construcción.

## Sobre el producto

RentBuild centraliza en un solo dashboard todo lo que hoy se gestiona de forma dispersa con chats, correos y hojas de cálculo. Está diseñada para gerentes de proyectos, equipos de logística e ingenieros residentes que buscan optimizar la disponibilidad, reserva y operación de maquinaria en obra.

La plataforma permite:

- Control digital de pedidos y disponibilidad de equipos.
- Trazabilidad completa de órdenes, cotizaciones y facturas por proyecto.
- Seguimiento del gasto real vs. proyectado para proteger el margen del proyecto.
- Gestión del ciclo completo de alquiler: reservación, entrega, devolución y mantenimiento.

## Sobre este repositorio

Este repositorio contiene el código fuente de la landing page pública del producto. La web está construida con Vue 3 + Vite, es liviana, responsive y soporta dos idiomas (inglés y español) mediante `vue-i18n`.

La propuesta visual se basa en un sistema de diseño modular con CSS Vanilla, usando variables, componentes reutilizables y una estructura clara orientada a la presentación del valor del producto.

## Stack

| Herramienta | Versión |
| --- | --- |
| Vue | 3.5.33 |
| Vite | 5.4.21 |
| @vitejs/plugin-vue | 5.2.4 |
| vue-i18n | 9.14.5 |

El proyecto usa JavaScript con ES Modules, Composition API en `<script setup>`, y estilos en CSS puro con variables, layout y componentes modulares.

## Estructura del proyecto

```text
public/
  assets/
    images/
    videos/
    references/
src/
  App.vue
  main.js
  i18n.js
  locales/
    en.json
    es.json
  assets/styles/
    reset.css
    variables.css
    layout.css
    main.css
    responsive.css
    components/
  shared/presentation/components/
    AccessDialog.vue
    BrandLogo.vue
    ReferenceArtwork.vue
    SiteFooter.vue
    TheHeader.vue
    VideoPlaceholder.vue
  value-proposition/presentation/components/
    AboutRentBuild.vue
    AppFeatures.vue
    OperationOverview.vue
    OurTeam.vue
    PricingCard.vue
    PricingPlans.vue
    ProductShowcase.vue
    RentalBenefits.vue
    TheHero.vue
```

## Ejecutar localmente

Requisitos: Node.js 20.19+ o 22 LTS y npm.

```bash
npm ci
npm run dev
```

Abre la dirección que muestra Vite, normalmente `http://localhost:5173`.

Para compilar la versión de producción:

```bash
npm run build
npm run preview
```

El resultado se genera en `dist/`.

## Funcionalidades principales

- Navegación responsive con menú móvil y cierre con Escape.
- Selector de idioma EN/ES con persistencia local cuando el navegador lo permite.
- Secciones con anclas reales para cada bloque de contenido.
- Acordeones accesibles y bloques de información reutilizables.
- Selector de plan y período de facturación con confirmación visual.
- Diálogo de acceso con bloqueo de scroll y restauración del foco.
- Newsletter con validación de email, manejo de errores y tiempo de espera configurable.
- Soporte para movimiento reducido y navegación por teclado.

## Conectar servicios reales

El proyecto está preparado para conectar endpoints reales usando variables de entorno con prefijo `VITE_`.

Ejemplo:

```dotenv
VITE_SIGNUP_URL=https://tu-aplicacion.example/registro
VITE_LOGIN_URL=https://tu-aplicacion.example/login
VITE_CONTACT_EMAIL=contacto@tu-dominio.example
VITE_NEWSLETTER_ENDPOINT=https://tu-api.example/newsletter
VITE_TERMS_URL=https://tu-dominio.example/terminos
VITE_PRIVACY_URL=https://tu-dominio.example/privacidad
```

Estas URLs son ejemplos y no apuntan a servicios reales de RentBuild. Las variables `VITE_` son públicas en el navegador, así que no se deben incluir claves privadas o tokens sensibles.

## Estado actual

La landing page ya incluye la estructura visual, textos, traducciones y comportamiento base de la experiencia. Los servicios reales para registro, acceso y suscripción no están conectados todavía, por lo que los formularios muestran mensajes informativos cuando no existe un endpoint o URL valida.

## Diseño y contenido

El sitio está orientado a presentar RentBuild como una solución de control operativo para maquinaria y alquileres. Se usaron referencias visuales para construir la composición general, manteniendo los textos y módulos HTML reales en vez de depender de imágenes con texto embebido.

Los colores principales, la tipografía y la arquitectura de secciones están pensados para transmitir confianza, claridad y sentido de operación profesional.

## Verificación

Se validó que el proyecto compila correctamente con:

```bash
npm run build
```

La UI se ha desarrollado y ajustado para que funcione en distintos anchos de pantalla y con los principales flujos de interacción del landing page.

## Repositorio

```text
https://github.com/upc-pre-202620-1asi0730-8093-dataflux/dataflux-landing-page
```

Este proyecto está pensado para evolucionar con imágenes reales, videos productivos y servicios de backend en etapas posteriores.
