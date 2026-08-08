# Portfolio — Project Reference

A personal portfolio site built as a passion project. There is no external client — the owner is both client and developer, so this document is the brief. Read it in full before writing code; it encodes decisions that were deliberately made, not defaults to second-guess.

## 1. Project Description

- **Type**: Passion project, not a client deliverable. Optimize for how proud the owner is of the craft, not for conversion metrics.
- **Audience**: Whoever finds it — no single target persona (not specifically recruiters or specifically engineers). Design for someone who has never seen the person's resume and won't read one here either.
- **The one thing a visitor should walk away thinking**: *"This person makes things that feel alive."* The interactivity and motion are as much "the portfolio" as any listed project — craft and taste are the message, not just the vehicle for a resume.
- **Structure**: Single-page, scroll-driven (no separate routes/pages for the main experience).
- **Sections, in order**: Hero → Projects (deep) → Process/Philosophy → Experience → Contact.

  > **Open flag**: the owner originally scoped "6+ sections" but the confirmed list above has 5. Not a blocker, but worth a deliberate call during build — e.g. splitting "Process/Philosophy" into two distinct beats (a "how I work" and a "what I believe"), or adding a short intro/manifesto beat between Hero and Projects — rather than assuming the 5-section list is final.

## 2. Tech Stack & Constraints

- **Framework**: Next.js (App Router), React.
- **Animation**: GSAP + ScrollTrigger is the primary engine. It was chosen specifically for scroll-scrubbed and pinned animation (see §5) — don't substitute a lighter library that can't do scroll scrubbing without checking with the owner first.
- **Hosting**: Vercel.
- **Constraints**: None declared as hard blockers (e.g. no requirement to work without JS). Performance is governed by the Lighthouse target in §8, not by a separate mobile-specific carve-out.

## 3. File Structure

Uses a `src/` layout with assets in `public/`:

```
Portfolio/
├── CLAUDE.md
├── public/
│   ├── fonts/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css        # design tokens (CSS custom properties) + resets
│   ├── components/
│   │   ├── sections/           # Hero.tsx, Projects.tsx, Process.tsx, Experience.tsx, Contact.tsx
│   │   └── ui/                 # Nav.tsx, Cursor.tsx, and other cross-section chrome
│   └── lib/
│       ├── gsap.ts             # GSAP + ScrollTrigger registration/config, run once
│       └── animation-utils.ts  # shared easing presets, reduced-motion hook, cursor-tracking hook
```

- **CSS**: Co-located per component via CSS Modules (`Hero.tsx` + `Hero.module.css` in the same folder). No global styles folder beyond `app/globals.css` for tokens/resets.
- **Animation code**: Per-section — each section's GSAP logic (timelines, ScrollTrigger instances) lives with that section, not in one giant central controller. Concretely, this means co-locating the animation hook *inside* the section's own file (e.g. a `useHeroAnimation` function defined in `Hero.tsx` itself) rather than splitting it into a separate file, per the "fewer, larger files" preference in §6. Only pull logic out to `lib/` when it's genuinely shared across sections (easing presets, the reduced-motion check, cursor tracking).

## 4. Design Tokens

- **Mode**: Dark only (no light-mode toggle planned).
- **Palette**: Near-black background, off-white text, single bold accent used sparingly for highlights/CTAs/interactive states — never as a large fill.
  - `--color-bg`: `#0a0a0a`
  - `--color-text`: `#f2f2f0`
  - `--color-accent`: `#3D7CFF` (signature electric blue — reads precise/technical rather than motorsport-warm; deliberate choice over orange/lime alternatives)
- **Typography**: Oversized display sans for headlines, neutral sans for body — the "athlete site" register, not editorial-serif.
  - Display: **Clash Display** (Fontshare, free) — used large, bold/heavy weights, tight tracking for hero/section headlines.
  - Body: **Inter** (variable, Google Fonts) — used for body copy, labels, nav.
  - These are recommendations to fill an explicitly-requested "direction," not a locked final choice — swap freely if the owner has a preference, but don't ship without picking something concrete.
- **Spacing**: 8px grid — `8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 192`, exposed as CSS custom properties (`--space-1` … `--space-9`), not ad hoc pixel values in component CSS.
- **Signature motif — both of the following, used deliberately (not everywhere)**:
  1. **Grain/noise texture overlay** — a subtle film-grain layer over dark backgrounds, applied ambiently across the page to keep flat black from reading as a slide deck.
  2. **Technical HUD marks** — hairline rules, small monospace coordinate/index labels, corner-bracket accents. Telemetry/blueprint-coded. Build this as a reusable "frame" or "tag" component and scatter it deliberately on specific elements (project cards, section labels) rather than everywhere.

