# Portfolio — Shubh Pratap Singh

Single-page, scroll-driven personal site. Dark, motion-led, built so the
interaction is part of the work rather than decoration on top of it.

<a href="[https://mysiteurl.cantsharewithyou](https://new-portfolio-ecru-psi.vercel.app/)" target="_blank">
  <button>🌐 Live: Click Here</button>
</a>

**Live:**[Click Here](https://new-portfolio-ecru-psi.vercel.app/)

## Stack

- **Next.js 16** (App Router) + **React 19** + TypeScript
- **GSAP 3** with ScrollTrigger for scrubbed and pinned animation
- CSS Modules, with all design tokens in `src/app/globals.css`
- Deployed on Vercel

No UI framework and no WebGL engine — the 3D graph and the retrieval field are
hand-written canvas, which keeps the bundle small enough to hold the
Lighthouse targets below.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

## Structure

```
src/
├── app/
│   ├── globals.css     # design tokens (colour, type, spacing, motion) + reset
│   ├── layout.tsx      # fonts, metadata, page chrome
│   ├── page.tsx        # section order
│   └── icon.svg        # favicon
├── components/
│   ├── sections/       # Hero, Manifesto, Projects, Process, Experience, Contact
│   └── ui/             # Nav, Cursor, Grain, Hud, Intro, RetrievalField, Scene3D
└── lib/
    ├── gsap.ts             # plugin registration, run once
    └── animation-utils.ts  # easing/duration tokens, reduced-motion, magnetic
```

Each section owns its own GSAP timeline inside its own file. Only genuinely
shared behaviour lives in `lib/`.

## Conventions

- Component files `PascalCase.tsx`, CSS Modules matching the component name,
  classes in `camelCase`.
- **Never hardcode a colour, spacing value, or easing curve in a component.**
  Every one of them is a custom property in `globals.css`; sections consume
  tokens so nothing drifts.
- Motion has two registers: pointer-driven interactions are fast
  (`--dur-snap`, 280ms), scroll-scrubbed scene changes are slow.

## Accessibility and performance

Current audit (production build): **Accessibility 100, Best Practices 100,
SEO 100**, LCP ~100ms, CLS 0.

- `prefers-reduced-motion` disables scrubbing, parallax and cursor-follow, and
  falls back to plain fades.
- The custom cursor only activates on fine-pointer devices; touch keeps its own.
- Nav and contact links are never scroll-hijacked or animated out of position.
- Keyboard focus is visible everywhere, with a skip link to the main content.

## Content status

The three projects marked **shipped** and both experience entries are real.
The three marked **in build** are placeholders describing intended work — either
build them, replace them with real projects, or remove them before treating this
site as a factual record.
