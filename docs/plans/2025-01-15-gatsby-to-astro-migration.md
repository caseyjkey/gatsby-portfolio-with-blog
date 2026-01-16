# Gatsby to Astro Migration Plan

**Date:** 2025-01-15
**Migration Strategy:** All-at-once
**Styling:** styled-components → SCSS (hybrid modular pattern)
**Animations:** Motion (Framer Motion) + Astro View Transitions

---

## Architecture Overview

### New Project Structure

```
src/
├── styles/
│   ├── _theme.scss           # Central theme variables (colors, fonts, breakpoints)
│   ├── _animations.scss      # SCSS animation mixins/keyframes
│   ├── _mixins.scss          # Reusable SCSS mixins
│   └── _global.scss          # Global styles
├── animations/
│   └── config.ts             # JS config for Motion (no changes)
├── data/
│   └── *.json                # Data files (same as Gatsby)
├── content/
│   └── blog/
│       └── *.md              # Markdown posts
├── components/
│   ├── Navigation/
│   │   ├── Navigation.astro
│   │   ├── navigation.scss
│   │   ├── Hamburger.astro
│   │   └── hamburger.scss
│   ├── About/
│   │   ├── About.astro
│   │   └── about.scss
│   ├── Projects/
│   │   ├── Projects.astro      # Parent
│   │   ├── ProjectCard.astro   # Child (sibling)
│   │   └── projects.scss       # Shared styles
│   └── ...
└── pages/
    ├── index.astro
    ├── about.astro
    └── blog/
        └── [slug].astro        # Dynamic route
```

### Component Organization Pattern

Parent and child components live as **siblings** in the same folder:

```
Projects/
  ├── Projects.astro      # Parent component
  ├── ProjectCard.astro   # Child component
  └── projects.scss       # Shared styles
```

**Benefits:**
- Clear ownership (ProjectCard belongs to Projects)
- Short relative imports: `import ProjectCard from './ProjectCard.astro'`
- Shared styling via single `.scss` file
- Standard Astro/React pattern

---

## 1. SCSS Theme System

### Theme Variables (`src/styles/_theme.scss`)

```scss
@use 'sass:color';
@use 'sass:math';

// === Fonts ===
$primary-font: 'Poppins';

// === Colors ===
$white: #FFFFFF;
$black: #000000;
$darken: #232931;
$primary-color: #3e64ff;
$secondary-color: #a0f669;

// === Breakpoints ===
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
);

// === Mixin for responsive breakpoints ===
@mixin breakpoint($bp) {
  @media (min-width: map-get($breakpoints, $bp)) {
    @content;
  }
}

@mixin max-breakpoint($bp) {
  @media (max-width: map-get($breakpoints, $bp) - 1px) {
    @content;
  }
}

// === Common values ===
$glass-opacity: 0.88;
$nav-height: 85px;
```

### Usage in Components

```scss
// components/Navigation/navigation.scss
@use '../../styles/theme' as *;

.navbar {
  background-color: rgba(255, 255, 255, $glass-opacity);
  padding: $nav-height 0;

  @include max-breakpoint(lg) {
    padding: 1rem;
  }
}
```

---

## 2. Animation System

### Keep Motion Config (`src/animations/config.ts`)

No changes needed - Motion works in Astro!

```typescript
export const ANIMATION_CONFIG = {
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  rootMargin: '0px 0px -15% 0px',
  once: true,
  defaultDuration: 800,
  // ... rest of config
};
```

### Usage in Astro

```astro
---
import { motion } from 'motion/react';
import { HERO_TIMING } from '../animations/config';
---

<motion.div
  initial={{ opacity: 0, y: HERO_TIMING.hello.distance }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: HERO_TIMING.hello.duration / 1000,
    ease: HERO_TIMING.hello.easing
  }}
>
  Hello
</motion.div>
```

### SCSS Animations (`src/styles/_animations.scss`)

For CSS-based animations (not handled by Motion):

```scss
// === Easing curves ===
$ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
$ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

// === Keyframe animations ===
@keyframes ripple {
  0% { width: 0; height: 0; opacity: 0.6; }
  100% { width: 300px; height: 300px; opacity: 0; }
}

// === Mixins ===
@mixin press-effect {
  transition: transform 0.15s $ease-standard, box-shadow 0.15s $ease-standard;
  &:active {
    transform: scale(0.97);
  }
}
```

---

## 3. Astro Configuration

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import viewTransitions from '@astrojs/view-transitions';

