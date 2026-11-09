# Project Guidelines & Architecture Standards

This repository contains the production portfolio website for **Subham Khandual**, engineered with React 19, Vite, Three.js / React Three Fiber, GSAP, Framer Motion, and CSS Modules.

---

## 1. Typography Standard (Strict Guardrail)

All typography across the codebase must strictly adhere to the defined design system. Hardcoded font names (such as 'Outfit', 'Roboto', 'Arial') are strictly prohibited.

- **Headings (`h1` - `h6`, section titles, badges, stat figures):**
  Use `var(--font-heading)`, mapped to `'Poppins', -apple-system, BlinkMacSystemFont, sans-serif`.
  Supported font weights: 400, 500, 600, 700, 800.

- **Body & UI Elements (paragraphs, navigation links, buttons, cards, inputs):**
  Use `var(--font-body)`, mapped to `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`.
  Supported font weights: 300, 400, 500, 600, 700.

- **Monospace & Code (terminal, code badges, tech tags):**
  Use `var(--font-code)`, mapped to `'Fira Code', monospace`.

---

## 2. Component Architecture & React 19 Standards

- **Above-the-fold UI:** Keep critical above-the-fold components (`Navbar`, `Hero`, `LoadingScreen`, `CustomCursor`) in the initial bundle for instantaneous First Contentful Paint (FCP).
- **Below-the-fold Sections:** All heavy below-the-fold sections (`About`, `Skills`, `Projects`, `Experience`, `Achievements`, `GithubSection`, `Certificates`, `Contact`, `Footer`) and on-demand modals (`AiChatbot`, `CommandPalette`, `TerminalModal`) must be code-split using `React.lazy()` and wrapped in `<Suspense fallback={null}>`.
- **React 19 Hook Purity:** Never invoke impure functions like `Math.random()` or non-deterministic date constructors inside render bodies or `useMemo`. Use deterministic seed generators to prevent hydration and purity lint errors.
- **Three.js & WebGL Safety:** Always wrap 3D canvases and text meshes inside `<Suspense fallback={null}>`. Explicitly attach dark scene backgrounds (`<color attach="background" args={['#070d1a']} />`) to prevent white crash frames.

---

## 3. Animation & 60 FPS Performance Rules

- **Zero-Conflict Policy:** Never apply CSS `transition: all` to elements animated by GSAP or Framer Motion transforms. CSS transitions fight JavaScript rAF loops every frame, causing jitter, freezing, or opacity zero lockups.
- **Selective CSS Transitions:** Only transition CSS properties not touched by JS animation engines (e.g., `transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease`).
- **GSAP Cleanups:** For entrance animations, prefer `gsap.fromTo(...)` and set `clearProps: 'all'` or `clearProps: 'opacity,visibility,transform'` upon completion to strip inline styles and restore pure CSS control.
- **Reduced Motion:** Always respect accessibility by guarding timelines and motion values with `window.matchMedia('(prefers-reduced-motion: reduce)')`.

---

## 4. Styling & CSS Modules

- **Component Scoping:** All component styling must reside in dedicated CSS modules (`[ComponentName].module.css`).
- **Responsive Breakpoints:** Standard breakpoints are `1240px`, `1024px`, `768px`, and `640px`. Mobile viewports must preserve full usability without horizontal scroll leakage.
- **Design Tokens:** Always utilize CSS variables defined in `src/index.css` for colors, gradients, border radii, and font definitions.

---

## 5. Verification & Quality Gates

Every code modification must pass two gates before completion:
1. `npm run lint` must exit with 0 errors and 0 warnings.
2. `npm run build` must succeed without bundling or module resolution failures.

---

## 6. Git & Commit Guidelines

- **Commit Format:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `perf:`).
- **Windows Sandboxing:** When operating inside restricted sandbox environments on Windows, git write commands (staging and committing) require elevated permissions to write `.git/index.lock`.
- **Atomic Commits:** Keep commits scoped to single functional improvements or bug fixes.
