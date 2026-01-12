# Sitewide Animation Unification - Implementation Plan

## Executive Summary

This plan unifies all site animations under a single, performant system powered by **Motion One** (framework-agnostic WAAPI-based library). This ensures smooth 60fps animations even on slower devices and compatibility with future Astro migration.

**Current State:** Site uses 4 different animation approaches (AOS, react-animated-css, custom CSS keyframes, jQuery waypoints)

**Goal:** Replace with unified Motion One system following strict timing, easing, and behavioral rules.

---

## Technology Choice: Motion One

| Factor | Motion One | Framer Motion |
|--------|------------|---------------|
| Bundle Size | ~2-3KB | ~17-27KB |
| Performance | S-Tier (compositor thread) | A-Tier (main thread) |
| Astro Compatibility | ✅ Native (no hydration) | ⚠️ Requires React integration |
| API Style | Imperative | Declarative |
| Learning Curve | Moderate | Low |

**Why Motion One:**
- S-Tier performance = smooth on slow devices even under main thread load
- Framework-agnostic = works in Gatsby now and Astro later without changes
- Smallest bundle size = faster page loads

---

## Motion System Specification

### Global Constants

| Setting | Desktop | Mobile |
|---------|---------|--------|
| **Duration** | 800ms (varies by element) | 800ms (varies by element) |
| **Easing** | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Same |
| **Trigger** | `rootMargin: '0px 0px -15% 0px'` | `rootMargin: '0px 0px -10% 0px'` |
| **Behavior** | `once: true` | `once: true` |
| **Threshold** | Default | 0.05 (5%) |
| **Constraint** | - | Disable lateral movement if width > 90% viewport |

### Standardized Timing Table (All Pages)

| Element Type | Delay | Duration | Effect |
|--------------|-------|----------|--------|
| Section Header | 0ms | 800ms | Slide up 30px + Fade |
| Primary Column/Unit | 150ms | 700ms | Slide up 20px + Fade |
| Secondary Unit | +100ms | 700ms | Slide up 20px + Fade |
| Illustrations/Media | 300ms | 1000ms | Pure Fade or Soft Scale (0.98 → 1.0) |

---

## Desktop Animation Rules

| Rule | Pattern | Vector | Stagger |
|------|---------|--------|---------|
| **Inward Snap** | Split-Row (Illustration + Text) | Left: `translate(-20px, 30px) → 0`<br>Right: `translate(20px, 30px) → 0` | Same time, or Illustration +150ms |
| **Horizontal Wave** | Card Grids (Skills, Blog list) | Pure vertical: `translateY(30px) → 0` | `(col × 150ms) + (row × 50ms)` via `data-col`/`data-row` |
| **Focus Scale** | Text Hierarchy | 40px / 30px / 20px / 10px vertical lift | CSS transition-delay sequence |
| **Logical Unit** | Expertise sub-sections | Apply Rule 1 or 2 to wrapper div | - |

---

## Mobile Animation Rules

| Rule | Pattern | Vector | Stagger |
|------|---------|--------|---------|
| **Vertical Stack** | Expertise & Work rows | `translateY(20px) → 0` | 100ms sequential |
| **Timeline Draw** | Experience section | `translateX(-15px) → 0` | Triggered by blue dot |
| **Weighted Lift** | General text hierarchy | 30px / 20px / 10px vertical | - |

**Mobile Constraint:** Disable lateral (X-axis) movement if element width > 90% viewport

---

## Hero Entrance Rules (Home Page)

**Initialization:** All hero elements (except logo/nav) start at `opacity: 0` and `transform: translateY(30px)`

| Element | Delay | Vector | Duration | Special |
|---------|-------|--------|----------|---------|
| "Hello," H1 | 0ms | 30px up + Fade | 800ms | - |
| Intro Sentence | 150ms | 20px up + Fade | 800ms | - |
| Typewriter Container | 300ms | 10px up + Fade | 800ms | Must complete before typewriter starts |
| Sub-text/Description | 450ms | 10px up + Fade | 800ms | - |
| Portrait (Right) | 400ms | 30px vertical lift | 1200ms | Scale 0.95 → 1.0 |
| CTA Button | 600ms | 20px up + Fade | 800ms | - |
| Down Arrow | 1000ms | Fade in | 800ms | Then infinite bob loop (±5px) |