export default defineConfig({
  integrations: [
    react(),
    viewTransitions(),
  ],
  sass: {
    scss: {
      includePaths: ['./src/styles'],
    },
  },
});
```

### `package.json` Updates

```json
{
  "scripts": {
    "dev": "astro dev --host --port 8001",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "deploy": "astro build && gh-pages -d dist -b master"
  },
  "dependencies": {
    "motion": "^10.x",
    "sass": "^1.x",
    "@astrojs/react": "^3.x",
    "@astrojs/view-transitions": "^0.x"
  }
}
```

---

## 4. Converting Styled Components

### Pattern: Styled Component → SCSS + Astro

**Before (styled-components):**
```tsx
export const Button = styled(BootstrapButton)`
  cursor: pointer;
  transition: transform 0.15s ease-out;

  &:active {
    transform: scale(0.97);
  }
`;
```

**After (SCSS + Astro):**
```scss
// components/Button/button.scss
@use '../../styles/theme' as *;
@use '../../styles/animations' as *;

.btn {
  cursor: pointer;
  @include press-effect;
}
```

```astro
---
// components/Button/Button.astro
const { variant = 'primary', ...props } = Astro.props;
---
<button class:list={['btn', `btn-${variant}`]} {...props}>
  <slot />
</button>

<style>
  @import '../../styles/theme.scss';
  @import './button.scss';
</style>
```

### Props-Driven Styles with Motion

Use Motion for animations, CSS for static values:

```astro
---
const { delay = 0, duration = 800 } = Astro.props;
const transition = {
  delay: delay / 1000,
  duration: duration / 1000,
  ease: [0.2, 0.8, 0.2, 1]
};
---
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={transition}
  class="fade-in-wrapper"
>
  <slot />
</motion.div>

<style>
  .fade-in-wrapper {
    /* Motion handles animation */
    /* CSS only for layout/static styles */
  }
</style>
```

---

## 5. Page Transitions

### Enable in Navigation

```astro
---
// components/Navigation/Navigation.astro
---

<nav>
  <a href="/" transition:animate="fade">Home</a>
  <a href="/about" transition:animate="fade">About</a>
  <a href="/skills" transition:animate="fade">Skills</a>
</nav>
```

### Global Scroll-to-Top

Add to base layout:

```astro
---
// components/Layout.astro
---

<html>
  <body>
    <slot />

    <script is:inline>
      document.addEventListener('astro:after-swap', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    </script>
  </body>
</html>
```

---

## 6. Data & Content

### JSON Data Files

Same structure, direct import:

```astro
---
import introData from '../data/introduction.json';
---

<h1>{introData.greeting}</h1>
```

### Markdown Blog Posts

**Structure:**
```
src/
  content/
    blog/
      post-1.md
      post-2.md
  pages/
    blog/
      [slug].astro
```

**Config:**
```js
// astro.config.mjs
export default defineConfig({
  markdown: {
    remarkPlugins: ['remark-smartypants'],
    shikiConfig: { theme: 'dracula' },
  },
});
```

**Dynamic Route:**
```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Content />
```

---

## 7. Migration Checklist

### Pre-Migration
- [ ] Create git worktree or new branch
- [ ] Run `npm create astro@latest -- --template minimal --install`
- [ ] Install: `npm install motion sass @astrojs/react @astrojs/view-transitions`

### Foundation (Day 1)
- [ ] Create `src/styles/` directory
- [ ] Create `_theme.scss`, `_animations.scss`, `_mixins.scss`, `_global.scss`
- [ ] Copy `src/animations/config.ts` (no changes)
- [ ] Port `Layout.astro` + base styles
- [ ] Add global scroll-to-top script

### Components (Day 2-3)
- [ ] Port `Navigation/` folder (most complex)
- [ ] Port `Footer/`
- [ ] Port remaining components one by one
- [ ] Convert each styled-component to SCSS

### Pages (Day 4-5)
- [ ] Port `index.astro` (Introduction)
- [ ] Port `about.astro`
- [ ] Port `skills.astro`
- [ ] Port remaining pages
- [ ] Set up blog dynamic routes

### Finalize (Day 6)
- [ ] Test all Motion animations
- [ ] Test page transitions
- [ ] Responsive testing (mobile/desktop)
- [ ] Run `astro build` successfully
- [ ] Deploy to GitHub Pages

---

## Key Decisions Summary

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Migration Type | All-at-once | Complete migration in one go |
| Styling | SCSS (hybrid modular) | Shared theme + component files |
| Element Animations | Motion | Astro-compatible, existing config |
| Page Transitions | Astro View Transitions | Built-in, smooth navigation |
| Component Pattern | Sibling folders | Clear ownership, standard pattern |
| Scroll Behavior | Scroll-to-top | Better UX for portfolio site |

---

## Files to Copy Without Changes

- `src/animations/config.ts` - Motion config works as-is
- `src/data/*.json` - Data files import directly
- `posts/*.md` → `src/content/blog/*.md` - Just move location
- `public/` - Static assets unchanged

---

## Build & Deploy Differences

| Gatsby | Astro |
|--------|-------|
| `gatsby develop` | `astro dev` |
| `gatsby build` | `astro build` |
| Output: `public/` | Output: `dist/` |
| `gatsby-plugin-image` | Native `<Image />` |
| `gatsby-source-filesystem` | Built-in collections |
