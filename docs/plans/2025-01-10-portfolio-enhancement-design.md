# Portfolio Enhancement Design Document

**Date:** 2025-01-10
**Author:** Claude (with Casey Key)
**Status:** Design Approved

## Overview

Expand the landing page to better sell Casey Key as a consultant and senior engineer. This redesign adds an Experience timeline and Featured Work section, updates copy to emphasize consulting identity, and modernizes the project card styling across the site.

## Goals

1. **Strengthen consultant identity** - Emphasize problem-solving approach and technical leadership
2. **Showcase professional journey** - Vertical experience timeline on homepage
3. **Highlight best work** - Featured Work section with 3 key projects
4. **Improve navigation** - Smart navbar and improved scroll behavior
5. **Modernize project cards** - Editorial card style (no blue overlay)

---

## 1. Experience Data Structure (NEW)

**File:** `src/data/experience.ts`

Create a single source of truth for experience data:

```typescript
export interface ExperienceEntry {
  id: string;
  date: string;
  title: string;
  company: string;
  location: string;
  bullets: string[];
}

export const experienceData: ExperienceEntry[] = [
  // Oracle, Amazon, Capital One, Bongo, AWS, Oracle (2019), CSU, Northrop Grumman
];
```

**Benefits:**
- Single source of truth for Resume page and Experience timeline
- TypeScript types prevent errors
- Easy to maintain and update

---

## 2. Experience Timeline Component (NEW)

**File:** `src/components/Experience/index.tsx`

**Layout:**
```
2024 ● Oracle — Redwood City, CA
      Applications Developer
      • Built and launched a scalable release management tool supporting 13,780 users
      • Mentored new developers, facilitating knowledge transfer...
      • Implemented AI‑powered automation to optimize DevOps workflows...
```

**Visual design:**
- Vertical black line connecting all dots (theme.black for dark mode compatibility)
- Year: Right-aligned, 60px column, font-weight 600
- Dot: 2.5rem circle, primaryColor, vertically centered
- Company: Heavy font (700), 1.5rem
- Location: Light font (300), lighter color
- Title: Medium font (500), 1.1rem
- Bullets: Primary color bullet points

**Styling cohesion:**
- Matches Skills section styling (section padding, background colors)
- Uses theme variables for future dark mode support

---

## 3. Featured Work Component (NEW)

**File:** `src/components/FeaturedWork/index.tsx`

**Featured projects:**
1. Amazon.com Data Catalog - Enterprise React/Java scale
2. Oracle Release Management - Python/Django, 13,780 users
3. Yelp Shops - Full-stack iOS/Web

**Editorial card style:**
- No blue overlay - image always visible
- White card area below image for content
- Subtle shadow on base: `0 2px 8px rgba(0,0,0,0.08)`
- Stronger shadow on hover: `0 12px 24px rgba(0,0,0,0.15)`
- Lift animation on hover: `translateY(-4px)`

**Typography:**
- Title: 1.5rem (24px), font-weight 700, high contrast
- Subtitle: 1rem, font-weight 500, primaryColor
- Description: 0.95rem, line-clamp: 3 lines

**Grid:**
- 3 columns on desktop
- Collapses to single column on mobile
- Gap: 2rem

**Background:**
- `lighten(0.31, primaryColor)` - matches Skills section

---

## 4. Smart Navigation (UPDATE)

**Files:** `src/components/Navigation/`, `src/components/Navigation/Hamburger.tsx`

**Behavior:**
- Navbar hides on scroll down (maximize content viewing)
- Navbar reappears on scroll up (easy navigation access)
- Smooth transition: 0.3s ease-in-out

**Implementation:**
```typescript
const useScrollDirection = () => {
  // Returns 'up' or 'down' based on scroll direction
  // 10px threshold to prevent jitter
};

const NavbarWrapper = styled.nav<{ $visible: boolean }>`
  transform: translateY(${props => props.$visible ? '0' : '-100%'});
  transition: transform 0.3s ease-in-out;
`;
```

---

## 5. Hero Button & Scroll Fixes (UPDATE)

**Files:**
- `src/components/Introduction.tsx`
- `src/components/Introduction/Mouse.tsx`