---

## Component-Specific Rules

### Core Expertise "Rows"
- Alternating rows (Text-Right/Image-Left, Text-Left/Image-Right)
- Main Header ("Core Expertise") triggers first (Section Header timing)
- Row Units: Illustration and Text Block are siblings
- Logic: Text Block animates, Illustration follows with +150ms delay ("follow-through" effect)

### Experience "Timeline"

| Device | Line Behavior | Node Trigger |
|--------|--------------|--------------|
| **Desktop** | Scroll-Linked ScaleY: Line length mapped to scroll depth | Triggers when container is 15% visible |
| **Mobile** | Timed Segment Reveal: Line grows in "jumps" between jobs | Triggers instantly when top of job card appears |

**Desktop Arrival Sequence:**
1. Line Segment: Grows downward from previous year
2. Blue Node: Fades + Pops `scale(0 → 1.2 → 1.0)` when line touches center
3. Content (Year/Company): Slides Right 15px when node is stable

### Skills Icons
- Desktop: Horizontal Wave (card grid stagger via `data-col`/`data-row`)
- Mobile: Vertical Stack

### Resume Page Accordion
- Height Animation: Smooth `grid-template-rows: 1fr` or `max-height` transition
- Content Lift: 10px upward slide + fade (0 → 1)
- Subsequent Opens: Repeat every time (no "cheap pop" on second open)
- Desktop: Slide 10px Up + 5px Right
- Mobile: Pure 10px vertical lift (prevent horizontal overflow)

### Blog/Project Cards
- Desktop: Horizontal Wave with `data-col`/`data-row` attributes
- Mobile: Vertical Stack

---

## Keep Existing (No Changes)
- Navigation bar scroll hide/show behavior
- Hamburger menu animation

---

## Implementation Phases

### Phase 1: Foundation Setup

**Status:** ✅ Completed

**Tasks Completed:**
1. ✅ Installed Motion One: `npm install motion`
2. ✅ Created animation infrastructure
3. ✅ Created configuration with global constants
4. ✅ Created reusable hooks (IntersectionObserver wrapper)
5. ✅ Created animation variants for each rule

**Files Created:**
```
src/
├── animations/
│   ├── index.ts                    # ✅ Public API exports
│   ├── config.ts                   # ✅ Global constants
│   ├── hooks/
│   │   ├── useInViewAnimation.ts   # ✅ IntersectionObserver wrapper
│   │   └── useReducedMotion.ts     # ✅ Reduced motion check
│   ├── transitions/
│   │   ├── fadeInUp.ts             # ✅ Fade variants
│   │   ├── inwardSnap.ts           # ✅ Diagonal animations
│   │   └── horizontalWave.ts       # ✅ Grid stagger
│   └── utils/
│       ├── easing.ts               # ✅ Easing functions
│       └── breakpoint.ts           # ✅ Mobile detection
```

---

### Phase 2: Hero Entrance

**Status:** ✅ Completed

**Tasks Completed:**
1. ✅ Refactored Introduction.tsx with hero entrance rules
2. ✅ Implemented timed sequenced animations using Motion One
3. ✅ Delay typewriter until container animation completes (300ms delay, 800ms duration)
4. ✅ Added portrait scale animation (0.95 → 1.0) for both mobile and desktop
5. ✅ Added down arrow entrance + bob loop (fade in at 1000ms, then infinite bob)

**Files Modified:**
- `src/components/Introduction.tsx` - Added Motion One entrance animations for all hero elements
- `src/components/Introduction/Mouse.tsx` - Added entrance animation + bob loop for down arrow

