## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

## Project: Portfolio v2

Portfolio personal de Johan Zuluaga, implementado a partir del diseño de Figma
(`Porfolio 2`, file key `hDVlqNPxGVxdLeVziGV3ec`, nodes `139:2` desktop / `69:82` mobile).

### Stack

- **Astro** (`output: 'static'`, sin adapter SSR) + **Tailwind CSS v4** (`@tailwindcss/vite`).
- **Supabase**: Postgres (tablas `content`, `projects`), Supabase Auth (un solo usuario admin),
  Storage (bucket `project-images`).
- **pnpm**. Sin framework de UI — las partes interactivas usan `<script>` vanilla TS con
  `@supabase/supabase-js` en el navegador.
- Deploy: GitHub Actions → GitHub Pages, `base: '/portfolio-v2'`, sitio en
  `https://johanz1611.github.io/portfolio-v2/`.
- Fuente: Saira Condensed (Google Fonts). Colores en `src/styles/global.css` (`@theme`):
  `--color-ink #0d2f3f`, `--color-teal #2b6f6c`, `--color-orange #f26440`, `--color-amber #eab54d`,
  `--color-cream #f5f2ec`.

### Por qué está así (decisiones clave)

- El usuario quiere hosting gratis en **GitHub Pages**, que solo sirve estáticos — no hay servidor
  Node ni endpoints con secretos. Por eso el sitio es 100% estático y el admin panel corre
  enteramente en el navegador contra Supabase (anon key + RLS), sin backend propio.
- El login del admin usa **Supabase Auth** (email + password) en vez de un password casero, porque
  necesitábamos auth real sin servidor.
- El contenido (`content`, `projects`) se lee **client-side** en cada visita (no en build time), así
  los cambios hechos desde `/admin` se reflejan al instante sin necesidad de re-desplegar.

### Estructura

- `src/lib/supabase.ts` — cliente Supabase (browser-safe, anon key) + tipo `Project` +
  `projectImageUrl()`.
- `src/lib/github.ts` — `fetchPublicRepos(username)`, API pública de GitHub sin token.
- `src/lib/content.ts` — `CONTENT_FIELDS` (lista de campos editables de texto) y
  `hydrateContent()`, que llena cualquier elemento `[data-content-key="..."]` con su valor desde la
  tabla `content`. Se dispara una vez desde `src/layouts/Layout.astro`.
- `src/components/` — `Header`, `Hero`, `WhatIDo`, `Experience`, `LatestWorks`, `Testimonials`,
  `Footer`. `LatestWorks` lee proyectos visibles de Supabase client-side; el resto son estáticos
  salvo los campos marcados con `data-content-key`.
- `src/pages/index.astro` — ensambla la home.
- `src/pages/admin/index.astro` — login (Supabase Auth) + editor de contenido (`CONTENT_FIELDS`) +
  gestor de proyectos (sync de GitHub, edición inline, subida de imagen a Storage, visible/orden).
- `public/assets/` — assets exportados del Figma (logo, ilustración, badge, iconos de servicios,
  imágenes de ejemplo de "Latest Works"). `logo.png` es pesado (~360KB) — sin optimizar aún.

### Supabase

- Proyecto: `portfolio-v2` (`tamuywduflftzsomssrb`, org `rwwvmqufwnciicabgpwc`, región `us-east-1`).
- Migraciones aplicadas: `init_content_and_projects` (tablas + RLS) y `project_images_bucket`
  (bucket público de lectura, escritura solo autenticado).
- `.env` local (gitignored) tiene `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` de este
  proyecto.

### Pendiente / próximos pasos

1. **Crear el usuario admin** en Supabase Dashboard → Authentication → Users → Add user, con el
   email `johan16zulu@gmail.com` y una contraseña propia. No hay signup público en la app a
   propósito (esa es la barrera de seguridad).
2. **Configurar secrets en GitHub** (repo → Settings → Secrets and variables → Actions):
   `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` (mismos valores del `.env` local), para que el
   workflow de deploy pueda buildear.
3. **Activar GitHub Pages** en el repo (Settings → Pages → Source: GitHub Actions) la primera vez.
4. Revisión visual completa contra el Figma (mobile y desktop) — se hizo una pasada de estructura y
   colores pero falta un ajuste fino de espaciados en breakpoints intermedios.
5. Sembrar 2-3 proyectos reales desde `/admin` (sync de GitHub + imagen) para que "My Latest Works"
   no se vea vacío en producción.
6. Los textos de "People Talk About Me" están hardcodeados en `Testimonials.astro` (no vienen de
   Supabase) — si se quieren editables desde el admin, hay que moverlos a `content` como los demás
   campos.
7. Optimizar `public/assets/logo.png` (bajar peso) si el Lighthouse score importa.
8. Rama `dev` creada para trabajar sin afectar producción; `main` es la que despliega. Fusionar
   `dev` → `main` cuando algo esté listo para salir a producción.