## 5. Animation Guidelines

- **Triggers, all three are in scope**:
  1. **Scroll position (scrubbed/pinned)** — reinstated after an initial gap in scoping; this is core to the vision, not optional. GSAP ScrollTrigger exists in the stack specifically for this.
  2. **Hover / cursor proximity**.
  3. **Click / active state**.
- **Personality — mixed by context**:
  - Micro-interactions (hover, buttons, cursor): snappy & mechanical — 150–400ms, sharp easing (`expo.out`, `quad.out`).
  - Big scene transitions (hero pin, section changes): slow & cinematic — 600ms–1.5s+, soft easing (`power2.inOut`, `power3.inOut`).
- **Signature moments — the ones that define whether this site succeeded**:
  1. **Custom cursor that changes context** — morphs based on what it's hovering (e.g. grows into a "View" label near project cards).
  2. **Project cards that react to cursor proximity** — 3D tilt and/or magnetic pull toward the pointer.
  3. **Hero that pins and transforms on scroll** — the opening scene locks in place while scroll drives a transformation before releasing into the next section.
  4. **Scroll-driven section transitions** — real layout change between sections (clip-path reveal, elements physically rearranging), not a plain fade.
- **Restraint baseline (non-negotiable, locked in explicitly because heavily-animated sites usually get this wrong)**:
  1. `prefers-reduced-motion` **always** disables scroll-scrubbing, parallax, and cursor-follow effects, falling back to simple fades/opacity transitions instead.
  2. Nav and contact links are **never** scroll-hijacked or animated out of a stable, immediately-clickable position.
  - Everything else — whether body text or specific project write-ups get any motion at all — is an open, section-by-section call to make during build, not pre-decided here.

## 6. Coding Conventions

- **Naming**: Standard idiomatic Next.js/React conventions — no bespoke scheme requested, so don't relitigate this:
  - Component files: `PascalCase.tsx` (e.g. `ProjectCard.tsx`).
  - Hooks/functions/variables: `camelCase` (e.g. `useCardTilt`).
  - CSS Module files: match the component name (`ProjectCard.module.css`); classes in `camelCase` for clean JS access (`styles.projectCard`).
- **File granularity**: Prefer **fewer, larger files** — co-locate a section's component and its animation logic rather than fragmenting into many small files. Only split out to `lib/` what's genuinely shared.
- **Comments**: Minimal. Only comment non-obvious things — a magic easing/duration value, a browser quirk workaround, a reduced-motion edge case. Don't comment what the code already says.

## 7. Content & Assets

- Status: partial — some real content exists, gaps not yet itemized in detail.
- **Approach**: Build placeholder-first. Structure and animate every section with realistic placeholder copy and correctly-sized placeholder imagery now, so layout/motion work isn't blocked on final content. Swap in real project write-ups, bio/experience copy, and images incrementally as they're ready, without needing to restructure sections to fit them.
- **Before final polish/launch**: confirm with the owner exactly which pieces (project list/details, bio/experience copy, images) are real vs. still placeholder — this was left unresolved during scoping and should be revisited rather than assumed.

## 8. Performance & Accessibility Bar

- **Target**: Lighthouse 90+ across Performance, Accessibility, Best Practices, and SEO.
- **Browser support**: Modern evergreen only — latest two versions of Chrome, Firefox, Safari, Edge. No legacy/IE-era fallbacks or polyfills needed; safe to lean on modern CSS/JS features.
- **Accessibility baseline**: `prefers-reduced-motion` support (§5) is the confirmed bar for now. Keyboard navigation and screen-reader semantics were explicitly deferred rather than ruled out.

  > **Open flag**: for a site meant to demonstrate craft, shipping without full keyboard operability or a screen-reader sanity pass is a real risk to the "this person makes things that feel alive" impression for anyone who hits that gap. Worth revisiting before launch even though it wasn't locked in during scoping — not blocking initial build.

## Tooling Notes

- No project-specific `.mcp.json` or `.claude/skills` were added. The Chrome DevTools MCP plugin and the `frontend-design` skill are already available globally and cover this project's visual QA, Lighthouse auditing, and design-guidance needs — add project-scoped config only if a specific need arises (e.g. a Vercel or GitHub MCP server for deploy/PR automation) rather than pre-provisioning speculatively.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
