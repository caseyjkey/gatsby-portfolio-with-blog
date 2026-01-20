# Project Carousel Cross-Fade Transition Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current scale-based carousel transition with a smooth cross-fade that syncs foreground image opacity with ambient blur backdrop opacity.

**Architecture:**
- Change from `AnimatePresence mode="wait"` (sequential) to `mode="sync"` (overlapping) with absolute stacking
- Move `ModalBackdrop` inside each slide component so both foreground and backdrop fade together
- Use z-index to ensure incoming slide renders above outgoing slide
- Update shadow style and ensure it fades with image opacity

**Tech Stack:**
- Framer Motion (`motion` from `motion/react`)
- Styled Components for CSS
- TypeScript

---

## Task 1: Update CSS for Cross-Fade Stack Layout

**Files:**
- Modify: `src/components/Projects/style.ts`

**Step 1: Add slide stacking styles to CarouselGlobalStyles**

Add these CSS rules to `CarouselGlobalStyles` to enable absolute stacking of slides:

```typescript
// Add after line 185 (after full-bleed padding hack style)

/* Cross-fade slide stacking - all slides absolutely positioned on top of each other */
.project-modal-carousel {
  position: relative !important;
}

.project-modal-carousel .slide {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

/* Update shadow to match spec: drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] */
.project-modal-carousel .floating-image-container {
  box-shadow: 0 35px 35px rgba(0, 0, 0, 0.6) !important;
}

/* Remove old backdrop styles - will be handled per-slide now */
```

**Step 2: Verify CSS syntax**

Check that the file compiles: `npm run dev` should start without CSS errors.

**Step 3: Commit**

```bash
git add src/components/Projects/style.ts
git commit -m "style: add slide stacking styles for cross-fade transition"
```

---

## Task 2: Refactor Carousel Component Structure for Cross-Fade

**Files:**
- Modify: `src/components/Projects/Project.tsx`

**Step 1: Change AnimatePresence from wait mode to sync mode**

Find line 250 and change:

```typescript
// OLD:
<AnimatePresence mode="wait" initial={false}>

// NEW:
<AnimatePresence mode="sync" initial={false}>
```

**Step 2: Remove scale animations, keep only opacity**

Find lines 254-257 and change:

```typescript
// OLD:
initial={{ opacity: 0, scale: 0.98 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 1.02 }}
transition={{ duration: 0.4, ease: "easeInOut" }}

// NEW:
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.5, ease: "easeInOut" }}
```

**Step 3: Remove positioning styles from slide div (now handled by CSS)**

Find line 258 and remove the inline styles that are now in CSS:

```typescript
// OLD:
style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}

// NEW (keep for flex centering, remove width/height):
style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
```

**Step 4: Test basic cross-fade**

Run dev server, open a project modal, navigate between images.
Expected: Images should now cross-fade (stack and overlap) instead of scale transition.

**Step 5: Commit**

```bash
git add src/components/Projects/Project.tsx
git commit -m "refactor: change carousel to cross-fade transition with sync mode"
```

---

## Task 3: Move Backdrop Inside Each Slide for Synced Fade

**Files:**
- Modify: `src/components/Projects/Project.tsx`

**Step 1: Remove standalone backdrop element**

Find and remove lines 245-246:

```typescript
// REMOVE THESE LINES:
<ModalBackdrop $backdropImage={images[photoIndex]} $hidden={isCurrentFullBleed} />
```

**Step 2: Add backdrop inside each slide**

Find the slide div (around line 251) and restructure to include backdrop as sibling:

```typescript
<motion.div
  key={photoIndex}
  className="slide"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  onClick={() => toggleLightbox()}
>
  {/* Backdrop - fades with slide, hidden for full-bleed */}
  {!fullBleedIndices[photoIndex] && (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${images[photoIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(2px)',
        zIndex: 0,
      }}
    />
  )}

  {/* Foreground image */}
  <div className={fullBleedIndices[photoIndex] ? 'full-bleed' : ''} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
    {renderCurrentImage()}
  </div>
</motion.div>
```

**Step 3: Test synced fade**

Open project modal, navigate between floating (non-full-bleed) images.
Expected: Both the blurred backdrop AND the foreground image fade in/out together.

**Step 4: Test full-bleed images**

Navigate to a full-bleed (16:9) image.
Expected: No backdrop should appear (only the full-bleed image).

**Step 5: Commit**

```bash
git add src/components/Projects/Project.tsx
git commit -m "refactor: move backdrop inside slide for synced opacity fade"
```

---