**Hero button:**
- Text: "Resume" → "View Experience"
- Action: Smooth scroll to Experience section
- Offset: 40px (account for navbar)

**Mouse component (scroll arrow):**
- Increase clickable area on mobile: 70px → 100px
- Fix scroll target: Skills section
- Fix scroll offset: -80px (negative for navbar clearance)

---

## 6. About Page Copy Update (UPDATE)

**File:** CMS content (not code)

**Direction:**
- Emphasize "Consultant" identity
- Focus on problem-solving approach
- Discuss technical leadership philosophy
- Highlight adaptability, strategic thinking, results-driven mindset

**Example structure:**
```
"As a technical consultant and senior engineer, I help organizations
solve complex problems through pragmatic architecture and hands-on
leadership..."
```

---

## 7. Contact Page Header Update (UPDATE)

**File:** `src/components/Contact.tsx`

**New header:**
- Large background text: "Contact"
- Main heading: "Contact Me" → "Start a Conversation"
- Sub-heading note: "Available for architectural consulting and senior engineering lead roles."

**Styling:**
- Follows existing pattern: `big big-2` → `h2` → note
- Note color: primaryColor
- Note weight: 500

---

## 8. Projects Page Editorial Cards (UPDATE)

**File:** `src/pages/projects.tsx`, `src/components/Projects/Project.tsx`

**Changes:**
1. Remove blue overlay entirely
2. Add shadow to base state: `0 2px 8px rgba(0,0,0,0.08)`
3. Title size: 1.5rem (24px) for clear hierarchy
4. Hover effect: lift + stronger shadow
5. Image always visible, no overlay

**Matches Featured Work styling for consistency.**

---

## 9. Landing Page Structure (UPDATE)

**File:** `src/pages/index.tsx`

**Final section order:**
1. Navigation (smart, hides on scroll down)
2. Introduction (Hero) - "View Experience" button
3. Skills ("What I Do") - Mouse arrow scrolls here
4. **Experience** (NEW) - Vertical timeline
5. **Featured Work** (NEW) - 3 projects
6. Footer

**Flow narrative:**
- Who I am (Hero)
- What I can do (Skills)
- Where I've worked (Experience)
- What I've built (Featured Work)

---

## Summary of Files to Create/Modify

### New Files:
- `src/data/experience.ts` - Experience data source
- `src/components/Experience/index.tsx` - Timeline component
- `src/components/FeaturedWork/index.tsx` - Featured projects grid

### Modified Files:
- `src/pages/index.tsx` - Add Experience + FeaturedWork sections
- `src/components/Introduction.tsx` - Update button text and scroll
- `src/components/Introduction/Mouse.tsx` - Fix scroll and clickable area
- `src/components/Navigation/index.tsx` - Add smart scroll behavior
- `src/components/Contact.tsx` - Update header text
- `src/pages/projects.tsx` - Update project card styling
- `src/components/Resume/Resume.tsx` - Import from experience.ts

---

## Technical Considerations

### Dark Mode Support
- Use `theme.black` for connecting line (not hardcoded black)
- All colors use theme variables
- Shadows work on both light and dark backgrounds

### Responsive Design
- Timeline collapses on mobile (year above content)
- Featured work grid: 3 cols → 2 cols → 1 col
- Mouse clickable area: 100px on mobile

### Performance
- Existing Gatsby image optimization maintained
- CSS transitions for smooth animations
- No additional library dependencies

### Accessibility
- Semantic HTML (section, h1-h3, ul/li)
- Focus states on interactive elements
- ARIA labels where needed

---

## Success Criteria

- [ ] Experience timeline displays all work history with proper styling
- [ ] Featured Work section showcases 3 selected projects
- [ ] Smart navbar hides/reappears on scroll
- [ ] Hero button "View Experience" scrolls correctly
- [ ] Mouse arrow scrolls to Skills with proper offset
- [ ] Project cards have no blue overlay, clean editorial style
- [ ] About copy emphasizes consultant identity
- [ ] Contact header says "Start a Conversation"
- [ ] All sections cohesive with existing Skills styling
- [ ] Mobile responsive, no layout issues
