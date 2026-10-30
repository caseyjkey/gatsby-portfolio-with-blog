# React-to-Astro Component Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert all React components from styled-components to native Astro components with SCSS, removing the React island wrapper pattern.

**Architecture:** Migrate page-by-page, starting with the simplest pages (Contact, Resume) and ending with the most complex (Home). Each page migration: convert its section components from React+styled-components to Astro+SCSS, keep Motion animations as React islands only where interactivity requires it, remove ThemeProvider/Body wrappers. Replace reactstrap grid with CSS grid/flexbox utility classes.

**Tech Stack:** Astro 6, SCSS (modular per-component), motion/react (for scroll-triggered animations only), CSS custom properties for theme tokens.

---

## Migration Strategy

### Ordering Principle: Simplest First
1. **Contact** — no lazy icons, no complex animations, simplest form
2. **Resume** — accordion needs React, but structure is straightforward
3. **About** — lazy icons + moderate animations
4. **Skills** — many icons, 3 illustration SVGs, 13 animation refs
5. **Experience** — timeline layout, complex inline styled-components
6. **Home** — orchestrates everything, hero with typewriter
7. **Navigation + Footer** — shared across all pages, complex scroll detection
8. **ProjectCards** — shared component used by Home and Projects pages

### Per-Component Pattern

**React+styled-components:**
```tsx
const Section = styled.section`
  padding: 6rem 0;
  background: ${(props) => props.theme.white};
`;
export default function MySection() {
  const { ref, isInView } = useInViewAnimation({ once: true });
  return (
    <Section>
      <motion.div ref={ref} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
        <Heading>Title</Heading>
      </motion.div>
    </Section>
  );
}
```

**Astro+SCSS:**
```astro
---
// MySection.astro
import { fadeInUpVariants, useInViewAnimation, TIMING } from '../../animations';
---
<section class="my-section">
  <motion.div
    initial={fadeInUpVariants.initial}
    animate={fadeInUpVariants.visible}
    transition={{ duration: TIMING.sectionHeader.duration / 1000, ease: TIMING.sectionHeader.easing }}
  >
    <h2 class="heading">Title</h2>
  </motion.div>
</section>

<style lang="scss">
  @use '../../styles/theme' as *;
  .my-section { padding: 6rem 0; background: $white; }
  .heading { color: $black; font-size: 50px; font-weight: 700; }
  @include max-breakpoint(md) { .heading { font-size: 38px; } }
</style>
```

**Key decisions:**
- Motion animations stay as `client:only="react"` islands — Astro has no equivalent for scroll-triggered JS animations
- Components with no interactivity (static display) become pure Astro
- Components with state (form inputs, accordion, mobile menu) stay React but lose styled-components
- reactstrap Container/Row/Col → CSS grid utility classes in `_layout.scss`
- Theme tokens → SCSS variables in `_theme.scss` + CSS custom properties in `global.scss`
- `polished` lighten/darken → `sass:color.adjust()`
- No ThemeProvider needed — SCSS has access to variables at compile time

---

## Task 1: Create SCSS Foundation (_theme.scss + _layout.scss + _buttons.scss)

**Files:**
- Create: `src/styles/_theme.scss`
- Create: `src/styles/_layout.scss`
- Create: `src/styles/_buttons.scss`
- Modify: `src/styles/global.scss`
- Delete after: `src/components/style.ts` (only when all consumers are migrated)

**Step 1: Create `src/styles/_theme.scss`**

Central theme variables matching the existing styled-components theme object. All component SCSS files will `@use` this.

