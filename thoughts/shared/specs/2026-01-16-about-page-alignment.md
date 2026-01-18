# About Page Text Alignment Specification

## Executive Summary
Align the About page text sections (bio, "At a Glance" icons, and Consultant section) to create a consistent vertical alignment axis that centers on the navbar brand's decorative circle.

## Problem Statement
The About page currently has misaligned text sections:
- The bio Description text, activity icons, and Consultant section all have different left edges
- The negative margins used for alignment are fragile and inconsistent across breakpoints
- Icons don't scale appropriately for mobile

## Success Criteria
- [x] Activity icons (50px desktop, 40px mobile) center-align vertically with the navbar brand circle
- [x] Bio text left edge aligns with left edge of activity icons
- [x] Consultant section's left blue border aligns with left edge of activity icons
- [x] Alignment is consistent on desktop (>= 768px) and mobile (< 768px)
- [x] No visual regression in other parts of the About page

**Status: IMPLEMENTED AND VERIFIED** (2026-01-16)

## Technical Design

### Alignment Model
The alignment creates a vertical axis:

```
Header:
┌─────────────────────────────────────────────┐
│  [●]Casey Key                               │  ← 40px blue circle
└─────────────────────────────────────────────┘
                  ↓ (center-aligned)
About Section:
┌─────────────────────────────────────────────┐
│  [●] Activity description text              │  ← 50px icon (desktop), 40px (mobile)
│  [●] Activity description text              │
│  [●] Activity description text              │
│  Bio paragraph text aligned to icon edge    │
│  ┃ Consultant section with border           │  ← Left border at icon edge
└─────────────────────────────────────────────┘
```

### Key Elements

| Element | Desktop Size | Mobile Size | Alignment |
|---------|--------------|-------------|-----------|
| Header circle | 40px | 40px | Reference point |
| Activity icons | 50px | 40px | Center to header circle |
| Bio text | - | - | Left edge to icon left edge |
| Consultant border | 4px | 4px | Left edge to icon left edge |

### Implementation Approach

Since both the navbar and About section use Bootstrap's Container, alignment will be relative to the container edge. The navbar brand circle is positioned at `left: -11px` relative to the brand text.

**Recommended approach:** Use CSS custom properties to define the alignment offset, then apply consistently across all elements.

### Files to Modify

1. `src/components/About/style.ts`
   - Add responsive icon sizing (50px desktop, 40px mobile)
   - Align `Description` left edge with icon left edge
   - Align `ConsultantIdentity` border with icon left edge
   - Remove negative margin hacks in favor of consistent alignment

2. `src/components/About.tsx`
   - May need minor structural changes to support alignment

### Responsive Breakpoints

- Desktop: >= 768px (md breakpoint)
- Mobile: < 768px

### Edge Cases

- Very small screens (< 375px): Icons should not shrink below 40px
- Tablet portrait (768px-1024px): Maintain consistent alignment with header

## Out of Scope
- Navbar brand styling changes
- About page content changes
- Image/headshot positioning
- Animation timing changes

## Acceptance Tests

1. **Desktop alignment**: On a 1920x1080 viewport, the activity icons should visually center-align with the navbar brand circle
2. **Mobile alignment**: On a 375x667 viewport (iPhone SE), icons scale to 40px and maintain alignment
3. **Text alignment**: Bio text and Consultant border left edges align with activity icon left edges
4. **Responsive transition**: Resizing from mobile to desktop shows smooth alignment without jumps
