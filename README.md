# Ritik Raj — Portfolio

A responsive Next.js App Router portfolio built with TypeScript, SCSS Modules, and a dark editorial visual system.

## Requirements

- Node.js 20.9 or later
- npm

## Local development

From the `portfolio` directory:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation and production build

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

`npm start` serves the production build on port 3000 by default.

## Deploy to Vercel

### Vercel dashboard

1. Push the project to a Git provider and import the repository in Vercel.
2. Set **Root Directory** to `portfolio` if the app remains in this subdirectory.
3. Use the detected Next.js framework settings. The install command is `npm ci`; the build command is `npm run build`.
4. Leave the output directory at its default so Vercel can manage the Next.js build output.
5. Deploy a preview, verify it, then promote or merge to production.

### Vercel CLI

From the `portfolio` directory:

```bash
npx vercel
npx vercel --prod
```

The app does not require environment variables. Contact URLs and profile content are compiled from `src/data/portfolio.ts`; redeploy after changing them. Confirm the Google Drive resume has the intended sharing permissions before publishing.

## Project structure

```text
src/
  app/                 Routes, metadata, global styles, and page composition
  components/          Reusable page components and SCSS Modules
  data/                Editable profile and portfolio content
  hooks/               Client-side animation and interaction hooks
  shaders/             GLSL portrait shaders
  styles/              Shared SCSS tokens and mixins
public/
  images/profile.jpg   Monochrome portfolio portrait
  images/projects/     Replaceable project-art placeholders
```

The app uses Instrument Serif, Inter, and JetBrains Mono through `next/font`. GSAP and ScrollTrigger power entrance, reveal, parallax, image-mask, and timeline effects. Lenis is synchronized with the GSAP ticker. Framer Motion handles UI interactions; Three.js renders the interactive hero portrait with a static-image fallback. Motion-sensitive features respect `prefers-reduced-motion`, and the portrait animation pauses while it is offscreen.

Edit profile copy, skills, projects, experience, education, certifications, and contact links in `src/data/portfolio.ts`. Optional social links are rendered only when their URLs are provided.

## Details to finalize

- Replace the abstract project-art SVGs in `public/images/projects/` with project screenshots and update their paths and alt text.
- Add verified links and details for the remaining projects and certifications.
- Add an Instagram URL if you want that link shown.