```scss
@use 'sass:color';
@use 'sass:math';
@use 'sass:map';

// === Fonts ===
$font-primary: 'Poppins', sans-serif;
$font-mono: 'JetBrains Mono', monospace;

// === Colors ===
$white: #ffffff;
$black: #000000;
$darken: #232931;
$light-gray: #f8f9fa;
$primary: #3e64ff;
$secondary: #a0f669;

// Derived colors (replaces polished.lighten)
$primary-hover: color.adjust($primary, $lightness: -10%);
$primary-active: color.adjust($primary, $lightness: -15%);
$darken-hover: #393f47;
$darken-active: #2d3238;
$text-muted: rgba(0, 0, 0, 0.58);
$text-body: color.adjust($black, $lightness: 60%);

// === Breakpoints ===
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
);

// === Mixins ===
@mixin breakpoint-up($name) {
  $min: map.get($breakpoints, $name);
  @if $min != null {
    @media (min-width: $min) { @content; }
  } @else {
    @content;
  }
}

@mixin breakpoint-down($name) {
  $max: map.get($breakpoints, $name);
  @if $max != null {
    @media (max-width: $max - 1px) { @content; }
  } @else {
    @content;
  }
}

// === Spacing ===
$section-padding: 6rem 0;
$container-max: 1200px;
$container-padding: 1.25rem;
```

**Step 2: Create `src/styles/_layout.scss`**

Replaces reactstrap Container/Row/Col with CSS grid utilities.

```scss
@use 'theme' as *;

.container {
  max-width: $container-max;
  margin: 0 auto;
  padding-left: $container-padding;
  padding-right: $container-padding;
}

.grid {
  display: grid;
  gap: 1.5rem;

  &--2 { grid-template-columns: repeat(2, 1fr); }
  &--3 { grid-template-columns: repeat(3, 1fr); }
  &--4 { grid-template-columns: repeat(4, 1fr); }

  @include breakpoint-down(lg) {
    &--3, &--4 { grid-template-columns: repeat(2, 1fr); }
  }

  @include breakpoint-down(sm) {
    &--2, &--3, &--4 { grid-template-columns: 1fr; }
  }
}

.flex-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
}

// Responsive columns for project cards (matches reactstrap Col md={6} xl={4})
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @include breakpoint-down(lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include breakpoint-down(md) {
    grid-template-columns: 1fr;
  }
}
```

**Step 3: Create `src/styles/_buttons.scss`**

Replaces styled-components Button variants.

```scss
@use 'theme' as *;

// Shared press animation mixin
@mixin press-effect {
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
  &:active {
    transform: scale(0.97);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
  }
  &:hover:not(:active) {
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2) !important;
  }
}

@mixin btn-base {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  @include press-effect;

  &:disabled, &.disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
}

.btn {
  @include btn-base;
  background: transparent;
  color: $darken;
}

.btn-primary {
  @include btn-base;
  background-color: $primary;
  border-color: $primary;
  color: $white;

  &:hover:not(:active) {
    background-color: $primary-hover;
    border-color: $primary-hover;
    color: $white;
  }
  &:active {
    background-color: $primary-active;
    border-color: $primary-active;
  }
}

.btn-secondary {
  @include btn-base;
  background-color: $darken;
  border-color: $darken;
  color: $white;

  &:hover:not(:active) {
    background-color: $darken-hover;
    border-color: $darken-hover;
    color: $white;
  }
  &:active {
    background-color: $darken-active;
    border-color: $darken-active;
  }
}

.btn-ghost {
  @include btn-base;
  background-color: transparent;
  border-color: $primary;
  color: $primary;

  &:hover:not(:active) {
    background-color: $primary;
    color: $white;
  }
  &:active {
    background-color: $primary-hover;
    color: $white;
  }
}

.btn-text {
  background: none;
  border: none;
  color: $darken;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: color 0.15s ease-out;

  &:hover { color: $primary; text-decoration: underline; }
  &:disabled, &.disabled { opacity: 0.65; cursor: not-allowed; }
}
```

**Step 4: Update `src/styles/global.scss`**

Add imports for the new partials and enhance CSS custom properties.

