# CSAT Bendita entre los hombres

MVP interactivo de un sistema parametrizable de calificación de servicio, construido con **Vue 3 (`<script setup>`)**, **Vite** y **Tailwind CSS**, sobre el **Design System** de Stori.

**Arquitectura de producción** (FinClip, DynamoDB, IA sobre comentarios abiertos, Redshift): ver [`docs/ARQUITECTURA-PRODUCCION.md`](docs/ARQUITECTURA-PRODUCCION.md).

## Cómo correrlo

```bash
npm install
cp .env.example .env
npm run dev
```

`npm run dev` levanta Vite (http://localhost:5173) y la API (http://localhost:8787) juntos. En dos terminales: `npm run dev:web` y `npm run dev:api`.

Sin DynamoDB, la API usa un store en memoria y lo deja claro en logs. El UI sigue funcionando con `localStorage` (`feedback-bottomsheet-mvp-v2`) si la API no responde.

### API + DynamoDB (hackathon)

Dos tablas en `us-east-1` (credenciales locales de AWS):

| Tabla | PK | Contenido |
|-------|----|-----------|
| `mvp-hackaton` | `survey_id` | Formularios (`id` = `survey_id`) |
| `mvp-hackaton-responses` | `response_id` | Respuestas (`id` = `response_id`, `formId`, `stars`, `pills`, `comment`, `sentiment`, …) |

```bash
cp .env.example .env
npm run db:create   # verifica que las tablas existan
npm run db:seed     # carga los 2 formularios y 9 respuestas demo
npm run dev
```

Rutas: `GET /health`, `GET|POST /v1/forms`, `PUT /v1/forms/:id`, `GET|POST /v1/responses`. Vite proxea `/v1` y `/health` a `:8787`.

**IAM:** least privilege `dynamodb:PutItem`, `GetItem`, `Scan`, `UpdateItem` solo sobre esas dos tablas. No reutilizar roles compartidos de plataforma.

## Vistas

1. **Admin / Creador** — catálogo de formularios. Cada formulario define nombre, descripción, evento técnico, producto, frecuencia, preguntas y píldoras. Incluye edición y live mockup.
2. **Simulador App** — permite seleccionar un formulario y ejecutar su evento respetando la frecuencia configurada. El bottomsheet avanza progresivamente: estrellas → píldoras → texto libre → agradecimiento.
3. **Dashboard** — filtros por producto y versión de app, promedio, total, distribución por estrellas, actividad de 7 días y comentarios recientes.

El estado vive en un store reactivo (`src/store.js`). Al arrancar hidrata desde `GET /v1/forms` y `GET /v1/responses` si la API tiene datos; `saveForm` / `addResponse` también persisten en la API (best-effort). `localStorage` (`feedback-bottomsheet-mvp-v2`) queda como caché y fallback.

## Design System

El proyecto usa los tokens y las specs reales del Design System
([Storybook](https://storybook.storicarddev.com/?path=/docs/docs-getting-started--docs)).

`src/delorean/` es una **capa espejo local** del paquete privado
`@credifranco/design-system-vue`, creada porque este entorno no tiene acceso al registry
privado de GitHub Packages. Tokens, tipografía, clases CSS (`.Button`, `.Chip`,
`.TextArea`, `.Select`, `.Overlay`, `.SheetGeneric`, `.SheetGrade`, `.SegmentControl`,
`.Tag`), íconos y la API de props se replicaron desde el build público del Storybook.

```
src/delorean/
├── tokens.css                    # variables --delorean-style-* + temas + clases dl-*
├── illustrations.js              # getIllustration(): CDN de ilustraciones 3D de Stori
├── index.js                      # barrel: único punto a cambiar al migrar
└── components/
    ├── ThemeProvider.vue         # credit-theme | deposits-theme | black-theme
    ├── DlBrand.vue               # logo Stori (wordmark y símbolo)
    ├── DlButton.vue              # primary | secondary | tertiary · small | medium | large · fill
    ├── DlChip.vue                # Chip / Chip--active
    ├── DlIcon.vue                # Favorite, CloseBold, Check, Chevron
    ├── DlIllustration.vue        # ilustraciones desde el CDN del DS
    ├── DlOverlay.vue             # backdrop primary1000 @ .85 + transición bottom sheet
    ├── DlSheetGeneric.vue        # sheet blanco radius 24, close 32px
    ├── DlSheetGrade.vue          # title, description, leftLabel, rightLabel, onStarClick
    ├── DlSelect.vue              # input 56px + dropdown radius 24
    ├── DlTextInput.vue           # TextInputMask con label flotante
    ├── DlTextArea.vue            # label, contador, helpText, estados
    ├── DlSegmentControl.vue      # navegación entre vistas
    └── DlTag.vue                 # success | error | alert
```

`tailwind.config.js` mapea los tokens del Design System a utilidades (`bg-primary-700`,
`text-grey-600`, `rounded-dl24`, `gap-dl16`), así que el layout usa Tailwind pero los
colores, radios y espaciados salen siempre del design system.

### Migrar al paquete real

Cuando el proyecto tenga acceso al registry privado:

```bash
# .npmrc
@credifranco:registry=https://npm.pkg.github.com

npm login --registry=https://npm.pkg.github.com --scope=@credifranco
npm install @credifranco/design-system-vue
```

En `src/main.js` importa `@credifranco/design-system-vue/style.css` en lugar de
`src/delorean/tokens.css`, y reemplaza el contenido de `src/delorean/index.js` por
re-exports desde `@credifranco/design-system-vue/beta/components`. Las vistas no cambian:
ya consumen los mismos nombres de props.

## Notas de fidelidad al DS

- El simulador replica una pantalla real de la app (fondo blanco, header con logo Stori y
  cierre, headline de marca, ilustración 3D y CTA verde full width).
- Las ilustraciones vienen del mismo CDN que usa el componente `Image` del DS:
  `https://d1nmg9fup890vg.cloudfront.net/illustrations/{theme}/png/{nombre}.png`. Requiere
  conexión; hoy solo el tema `stori_card` expone estos assets.
- El headline usa la fuente de marca **F37 Hybrid** con fallback a Inter. El Storybook la
  referencia por nombre y no la sirve como webfont, así que solo se ve si está instalada
  en el sistema.
- Las estrellas usan el ícono `Favorite` y el color `System/Alert/Dark` (`#8a6c00`), como
  indica la documentación de `SheetGrade`.
- `DlOverlay` acepta `contained` (fuera de la spec del DS) para anclar el bottomsheet al
  marco del teléfono en el simulador en vez del viewport completo.
- El estado activo del `Chip` es `grey200` sin borde, tal cual la spec. Si se necesita más
  contraste para la selección múltiple, el Design System ofrece `Selector` (activo:
  `primary1000` con texto `grey0`) como alternativa.
- El backdrop del bottomsheet es `primary1000` al 85%, según `Overlay`.
