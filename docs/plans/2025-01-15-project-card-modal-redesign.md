# Project Card & Modal Redesign - Implementation Plan

**Date**: 2025-01-15
**Status**: Draft
**Priority**: High

## Overview

Refine the Project card component and modal to create a more polished, hierarchical UI with better visual separation and consistency between the card and modal states.

## Requirements Summary

### 1. Project Card Refinement

| Element | Specification |
|---------|---------------|
| **Image Border** | Add `border-slate-100` equivalent light-gray border around image container |
| **Layout** | Maintain "Image Top / Text Bottom" split for seamless zoom-in UX |

### 2. Modal Carousel (The Stage)

| Element | Specification |
|---------|---------------|
| **Container** | `aspect-video` with `max-h-[70vh]` |
| **Backdrop** | Absolute positioned, **same image as foreground**, `object-cover`, `blur-3xl`, `opacity-30` |
| **Foreground Image** | Centered, `object-contain`, `drop-shadow-2xl`, `border-white/10` |

**Important**: The backdrop image must be the same as the currently displayed carousel image. When the user changes slides, the backdrop should update to match the new image.

### 3. Meta-Header Alignment

| Element | Specification |
|---------|---------------|
| **Container** | Flex with `justify-between`, `items-center` |
| **Left** | Category/Position Title |
| **Right** | Tech Icons |
| **Behavior** | Dynamic vertical centering when content wraps |

### 4. Footer & Button Hierarchy

| Element | Specification |
|---------|---------------|
| **Divider** | `border-t border-slate-100` above buttons |
| **Alignment** | All buttons grouped to the right |

#### Button Tiers

| Tier | Style | Use Case |
|------|-------|----------|
| **Primary** | Solid Blue (`PrimaryButton`) | "View Project" |
| **Secondary** | Blue Ghost (border only) | "Read Post" (even if only button) |
| **Tertiary** | Text-only with GitHub icon | "Source Code" |

### 5. Image Framing Rules

| Context | Border Style |
|---------|--------------|
| **Gallery Cards** | `border-slate-100` (light gray) |
| **Modal Images** | `border-white/20` + `drop-shadow-2xl` (floating effect) |

---

## Implementation Plan

### Phase 1: Create New Button Variants

**File**: `src/components/style.ts`

1. Create `GhostButton` component for secondary "Read Post" button:
   ```tsx
   // Ghost button with border only, transparent background
   export const GhostButton = styled(BootstrapButton)`
     background-color: transparent !important;
     border-color: ${props => props.theme.primaryColor} !important;
     color: ${props => props.theme.primaryColor} !important;
     // ... hover states with solid primary background
   `;
   ```

2. Create `TextIconButton` component for tertiary "Source Code" button:
   ```tsx
   // Text-only button with icon
   export const TextIconButton = styled.button`
     background: none;
     border: none;
     color: ${props => props.theme.darken};
     // ... hover state with underline
   `;
   ```

### Phase 2: Update Project Component Styles

**File**: `src/components/Projects/style.ts`

1. Add `GalleryFrame` border:
   ```tsx
   export const GalleryFrame = styled.div`
     border: 1px solid #f1f5f9; // border-slate-100 equivalent
     /* existing styles */
   `;
   ```

2. Add modal backdrop styles:
   ```tsx
   export const ModalBackdrop = styled.div`
     position: absolute;
     inset: 0;
     background-image: url(${props => props.$backdropImage});
     background-size: cover;
     background-position: center;
     filter: blur(40px);
     opacity: 0.3;
     z-index: 0;
   `;

   export const ModalImageContainer = styled.div`
     position: relative;
     aspect-ratio: 16 / 9;
     max-height: 70vh;
     display: flex;
     align-items: center;
     justify-content: center;
     z-index: 1;
   `;

   export const ModalImage = styled.img`
     max-width: 100%;
     max-height: 70vh;
     object-fit: contain;
     box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
     border: 1px solid rgba(255, 255, 255, 0.2);
   `;
   ```

3. Add meta-header styles:
   ```tsx
   export const ModalMetaHeader = styled.div`
     display: flex;
     justify-content: space-between;
     align-items: center;
     flex-wrap: wrap;
     gap: 1rem;
   `;

   export const MetaTitle = styled.h4`
     font-size: 1rem;
     font-weight: 600;
     color: ${props => props.theme.darken};
   `;

   export const MetaIcons = styled.ul`
     display: flex;
     flex-wrap: wrap;
     gap: 0.5rem;
     list-style: none;
     margin: 0;
     padding: 0;
   `;
   ```

4. Add footer divider:
   ```tsx
   export const ModalFooterDivider = styled.div`
     border-top: 1px solid #f1f5f9; // border-slate-100 equivalent
     margin: 1rem 0 0 0;
     padding-top: 1rem;
   `;
   ```

### Phase 3: Update Project Component JSX

**File**: `src/components/Projects/Project.tsx`

1. Update imports to include new components