```scss
@use 'theme' as *;

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

:root {
  --color-white: #{$white};
  --color-black: #{$black};
  --color-darken: #{$darken};
  --color-primary: #{$primary};
  --color-secondary: #{$secondary};
  --text-muted: #{$text-muted};
}

html { scroll-behavior: smooth; }

body {
  margin: 0;
  min-width: 320px;
  font-family: $font-primary;
  background: $white;
  color: $text-body;
  font-size: 16px;
  line-height: 1.8;
  font-weight: 400;
}

// Menu lock (replaces Body.menu-show from styled-components)
body.menu-show {
  overflow: hidden;
  position: fixed;
  height: 100%;
  width: 100%;
}

a { color: inherit; }
img { max-width: 100%; display: block; }
main { min-height: 100vh; }
```

**Step 5: Verify build**

Run: `cd /home/trill/Development/gatsby-portfolio-with-blog/worktrees/astro-migration && bun run build`
Expected: Build succeeds (these are new files, nothing breaks existing code)

**Step 6: Commit**

```bash
git add src/styles/_theme.scss src/styles/_layout.scss src/styles/_buttons.scss src/styles/global.scss
git commit -m "feat(scss): add theme, layout, and button foundation"
```

---

## Task 2: Create Motion Animation Island Component

Since Astro has no built-in scroll-triggered animation, we need a small React island that wraps motion.div with IntersectionObserver logic. This replaces the per-component `useInViewAnimation` pattern.

**Files:**
- Create: `src/components/AnimatedSection.tsx`
- Modify: none

**Step 1: Create `src/components/AnimatedSection.tsx`**

This is the only React component we'll need for animations. All other components become Astro.

```tsx
import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ANIMATION_CONFIG, fadeInUpVariants } from '../animations';

type Props = {
  children: ReactNode;
  variants?: typeof fadeInUpVariants;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  rootMargin?: string;
};

export default function AnimatedSection({
  children,
  variants = fadeInUpVariants,
  delay = 0,
  duration = ANIMATION_CONFIG.defaultDuration,
  once = true,
  className,
  rootMargin = ANIMATION_CONFIG.rootMargin,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return (
    <motion.div
      ref={ref}
      initial={variants.initial}
      animate={isInView ? variants.visible : variants.initial}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Verify**

Run: `cd /home/trill/Development/gatsby-portfolio-with-blog/worktrees/astro-migration && bun run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/AnimatedSection.tsx
git commit -m "feat: add AnimatedSection React island for scroll animations"
```

---

## Task 3: Migrate Contact Page

**Files:**
- Create: `src/components/Contact/ContactForm.tsx` (React island — form needs state)
- Create: `src/components/Contact/contact.scss`
- Modify: `src/pages/contact.astro` (remove React wrapper, use Astro component)
- Delete after: `src/components/Contact.tsx`, `src/react-pages/ContactPage.tsx`

**Step 1: Create `src/components/Contact/contact.scss`**

```scss
@use '../../styles/theme' as *;
@use '../../styles/buttons' as *;