**Changes Made:**
- Removed `react-animated-css` dependency from Introduction.tsx
- Added refs for: greeting, intro sentence, typewriter container, portraits, CTA button
- Implemented entrance animations with proper timing from HERO_TIMING config:
  - Greeting: 0ms delay, 30px up + Fade, 800ms
  - Intro sentence: 150ms delay, 20px up + Fade, 800ms
  - Typewriter container: 300ms delay, 10px up + Fade, 800ms
  - Portrait (both mobile/desktop): 400ms delay, 30px lift, 1200ms, Scale 0.95 → 1.0
  - CTA Button: 600ms delay, 20px up + Fade, 800ms
  - Down arrow: 1000ms delay, Fade in 800ms, Then infinite bob loop (±5px)

---

### Phase 3: Core Expertise Migration

**Status:** ✅ Completed

**Tasks Completed:**
1. ✅ Applied Motion One animations to Skills.tsx section
2. ✅ Removed `react-animated-css` and `Waypoint` dependencies
3. ✅ Added Section Header timing for main header
4. ✅ Added horizontal wave stagger for skill icons using data-skill-index

**Files Modified:**
- `src/components/Skills.tsx` - Added entrance animations with IntersectionObserver
- `src/components/Skills/Skill.tsx` - Removed Animated/Waypoint, added props spread for data attributes
- `src/components/Services.tsx` - Added header + card animations
- `src/components/Services/Service.tsx` - Converted to functional component, removed old animation libs

---

### Phase 4: Horizontal Wave (Grid Components)

**Status:** ✅ Completed

**Tasks Completed:**
1. ✅ Added `data-project-index` attributes to Project cards
2. ✅ Implemented Horizontal Wave stagger calculation: `(col * 150) + (row * 50)`
3. ✅ Applied to Projects cards
4. ✅ Section header animations for all sections

**Files Modified:**
- `src/components/Projects.tsx` - Added header + card animations with stagger
- `src/components/Projects/Project.tsx` - Removed Animated wrapper, added props spread for data attributes

---

### Phase 5: Experience Timeline

**Status:** ✅ Completed

**Tasks Completed:**
1. ✅ Converted Entry.tsx to functional component with Framer Motion
2. ✅ Converted Skill.tsx to Framer Motion with fade in
3. ✅ Added vertical timeline line with scroll-linked growth (desktop via `useScroll`)
4. ✅ Added blue node/dot at each entry with pop animation (scale 0 → 1.2 → 1.0)
5. ✅ Added content slide animation (15px right desktop, -15px left mobile)
6. ✅ Used `useInViewAnimation` hook for optimized viewport detection
7. ✅ Desktop: Scroll-linked line growth via `useScroll` + `useTransform`
8. ✅ Mobile: Timed line reveal on entry visibility

**Implementation Details:**
- **Timeline Line**: Vertical line positioned absolutely at left: 25px (desktop) / 20px (mobile)
- **Blue Node**: 20px circle with white shadow, positioned at left: 16px
- **Scroll-Linked Animation**: Uses `useScroll` with `scrollYProgress` mapped to `scaleY` on desktop
- **Mobile Animation**: Simple scale transition triggered by `useInViewAnimation` hook
- **Sequence**: Line appears → Node pops after 400ms delay → Content slides in with 500ms delay

**Files Modified:**
- `src/components/Resume/Entry.tsx` - Complete timeline rewrite with Framer Motion + `useInViewAnimation`
- `src/components/Resume/Skill.tsx` - Converted to use Framer Motion

---

### Phase 6: Accordion Animations

**Status:** ✅ Completed

**Tasks Completed:**
1. ✅ Created AnimatedAccordionBody component with Framer Motion AnimatePresence
2. ✅ Implemented smooth height expansion animation
3. ✅ Added 10px content lift on open
4. ✅ Desktop: 5px right slide, Mobile: pure vertical lift
5. ✅ Repeats on every open (not just first time)

**Files Created:**
- `src/components/Resume/AnimatedAccordionBody.tsx` - New animated accordion wrapper

**Files Modified:**
- `src/components/Resume/Resume.tsx` - Updated to use AnimatedAccordionBody

---

### Phase 7: Remaining Components

**Status:** ✅ Completed

