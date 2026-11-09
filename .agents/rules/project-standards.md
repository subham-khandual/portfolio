# Antigravity Rules - Subham Khandual Portfolio

## Typography Rules
- Headings: strictly Poppins via `var(--font-heading)`.
- Body and UI: strictly Inter via `var(--font-body)`.
- Code: strictly Fira Code via `var(--font-code)`.
- Never introduce hardcoded font names like Outfit, Roboto, or Arial in CSS modules or inline JSX styles.

## Animation & GSAP Rules
- Never attach CSS `transition: all` to elements animated by GSAP or Framer Motion.
- Use `clearProps: 'all'` or `clearProps: 'opacity,visibility,transform'` on GSAP tweens.
- Guard all animations with `prefers-reduced-motion`.

## WebGL & React Three Fiber Rules
- Always wrap 3D canvas children in `<Suspense fallback={null}>`.
- Set canvas dark background explicitly (`#070d1a`) to prevent white canvas flashing during Chromium WebGL initialization.

## Communication Style Rules
- Hinglish in chat responses (Hindi and English mix).
- English in all repository code, comments, and commit messages.
- No long paragraphs. Use crisp points and markdown tables.
- Strictly avoid em-dashes. Use comma, hyphen, or period only.