.contact {
  padding: $section-padding;
  position: relative;

  &__header {
    text-align: center;
    margin-bottom: 3rem;

    h2 {
      font-size: 50px;
      font-weight: 700;
      color: $black;
      @include breakpoint-down(sm) { font-size: 38px; }
    }

    p {
      max-width: 42rem;
      margin: 0.75rem auto 0;
      color: $text-muted;
    }
  }

  &__form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    input,
    textarea {
      width: 100%;
      padding: 0.85rem 1rem;
      font-size: 1rem;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 0.375rem;
      font-family: $font-primary;
      background: $white;
      color: $black;

      &:focus {
        outline: none;
        border-color: $primary;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }
    }

    textarea {
      min-height: 150px;
      resize: vertical;
    }
  }

  &__status {
    text-align: center;
    font-weight: 500;
    margin-top: 0.5rem;

    &--success { color: $secondary; }
    &--error { color: #e74c3c; }
  }
}
```

**Step 2: Create `src/components/Contact/ContactForm.tsx`**

Small React island for the form (needs useState for form state and XHR).

```tsx
import { useState, type FormEvent } from 'react';
import AnimatedSection from '../AnimatedSection';
import { TIMING, SECONDARY_DELAYS } from '../../animations';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xpzvqjld', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="contact">
      <div className="container">
        <AnimatedSection>
          <div className="contact__header">
            <h2>Get In Touch</h2>
            <p>Have a project in mind or just want to connect? Send me a message.</p>
          </div>
        </AnimatedSection>

        <form className="contact__form" onSubmit={handleSubmit}>
          <AnimatedSection delay={SECONDARY_DELAYS.immediate}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </AnimatedSection>
          <AnimatedSection delay={SECONDARY_DELAYS.short}>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </AnimatedSection>
          <AnimatedSection delay={SECONDARY_DELAYS.medium}>
            <textarea
              name="message"
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </AnimatedSection>
          <AnimatedSection delay={SECONDARY_DELAYS.extended}>
            <button type="submit" className="btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </AnimatedSection>
          {status === 'success' && (
            <p className="contact__status contact__status--success">Message sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="contact__status contact__status--error">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}
```

**Step 3: Update `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ContactForm from '../components/Contact/ContactForm';
---

<BaseLayout title="Contact | Casey Key">
  <ContactForm client:only="react" />
</BaseLayout>
```

**Step 4: Verify**

Run: `cd /home/trill/Development/gatsby-portfolio-with-blog/worktrees/astro-migration && bun run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/components/Contact/ src/pages/contact.astro
git commit -m "feat: migrate Contact page to Astro + SCSS"
```

---

## Task 4: Migrate Resume Page

**Files:**
- Create: `src/components/Resume/ResumeAccordion.tsx` (React island — accordion needs state)
- Create: `src/components/Resume/resume.scss`
- Modify: `src/pages/resume.astro`
- Delete after: `src/components/Resume/Resume.tsx`, `src/components/Resume/Entry.tsx`, `src/components/Resume/AnimatedAccordionBody.tsx`, `src/components/Resume/Page.tsx`, `src/components/Resume/style.ts`, `src/react-pages/ResumePage.tsx`

**Step 1: Create `src/components/Resume/resume.scss`**

```scss
@use '../../styles/theme' as *;
@use '../../styles/buttons' as *;

.resume {
  padding: $section-padding;
  position: relative;

  &__header {
    text-align: center;
    margin-bottom: 3rem;

    h2 {
      font-size: 50px;
      font-weight: 700;
      color: $black;
      @include breakpoint-down(sm) { font-size: 38px; }
    }

    a { margin-top: 1rem; }
  }

  &__section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $primary;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
  }

  &__entry {
    display: grid;
    grid-template-columns: 50px 2em 1fr auto;
    gap: 0 1rem;
    padding: 1rem 0.5rem;
    align-items: start;

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $primary;
      font-size: 1.25rem;
    }

    &-line {
      border-left: 2px solid rgba($primary, 0.2);
      min-height: 100%;
    }

    &-content {
      h3 { margin: 0 0 0.25rem; font-size: 1.1rem; }
      &-subtitle { color: $text-muted; font-size: 0.95rem; }
      &-date { color: $text-muted; font-size: 0.85rem; white-space: nowrap; }
      &-description { color: $text-body; line-height: 1.7; margin-top: 0.5rem; }
    }
  }

  // Accordion
  &__accordion {
    max-width: 800px;
    margin: 0 auto;
  }

  &__accordion-item {
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 0.75rem;
    margin-bottom: 0.75rem;
    overflow: hidden;
    background: $white;
  }

  &__accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 700;
    color: $black;
    font-family: $font-primary;
    transition: background 0.15s ease;

    &:hover { background: rgba(0, 0, 0, 0.02); }

    .icon {
      transition: transform 0.3s ease;
      color: $primary;
    }

    &[aria-expanded="true"] .icon {
      transform: rotate(180deg);
    }
  }

  &__accordion-body {
    padding: 0 1.25rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease, padding 0.4s ease;

    &.open {
      padding: 0 1.25rem 1.25rem;
    }
  }

  @include breakpoint-down(sm) {
    &__entry {
      grid-template-columns: 40px 1.5em 1fr;
    }
    &__entry-date { display: none; }
  }
}
```

**Step 2: Create `src/components/Resume/ResumeAccordion.tsx`**

React island for accordion state management. Reads from `src/data/experience.ts`.

```tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedSection from '../AnimatedSection';
import {
  GiGraduateCap, AiOutlineTeam, TbCertificate, GoStar,
} from 'react-icons';
import experienceData from '../../data/experience';
import type { ExperienceEntry } from '../../data/experience';
import { ACCORDION } from '../../animations';