## Task 4: Add Z-Index Management for Incoming Slide

**Files:**
- Modify: `src/components/Projects/Project.tsx`

**Step 1: Add z-index to incoming slide**

Update the slide motion.div to include dynamic z-index based on navigation direction:

Find the slide motion.div and add `style={{ zIndex: photoIndex === previousIndex ? 1 : 0 }}` or similar.

Actually, Framer Motion's sync mode handles this automatically, but we need to ensure the latest slide is on top. Add to the slide style:

```typescript
<motion.div
  key={photoIndex}
  className="slide"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1, zIndex: 1 }}
  exit={{ opacity: 0, zIndex: 0 }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Ensure higher key (newer slide) has higher z-index
    zIndex: photoIndex
  }}
  onClick={() => toggleLightbox()}
>
```

**Step 2: Verify layering during transition**

Open modal, watch closely during navigation.
Expected: New image should appear on top of old image during cross-fade.

**Step 3: Commit**

```bash
git add src/components/Projects/Project.tsx
git commit -m "feat: add z-index management for proper slide layering"
```

---

## Task 5: Update Shadow Style and Ensure Proper Fading

**Files:**
- Modify: `src/components/Projects/style.ts`

**Step 1: Update floating image container shadow**

The shadow was already updated in Task 1, but verify it matches spec:

```css
/* Should be: */
box-shadow: 0 35px 35px rgba(0, 0, 0, 0.6) !important;
```

**Step 2: Ensure shadow opacity fades with image**

Add opacity transition to the floating container:

```css
.project-modal-carousel .floating-image-container {
  /* ... existing styles ... */
  box-shadow: 0 35px 35px rgba(0, 0, 0, 0.6) !important;
  transition: opacity 0.5s ease-in-out !important;
}
```

**Step 3: Test shadow fade**

Navigate between floating images (non-full-bleed).
Expected: Shadow should fade out smoothly with the image, not leave a "ghost shadow" on the background.

**Step 4: Verify full-bleed images have no shadow**

Check full-bleed images (16:9).
Expected: No shadow should be visible (CSS already handles this with `box-shadow: none !important`).

**Step 5: Final cleanup - remove unused ModalBackdrop component**

Since we're now handling backdrop inline, the `ModalBackdrop` styled component is unused. You can leave it for now (no harm), or remove it in a future cleanup.

**Step 6: Final commit**

```bash
git add src/components/Projects/style.ts
git commit -m "style: ensure shadow fades properly with image opacity"
```

---

## Task 6: Testing and Verification

**Files:**
- Test: Manual testing in browser

**Step 1: Test cross-fade on floating images**

1. Open any project with multiple gallery images
2. Navigate using arrows
3. Verify: Smooth cross-fade, backdrop and foreground sync, shadow fades

**Step 2: Test full-bleed images**

1. Navigate to a 16:9 full-bleed image
2. Verify: No backdrop appears, clean cross-fade

**Step 3: Test all navigation methods**

- Left/Right arrow buttons
- Click on indicator dots
- Keyboard navigation (arrow keys)
- Swipe if touch enabled

**Step 4: Test edge cases**

- First to last image (wraparound)
- Last to first image
- Rapid clicking through images
- Opening/closing modal

**Step 5: Check console for errors**

Open browser DevTools Console.
Expected: No errors, no warnings

**Step 6: Final verification commit**

If all tests pass:

```bash
git add .
git commit -m "test: verify cross-fade transition works correctly"
```

---

## Task 7: Documentation Update

**Files:**
- Create: None (no new docs needed, this is internal refactoring)

**Step 1: Update inline comments**

Add helpful comments in `Project.tsx` explaining the cross-fade approach for future developers.

**Step 2: Commit documentation**

```bash
git add src/components/Projects/Project.tsx
git commit -m "docs: add comments explaining cross-fade implementation"
```

---

## Summary

This plan converts the carousel from a scale-based sequential transition to a cross-fade overlapping transition:

| Aspect | Before | After |
|--------|--------|-------|
| Mode | `wait` (sequential) | `sync` (overlapping) |
| Positioning | Static/relative | Absolute stacking |
| Animation | Scale + Opacity | Opacity only |
| Duration | 0.4s easeInOut | 0.5s easeInOut |
| Backdrop | Separate component, fixed | Per-slide, synced fade |
| Shadow | `0 25px 50px -12px` | `0 35px 35px rgba(0,0,0,0.6)` |
| Z-Index | Not needed | Managed by slide index |

Total estimated time: 30-45 minutes