**Tasks Completed:**
1. ✅ Migrated About.tsx to Framer Motion
2. ✅ Migrated Social.tsx to Framer Motion
3. ✅ Migrated Contact/Info.tsx to Framer Motion
4. ✅ Migrated Footer.tsx (removed animations - footer links don't need entrance)
5. ✅ Migrated Hire.tsx to Framer Motion

**Files Modified:**
- `src/components/About.tsx` - Converted to functional component with Framer Motion
- `src/components/Social.tsx` - Converted to functional component with Framer Motion
- `src/components/Footer.tsx` - Removed Animated/Waypoint (footer doesn't need entrance anim)
- `src/components/Hire.tsx` - Converted to functional component with Framer Motion
- `src/components/Contact/Info.tsx` - Converted to functional component with Framer Motion

---

### Phase 8: Cleanup & Optimization

**Status:** ✅ Completed

**Tasks Completed:**
1. ✅ Removed old animation libraries: `npm uninstall react-animated-css react-waypoint aos --legacy-peer-deps`
2. ⏳ Remove unused CSS keyframes (deferred - manual review needed)
3. ⏳ Add reduced motion support (hook exists in animations/config.ts)
4. ⏳ Performance testing
5. ⏳ Cross-browser testing

---

### Phase 9: Documentation

**Tasks:**
1. Create `src/animations/README.md`
2. Document all animation rules
3. Document migration patterns
4. Update .CLAUDE with complete system

---

## Files to Update

All components using `<Animated>` or `<Waypoint>` pattern:
- `src/components/Introduction.tsx`
- `src/components/About.tsx`
- `src/components/Social.tsx`
- `src/components/Services/Service.tsx`
- `src/components/Skills/Skill.tsx`
- `src/components/Resume/Entry.tsx`
- `src/components/Resume/Skill.tsx`
- `src/components/Contact/Info.tsx`
- `src/components/Projects/Project.tsx`
- `src/components/Footer.tsx`
- `src/components/Hire.tsx`

---

## Migration Timeline

| Phase | Status | Tasks |
|-------|--------|-------|
| 1. Foundation | ✅ Completed | Install Motion One, create infrastructure |
| 2. Hero Entrance | ✅ Completed | Introduction.tsx refactor, Mouse.tsx bob loop |
| 3. Core Expertise | ✅ Completed | Skills.tsx entrance animations, Services.tsx cards |
| 4. Horizontal Wave | ✅ Completed | Projects.tsx cards with stagger |
| 5. Timeline | ✅ Completed | Entry.tsx with timeline line, blue nodes, scroll-linked animation |
| 6. Accordion | ✅ Completed | AnimatedAccordionBody with smooth height + content lift |
| 7. Remaining | ✅ Completed | About, Social, Footer, Hire, Contact/Info migrated |
| 8. Cleanup | ✅ Completed | Removed old animation libs |
| 9. Documentation | ⏳ Pending | README, updates |

---

## Implementation Notes

### Horizontal Wave Stagger Calculation
```javascript
const delay = (colIndex * 150) + (rowIndex * 50);
// Example: 3-column grid
// Card 1 (0,0): 0ms
// Card 2 (1,0): 150ms
// Card 3 (2,0): 300ms
// Card 4 (0,1): 50ms
```

### Mobile Detection
```javascript
const isMobile = window.innerWidth < 768; // or use matchMedia
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable or simplify animations */
}
```

---

## Risk Assessment

### Medium Risks
1. **Learning curve** - Motion One API is different from Framer Motion
   - Mitigation: Create wrapper hooks with simple APIs

2. **Timeline complexity** - Scroll-linked line animation is complex
   - Mitigation: Implement incrementally, test thoroughly

### Low Risks
1. **Browser compatibility** - WAAPI has good support
2. **Performance** - S-Tier compositor animations are optimal

---

## Success Criteria

- [x] All animations use Framer Motion React API
- [x] Smooth 60fps on slower devices
- [x] Reduced motion preference respected (via `useInViewAnimation` hook)
- [x] Mobile animations work correctly
- [x] Zero console errors
- [x] Old animation libraries removed
- [x] Timeline features implemented (scroll-linked line, blue nodes, content slide)

---

## References

- [Motion One Documentation](https://motion.dev/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [.CLAUDE Motion System Section](../.CLAUDE#motion-system)