const sections = [
  { key: 'education', title: 'Education', icon: GiGraduateCap, filter: (e: ExperienceEntry) => e.bullets.some(b => b.toLowerCase().includes('degree') || b.toLowerCase().includes('university') || b.toLowerCase().includes('gpa')) },
  { key: 'experience', title: 'Experience', icon: AiOutlineTeam, filter: (e: ExperienceEntry) => !e.bullets.some(b => b.toLowerCase().includes('degree') || b.toLowerCase().includes('university') || b.toLowerCase().includes('gpa')) },
  { key: 'awards', title: 'Awards', icon: TbCertificate, filter: () => false },
  { key: 'leadership', title: 'Leadership', icon: GoStar, filter: () => false },
];

export default function ResumeAccordion() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section className="resume">
      <div className="container">
        <AnimatedSection>
          <div className="resume__header">
            <h2>Resume</h2>
          </div>
        </AnimatedSection>
        <div className="resume__accordion">
          {sections.map(({ key, title, icon: Icon, filter }) => {
            const entries = key === 'education'
              ? experienceData.filter(filter)
              : key === 'experience'
                ? experienceData.filter(filter)
                : [];
            return (
              <div key={key} className="resume__accordion-item">
                <button
                  className="resume__accordion-header"
                  aria-expanded={openKey === key}
                  onClick={() => setOpenKey(openKey === key ? null : key)}
                >
                  <span><Icon style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />{title}</span>
                  <span className="icon">▼</span>
                </button>
                <div className={`resume__accordion-body ${openKey === key ? 'open' : ''}`}>
                  {openKey === key && entries.map((entry, i) => (
                    <AnimatedSection key={i} delay={i * ACCORDION.staggerDelay * 1000}>
                      <div className="resume__entry">
                        <div className="resume__entry-icon"><Icon /></div>
                        <div className="resume__entry-line" />
                        <div className="resume__entry-content">
                          <h3>{entry.company}</h3>
                          <div className="resume__entry-content-subtitle">{entry.title}</div>
                          <div className="resume__entry-content-date">{entry.year} · {entry.location}</div>
                          <ul className="resume__entry-content-description">
                            {entry.bullets.map((b, j) => <li key={j}>{b}</li>)}
                          </ul>
                        </div>
                        <div className="resume__entry-date">{entry.year}</div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

> **Note:** The Resume page's accordion data model needs verification. Read `src/data/experience.ts` to confirm which entries are education vs experience before finalizing the filter logic. The above is a reasonable starting point.

**Step 3: Update `src/pages/resume.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ResumeAccordion from '../components/Resume/ResumeAccordion';
---

<BaseLayout title="Resume | Casey Key">
  <ResumeAccordion client:only="react" />
</BaseLayout>
```

**Step 4: Verify build, then commit**

```bash
git add src/components/Resume/ src/pages/resume.astro
git commit -m "feat: migrate Resume page to Astro + SCSS"
```

---

## Task 5: Migrate About Page

**Files:**
- Create: `src/components/About/AboutSection.tsx` (React island — lazy icons need JS)
- Create: `src/components/About/about.scss`
- Modify: `src/pages/about.astro`
- Delete after: `src/components/About.tsx`, `src/components/About/Activity.tsx`, `src/components/About/style.ts`, `src/react-pages/AboutPage.tsx`

**Step 1: Create `src/components/About/about.scss`**

Read `src/components/About/style.ts` and `src/components/About.tsx` to get exact styles. Convert all styled-components to SCSS classes using `@use '../../styles/theme' as *`.

Key elements:
- `.about` — section with padding, image on one side, text on other
- `.about__image` — border-radius, object-fit cover
- `.about__description` — max-width 680px, line-height 1.8
- `.about__activity` — icon wrapper circle + text
- `.about__consultant` — border-left primary color, max-width 900px

**Step 2: Create `src/components/About/AboutSection.tsx`**

React island because it lazy-loads icons from react-icons based on JSON config. Uses `AnimatedSection` for scroll animations.

Read `src/data/about.json` and `src/components/About.tsx` for exact structure.

**Step 3: Update `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import AboutSection from '../components/About/AboutSection';
---

<BaseLayout title="About | Casey Key">
  <AboutSection client:only="react" />
</BaseLayout>
```

**Step 4: Verify build, then commit**

---

## Task 6: Migrate Skills Page

**Files:**
- Create: `src/components/Skills/SkillsSection.tsx` (React island — 19 icon imports + 3 illustration SVGs)
- Create: `src/components/Skills/skills.scss`
- Modify: `src/pages/skills.astro` (create new Astro page, currently doesn't exist as standalone)
- Delete after: `src/components/Skills.tsx`, `src/components/Skills/Skill.tsx`, `src/components/Skills/style.ts`, `src/components/Skills/FullStackIllustration.tsx`, `src/components/Skills/AiSystemsIllustration.tsx`, `src/components/Skills/InfrastructureIllustration.tsx`

This stays as a React island because of the heavy icon usage and inline SVG illustrations. The gain is removing styled-components in favor of SCSS classes.

**Step 1:** Read `src/components/Skills.tsx` and `src/components/Skills/style.ts` to extract all styles to `skills.scss`

**Step 2:** Rewrite `SkillsSection.tsx` using CSS classes instead of styled-components, keeping the same JSX structure and motion animations

**Step 3:** Verify build, then commit

---

## Task 7: Migrate Experience Section

**Files:**
- Create: `src/components/Experience/ExperienceTimeline.tsx` (React island — scroll-triggered timeline animation)
- Create: `src/components/Experience/experience.scss`
- Modify: (used within HomePage, no standalone page currently)
- Delete after: `src/components/Experience/index.tsx`

This is a complex component with an animated vertical timeline, progressive stagger for entries and bullets. The entire timeline with its animation orchestration stays React, but styled-components become SCSS.

**Step 1:** Read `src/components/Experience/index.tsx` to understand the full inline styled-components and animation pattern

**Step 2:** Extract all inline styles to `experience.scss`

**Step 3:** Rewrite component using CSS classes

**Step 4:** Verify build, then commit

---

## Task 8: Migrate Introduction (Hero) Section

**Files:**
- Create: `src/components/Introduction/HeroSection.tsx` (React island — typewriter effect, blob SVGs, scroll)
- Create: `src/components/Introduction/hero.scss`
- Modify: (used within HomePage)
- Delete after: `src/components/Introduction.tsx`, `src/components/Introduction/style.ts`, `src/components/Introduction/Mouse.tsx`

Complex: typewriter effect, responsive text scaling, blob SVG backgrounds, falling arrow animation. All stay React but lose styled-components.

**Step 1:** Read `src/components/Introduction.tsx`, `src/components/Introduction/style.ts`, `src/components/Introduction/Mouse.tsx`

**Step 2:** Consolidate into single `HeroSection.tsx` with `hero.scss`

**Step 3:** Verify build, then commit

---

## Task 9: Migrate Navigation

**Files:**
- Create: `src/components/Navigation/NavBar.tsx` (React island — scroll direction, mobile drawer, active state)
- Create: `src/components/Navigation/navigation.scss`
- Modify: (used within HomePage and other pages via ThemeProvider)
- Delete after: `src/components/Navigation.tsx`, `src/components/Navigation/Nav.tsx`, `src/components/Navigation/NavStyles.tsx`, `src/components/Navigation/Hamburger.tsx`

Most complex component: scroll direction detection, mobile drawer with body lock, hamburger animation, ripple effect on links, active state tracking. Stays React.

**Step 1:** Read all Navigation files to understand the full pattern

**Step 2:** Consolidate Nav + NavStyles + Hamburger into single `NavBar.tsx` with `navigation.scss`

**Step 3:** Verify build, then commit

---

## Task 10: Migrate Footer

**Files:**
- Create: `src/components/Footer/FooterSection.tsx` (React island — uses react-icons, polished)
- Create: `src/components/Footer/footer.scss`
- Delete after: `src/components/Footer.tsx`, `src/components/Social.tsx`

**Step 1:** Read `src/components/Footer.tsx` and `src/components/Social.tsx`

**Step 2:** Convert to SCSS classes, keep as React island (react-icons)

**Step 3:** Verify build, then commit

---

## Task 11: Migrate ProjectCards

**Files:**
- Create: `src/components/Projects/ProjectCards.tsx` (React island — date formatting, motion animations)
- Create: `src/components/Projects/projects.scss`
- Modify: `src/react-pages/HomePage.tsx` (or new Astro page) and `src/react-pages/ProjectsPage.tsx`
- Delete after: `src/react-pages/ProjectCards.tsx`

**Step 1:** Read existing `src/react-pages/ProjectCards.tsx`

**Step 2:** Move to `src/components/Projects/ProjectCards.tsx` with SCSS styles, same props interface

**Step 3:** Verify build, then commit

---

## Task 12: Migrate Home Page

**Files:**
- Modify: `src/pages/index.astro` (compose all section islands)
- Delete after: `src/react-pages/HomePage.tsx`

**Step 1:** Update `src/pages/index.astro` to import all section components directly, removing the ThemeProvider/Body wrapper

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import NavBar from '../components/Navigation/NavBar';
import HeroSection from '../components/Introduction/HeroSection';
import SkillsSection from '../components/Skills/SkillsSection';
import ExperienceTimeline from '../components/Experience/ExperienceTimeline';
import ProjectCards from '../components/Projects/ProjectCards';
import FooterSection from '../components/Footer/FooterSection';
import { getFeaturedProjects } from '../lib/projects';

const featuredProjects = getFeaturedProjects();
---

<BaseLayout>
  <NavBar client:only="react" />
  <HeroSection client:only="react" />
  <SkillsSection client:only="react" />
  <ExperienceTimeline client:only="react" />
  <ProjectCards
    client:only="react"
    projects={featuredProjects}
    title="Featured Work"
    subtitle="Selected builds spanning product engineering, AI systems, and client delivery."
  />
  <FooterSection client:only="react" />
</BaseLayout>
```

**Step 2:** Update Projects page similarly

**Step 3:** Verify build, then commit

---

## Task 13: Migrate About Page (use new NavBar + Footer)

**Files:**
- Modify: `src/pages/about.astro` — add NavBar and FooterSection islands

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import NavBar from '../components/Navigation/NavBar';
import AboutSection from '../components/About/AboutSection';
import FooterSection from '../components/Footer/FooterSection';
---

<BaseLayout title="About | Casey Key">
  <NavBar client:only="react" />
  <AboutSection client:only="react" />
  <FooterSection client:only="react" />
</BaseLayout>
```

Same pattern for Contact and Resume pages.

**Step 1:** Update all page files

**Step 2:** Verify build, then commit

---

## Task 14: Cleanup — Remove Dead Code

**Files:**
- Delete: `src/components/style.ts` (global styled-components theme)
- Delete: `src/styled-components.d.ts`
- Delete: `src/react-pages/` (all files)
- Delete: `src/components/Layout/style.scss` (legacy Gatsby SCSS — verify nothing uses it first)
- Modify: `package.json` — remove unused dependencies
- Modify: `astro.config.mjs` — remove `ssr.noExternal` for styled-components

**Step 1: Verify no remaining imports of deleted files**

```bash
grep -r "styled-components" src/ --include="*.tsx" --include="*.ts" --include="*.astro"
grep -r "from.*style" src/components/ --include="*.tsx" --include="*.ts" | grep -v ".scss"
```

Expected: No results (all styled-components usage removed)

**Step 2: Remove unused dependencies from package.json**

Dependencies to remove:
- `styled-components` (no longer used)
- `polished` (replaced by sass:color)
- `bootstrap` (replaced by CSS grid)
- `reactstrap` (replaced by CSS grid + custom accordion)
- `@loadable/component` (Gatsby-era)
- `react-scripts` (Gatsby-era CRA)
- `@testing-library/*` (Gatsby-era)
- `eslint` (Gatsby-era config)
- `webpack`, `webpack-cli` (Gatsby-era)
- `ts-migrate` (Gatsby-era)
- `react-visibility-sensor` (replaced by IntersectionObserver)
- `react-scroll` (replaced by native scroll)
- `prop-types` (TypeScript now)
- `react-animations` (using motion instead)
- `react-countup` (verify if used)
- `babel-plugin-styled-components` (no styled-components)
- `postcss`, `postcss-preset-env` (Astro handles this)
- `sharp` (Astro has built-in image optimization)
- `prism-react-renderer`, `prismjs` (Astro/Shiki handles this)
- `react-live` (if not used in content)
- `@mdx-js/react` (Astro MDX handles this)
- `unist-util-visit`, `@types/unist` (Gatsby-era remark plugins)

**Step 3: Run `bun install` to update lockfile**

**Step 4: Verify build succeeds**

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove styled-components, reactstrap, and other unused deps"
```

---

## Task 15: Final Verification

**Step 1: Run `astro check`**

Run: `bun run build` (which includes `astro check`)
Expected: 0 errors, 0 warnings

**Step 2: Start dev server and verify routes**

Run: `bun run dev`
Verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/` returns 200
Verify: `/about`, `/resume`, `/contact`, `/projects`, `/projects/2022-08-datacatalog/` all return 200

**Step 3: Visual check**

Open in browser, verify:
- Navigation works (scroll direction, mobile menu)
- Hero section typewriter + animations
- Skills section with illustrations
- Experience timeline animations
- Project cards layout
- Contact form submission
- Resume accordion
- Footer
- Page transitions between routes

**Step 4: Commit final state**

```bash
git add -A
git commit -m "feat: complete React-to-Astro component migration"
```

---

## Summary

| Task | What | React? | Complexity |
|------|------|--------|------------|
| 1 | SCSS foundation | No | Low |
| 2 | AnimatedSection island | Yes (reusable) | Low |
| 3 | Contact page | Yes (form) | Low |
| 4 | Resume page | Yes (accordion) | Medium |
| 5 | About page | Yes (lazy icons) | Medium |
| 6 | Skills page | Yes (icons + SVGs) | Medium |
| 7 | Experience timeline | Yes (animations) | Medium |
| 8 | Introduction/hero | Yes (typewriter) | High |
| 9 | Navigation | Yes (scroll + drawer) | High |
| 10 | Footer | Yes (icons) | Low |
| 11 | ProjectCards | Yes (motion) | Low |
| 12 | Home page composition | Astro orchestrator | Low |
| 13 | Add nav/footer to all pages | Astro | Low |
| 14 | Cleanup dead code | No | Medium |
| 15 | Final verification | No | Low |

**Key insight:** Every page section stays as a React island (`client:only="react"`) because they all use motion/react for scroll-triggered animations. The migration value is:
1. **Remove styled-components** → SCSS (smaller bundle, no runtime CSS-in-JS)
2. **Remove reactstrap** → CSS grid (no Bootstrap dependency)
3. **Remove ThemeProvider** → SCSS variables at compile time
4. **Page-level Astro** → proper SSR, SEO, view transitions
5. **Smaller JS chunks** → only the interactive islands ship JS, not entire pages