2. Refactor modal body structure:
   ```tsx
   <ModalBody>
     {/* Backdrop + Image Container */}
     <ModalImageContainer>
       {/* Backdrop uses current carousel image - updates on slide change */}
       <ModalBackdrop $backdropImage={images[photoIndex]} />
       <Carousel
         onChange={(index: number) => {
           setPhotoIndex(index); // This updates both the carousel AND backdrop
         }}
         selectedItem={photoIndex}
       >
         {carouselImages.map((image, index) => (
           <div key={index}>{image}</div>
         ))}
       </Carousel>
     </ModalImageContainer>

     {/* Meta Header with aligned title/icons */}
     <ModalMetaHeader>
       <MetaTitle>{subtitle}</MetaTitle>
       <MetaIcons>
         {icons.map((Icon, i) => <li key={i}><Icon size={21} /></li>)}
       </MetaIcons>
     </ModalMetaHeader>

     {/* Description with read-more */}
     <ReadMoreColor>
       <ReactReadMoreReadLess>
         {children.props.dangerouslySetInnerHTML.__html}
       </ReactReadMoreReadLess>
     </ReadMoreColor>
   </ModalBody>
   ```

3. Update modal footer with button hierarchy:
   ```tsx
   <ModalFooter>
     <ModalFooterDivider>
       <div className="d-flex justify-content-between align-items-center">
         <div className="date small">{date}</div>
         <div className="d-flex gap-2">
           {/* Tertiary: Source Code */}
           {sourceLink && (
             <TextIconButton href={sourceLink} target="_blank">
               <GitHubIcon size={16} /> Source
             </TextIconButton>
           )}
           {/* Secondary: Read Post - always ghost style */}
           {postLink && (
             <GhostButton href={postLink}>Read post</GhostButton>
           )}
           {/* Primary: View Project - always solid */}
           {link && (
             <PrimaryButton href={link} target="_blank">View project</PrimaryButton>
           )}
         </div>
       </div>
     </ModalFooterDivider>
   </ModalFooter>
   ```

### Phase 4: Update Project Data Structure

**File**: `src/components/Projects/Project.tsx`

Add optional `sourceLink` field to the `ProjectProps` interface:
```tsx
interface ProjectProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  image: IGatsbyImageData;
  galleryImages: GalleryImage[];
  icons: IconType[];
  link?: string;        // Optional: Project demo URL
  postLink?: string;    // Optional: Blog post URL
  sourceLink?: string;  // Optional: GitHub repository URL (NEW - optional for backward compatibility)
  date: string;
  [key: string]: any;
}
```

**Important**: The `sourceLink` field is **optional** (`sourceLink?: string`) to ensure existing project data continues to work without modification. Only add `sourceLink` to projects that have a public repository.

### Phase 5: Responsive Adjustments

**File**: `src/components/Projects/style.ts`

Add mobile-specific styles for meta-header:
```tsx
@media (max-width: 767.98px) {
  ${ModalMetaHeader} {
    flex-direction: column;
    align-items: flex-start;
  }

  ${MetaIcons} {
    width: 100%;
  }

  ${ModalImageContainer} {
    max-height: 50vh;
  }
}
```

---

## Color Tokens (Tailwind → Custom Theme)

| Tailwind Token | Custom Theme Value |
|----------------|-------------------|
| `border-slate-100` | `#f1f5f9` |
| `border-white/10` | `rgba(255, 255, 255, 0.1)` |
| `border-white/20` | `rgba(255, 255, 255, 0.2)` |
| `drop-shadow-2xl` | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` |
| `blur-3xl` | `filter: blur(40px)` |

---

## Testing Checklist

- [ ] Gallery cards have light-gray border on images
- [ ] Modal images float over blurred backdrop
- [ ] Modal backdrop updates dynamically when changing carousel slides
- [ ] Modal images have subtle white border and shadow
- [ ] Meta header aligns title (left) and icons (right) with vertical centering
- [ ] Buttons use correct hierarchy (solid, ghost, text-only)
- [ ] Footer divider appears above button row
- [ ] Buttons grouped to right side of footer
- [ ] Projects without `sourceLink` render correctly (backward compatibility)
- [ ] Projects with `sourceLink` show "Source Code" button
- [ ] Mobile: meta header stacks properly
- [ ] Mobile: modal images don't overflow viewport
- [ ] All button states (hover, active, focus) work correctly

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/style.ts` | Add `GhostButton`, `TextIconButton` |
| `src/components/Projects/style.ts` | Add modal backdrop, meta-header, footer styles; update `GalleryFrame` |
| `src/components/Projects/Project.tsx` | Refactor modal structure, update button hierarchy |
| `src/data/projects.ts` (optional) | Add `sourceLink` field |

---

## Notes

- The "Read Post" button should **always** use ghost style, even when it's the only button
- This creates visual consistency and establishes it as a secondary action
- The "Source Code" button is tertiary and should be subtle (text + icon only)
- The `sourceLink` field is **optional** - existing projects will continue to work without it
- The modal backdrop must dynamically update to match the currently displayed carousel image
- When using the carousel's `onChange` callback, update both `photoIndex` state and the backdrop image
