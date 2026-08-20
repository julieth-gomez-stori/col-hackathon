# CSAT Bendita entre los hombres

MVP interactivo de un sistema parametrizable de calificación de servicio, construido con **Vue 3 (`<script setup>`)**, **Vite** y **Tailwind CSS**, sobre el **Design System** de Stori.

**Arquitectura de producción** (FinClip, DynamoDB, IA sobre comentarios abiertos, Redshift): ver [`docs/ARQUITECTURA-PRODUCCION.md`](docs/ARQUITECTURA-PRODUCCION.md).

## Demo local

1. Tener **Node 18+** (`node -v`).
2. En la raíz:

```bash
cp .env.example .env
```

3. Pegar la key de [Google AI Studio](https://aistudio.google.com/apikey) en `GEMINI_API_KEY`.
4. `npm install` y `npm run dev`.
5. Abrir http://localhost:5173. El header debe decir **Gemini listo**.

Guion: Simulador → 1 o 2 estrellas → píldoras → comentario (ej. `me clonaron la tarjeta y nadie me ayuda`) → Enviar → Dashboard.

## Deploy en Vercel

Vercel sirve el `npm run build` (archivos estáticos) **y** la función `api/analyze-csat.js`. El browser nunca llama a Google directo: llama a `/api/analyze-csat` y el servidor usa `GEMINI_API_KEY`.

1. Sube el repo (o `vercel` CLI).
2. En Vercel → Project → Settings → Environment Variables:
   - `GEMINI_API_KEY` = la misma key de AI Studio
   - opcional `GEMINI_MODEL` = `gemini-3.6-flash`
3. Framework: **Vite**, build `npm run build`, output `dist`.
4. Redeploy. El header en la URL de Vercel debe decir **Gemini listo**.

No uses variables `VITE_GEMINI_*` en Vercel: irían al JavaScript del cliente.

## Vistas

1. **Admin / Creador** — catálogo de formularios. Cada formulario define nombre, descripción, evento técnico, producto, frecuencia, preguntas y píldoras. Incluye edición y live mockup.
2. **Simulador App** — permite seleccionar un formulario y ejecutar su evento respetando la frecuencia configurada. El bottomsheet avanza: estrellas → píldoras → (si ≤ 2 estrellas) texto libre → agradecimiento.
3. **Dashboard** — filtros por producto y versión de app, promedio, total, distribución por estrellas, actividad de 7 días, insights de IA (tags + problem_text) y comentarios recientes.

El estado vive en un store reactivo (`src/store.js`) y se persiste en `localStorage` bajo la clave `feedback-bottomsheet-mvp-v3`.

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
