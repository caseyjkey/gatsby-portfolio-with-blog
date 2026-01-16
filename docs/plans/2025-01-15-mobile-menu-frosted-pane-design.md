# Mobile Menu "Full-Screen Frosted Pane" Design

**Date:** 2025-01-15
**Status:** Approved

## Overview

Refactor the mobile menu to use a clean, premium "frosted pane" aesthetic by removing colored link backgrounds, adding a semi-transparent white backdrop, and upgrading animations to use the Framer Motion system.

## Goals

1. Remove blue backgrounds and drop shadows from mobile navigation links
2. Add semi-transparent white background (0.7 opacity) to mobile drawer
3. Increase header blur to 40px when mobile menu is open
4. Add white background (0.7 opacity) to header when scrolled
5. Implement fade-and-slide-up animations using Framer Motion with values from `src/animations`

## Changes Required

### File: `src/components/Navigation/NavStyles.tsx`

#### 1. Update `GLASS_OPACITY` Constant
```javascript
const GLASS_OPACITY = 0.7; // Changed from 0.88
```

#### 2. StyledNav Component Updates

**Background with `!important` to override Bootstrap:**
```javascript
background-color: ${props => {
  if (!props.$isVisible) return 'transparent'
  if (props.$menuOpen || props.$scrolled) return `rgba(255, 255, 255, ${GLASS_OPACITY}) !important`
  return 'transparent'
}} !important;
```

**Blur with menu-open state:**
- Scrolled only: `blur(16px)`
- Menu open: `blur(40px)`
```javascript
backdrop-filter: ${props => {
  if (!props.$isVisible) return 'none'
  if (props.$menuOpen) return 'blur(40px)'
  if (props.$scrolled) return 'blur(16px)'
  return 'none'
}};
```

**Add to transition property:**
- Ensure `backdrop-filter` is included for smooth blur transitions

#### 3. StyledCollapse Component Updates

**Add background to drawer:**
```javascript
background: rgba(255, 255, 255, ${GLASS_OPACITY}) !important;
```

**Remove from `.nav-link`:**
- `background: rgba(62, 100, 255, 0.35)`
- `border-radius: 12px`
- `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)`
- `text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15)`
- Background changes on `&:hover`
- Background changes on `&.active`, `&.current-page`, etc.
- Background changes on `&.manual-active`

**Keep in `.nav-link`:**
- Dimensions: `width: 280px`, `height: 72px`
- Typography: `font-size: 1.8rem`, `font-weight: 900`, `letter-spacing: 0.1em`
- Center alignment (flex)

**Simplified hover/active:**
```javascript
&:hover {
  color: ${PRIMARY_COLOR} !important;
}

&.active,
&.current-page,
&.react-scroll-active,
&[aria-current="page"] {
  color: ${PRIMARY_COLOR} !important;
  > span {
    text-decoration: underline !important;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
    text-decoration-color: ${PRIMARY_COLOR} !important;
  }
}

&.manual-active {
  color: ${PRIMARY_COLOR} !important;
}
```

**Remove CSS transitions from `.nav-item`:**
- Delete `nth-child` stagger delay rules
- Delete `opacity` and `transform` transitions

### File: `src/components/Navigation/Nav.tsx`

#### 1. Add Imports
```javascript
import { motion } from 'motion/react';
import { fadeInUpVariants, MOBILE_VERTICAL_STACK } from '../animations';
import { useIsMobile } from '../animations/hooks/useReducedMotion'; // or wherever it's exported
```

#### 2. In `Scroll` and `TradLink` Components

Add mobile detection and conditional rendering:

```javascript
const isMobile = useIsMobile();
const shouldAnimate = !collapsed && isMobile;
```

Wrap return in conditional for motion.li vs regular li:

```javascript
return isMobile ? (
  <motion.li
    className="nav-item"
    variants={fadeInUpVariants}
    initial={collapsed ? 'hidden' : 'visible'}
    animate={!collapsed ? 'visible' : 'hidden'}
    custom={{
      delay: navIndex * MOBILE_VERTICAL_STACK.stagger / 1000,
      distance: MOBILE_VERTICAL_STACK.distance
    }}
  >
    {/* existing link JSX */}
  </motion.li>
) : (
  <li className="nav-item">
    {/* existing link JSX */}
  </li>
);
```

## Animation Specs

| Property | Value | Source |
|----------|-------|--------|
| Distance | 20px | `MOBILE_VERTICAL_STACK.distance` |
| Stagger | 100ms | `MOBILE_VERTICAL_STACK.stagger` |
| Duration | 800ms | `fadeInUpVariants` default |
| Easing | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `ANIMATION_CONFIG.easing` |
| Delays | 0, 0.1s, 0.2s, 0.3s, 0.4s, 0.5s | Calculated per index |

## Testing Checklist

- [ ] Header transparent at top, white background (0.7) + blur when scrolled
- [ ] Menu open triggers 40px blur on header
- [ ] Drawer has 0.7 white background
- [ ] Links fade and slide up from 20px below
- [ ] Proper stagger between each link (100ms)
- [ ] No blue backgrounds or shadows on mobile links
- [ ] Hover changes color to blue only
- [ ] Active page shows blue + underline
- [ ] Desktop nav unchanged
- [ ] Body scroll locked when menu open
- [ ] Menu closes after link click (150ms delay)
- [ ] Reduced motion preference respected

## Browser Compatibility

- Chrome/Edge: Full `backdrop-filter` support
- Safari: `-webkit-backdrop-filter` included
- Firefox: Supported in recent versions
