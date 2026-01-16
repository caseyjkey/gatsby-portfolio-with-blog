import styled, { css, createGlobalStyle } from 'styled-components'
import { Section, Image } from '../style.ts'

export const ProjectSection = styled.section`
  margin-top: 6em;
  ${Section}
  flex: 1 0 auto;
`;

export const ProjectWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  background-color: ${props => props.theme.white};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover,
  &:focus {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

  // Put lightbox on top of project modal
  ReactModal__Overlay {
    ReactModal__Overlay--after-open {
      z-index: 1100;
    }
  }
`;

// Global styles to make react-responsive-carousel fill its container
export const CarouselGlobalStyles = createGlobalStyle`
  /* Target the carousel inside ModalImageContainer */
  .project-modal-carousel {
    width: 100% !important;
    position: relative !important;
    z-index: 2 !important;
    /* Use aspect-ratio directly on carousel */
    aspect-ratio: 16 / 9 !important;
    max-height: 70vh !important;
    /* CSS custom property for floating image calculations */
    --carousel-height: 70vh;
  }

  .project-modal-carousel .slider-wrapper {
    width: 100% !important;
    position: relative !important;
    z-index: 2 !important;
    aspect-ratio: 16 / 9 !important;
    max-height: 70vh !important;
  }

  .project-modal-carousel .slider {
    width: 100% !important;
    position: relative !important;
    z-index: 2 !important;
    aspect-ratio: 16 / 9 !important;
    max-height: 70vh !important;
  }

  .project-modal-carousel .slide {
    background: transparent !important;
    width: 100% !important;
    display: flex !important;
    /* Start from top, not center */
    align-items: flex-start !important;
    justify-content: center !important;
    position: relative !important;
    z-index: 2 !important;
    padding: 0 !important;
    margin: 0 !important;
    aspect-ratio: 16 / 9 !important;
    max-height: 70vh !important;
  }

  /* Target the div inside the slide - this is what contains the GatsbyImage */
  .project-modal-carousel .slide > div {
    width: 100%;
    height: 100%;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
  }

  /* Make images in carousel properly sized - constrained by container */
  .project-modal-carousel .slide .gatsby-image-wrapper {
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
  }

  /* Override GatsbyImage's aspect-ratio padding hack */
  .project-modal-carousel .slide .gatsby-image-wrapper > div[aria-hidden="true"] {
    padding-top: 0 !important;
    display: none !important;
  }

  .project-modal-carousel .slide .gatsby-image-wrapper picture {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
  }

  /* Default/Partial (Floating) image styling - tall/small images */

  /* Outer div: provides flex centering context */
  .project-modal-carousel .slide > div:not(.full-bleed) {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    height: 100% !important;
  }

  /* Floating image container: aspect-ratio set by JS, constrained by max dimensions */
  .project-modal-carousel .floating-image-container {
    display: block !important;
    /* Constrain to fit within carousel bounds */
    max-width: 100% !important;
    max-height: 100% !important;
    /* Effects applied to container which matches visible image dimensions exactly */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    border-radius: 0.75rem;
    overflow: hidden !important;
    position: relative !important;
  }

  /* Gatsby wrapper inside floating container: fill container completely */
  .project-modal-carousel .floating-image-container .gatsby-image-wrapper {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
  }

  /* Disable GatsbyImage's padding hack since we set explicit dimensions */
  .project-modal-carousel .floating-image-container .gatsby-image-wrapper > div[aria-hidden="true"] {
    display: none !important;
  }

  /* Picture and img fill container completely */
  .project-modal-carousel .floating-image-container .gatsby-image-wrapper picture,
  .project-modal-carousel .floating-image-container .gatsby-image-wrapper picture img {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
  }

  /* Use cover to fill without distortion since container aspect matches image */
  .project-modal-carousel .floating-image-container .gatsby-image-wrapper picture img {
    object-fit: cover !important;
  }

  /* Full-Bleed image styling - 16:9 images that fill the frame */
  .project-modal-carousel .slide > div.full-bleed .gatsby-image-wrapper img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
  }

  /* Fade transition for smooth image transitions */
  .project-modal-carousel .slide {
    transition: opacity 0.3s ease-in-out !important;
  }

  .project-modal-carousel .slide.fade-exit {
    opacity: 0 !important;
  }

  .project-modal-carousel .slide.fade-enter {
    opacity: 1 !important;
  }

  /* Regular img tags (non-Gatsby) - floating styling */
  .project-modal-carousel .slide > div:not(.full-bleed) > img {
    max-width: 100% !important;
    max-height: 100% !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
  }

  /* Regular img tags (non-Gatsby) - full-bleed styling */
  .project-modal-carousel .slide > div.full-bleed > img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
  }

  /* Position controls within the container bounds */
  .project-modal-carousel .control-prev,
  .project-modal-carousel .control-next {
    z-index: 10 !important;
    position: absolute !important;
  }

  /* Position dots at the bottom within container */
  .project-modal-carousel .control-dots {
    position: absolute !important;
    bottom: 10px !important;
    z-index: 10 !important;
    margin: 0 !important;
  }

  .project-modal-carousel .carousel-status {
    position: absolute !important;
    top: 0 !important;
    z-index: 10 !important;
  }

  /* Mobile responsive styles */
  @media (max-width: 767.98px) {
    .project-modal-carousel {
      max-height: 50vh !important;
      --carousel-height: 50vh;
    }

    .project-modal-carousel .slider-wrapper,
    .project-modal-carousel .slider,
    .project-modal-carousel .slide {
      max-height: 50vh !important;
      aspect-ratio: 16 / 9 !important;
    }

    .project-modal-carousel .slide > div {
      max-height: 50vh !important;
    }

    .project-modal-carousel .slide .gatsby-image-wrapper {
      max-height: 50vh !important;
    }

    .project-modal-carousel .slide .gatsby-image-wrapper img {
      max-height: 50vh !important;
    }

    .project-modal-carousel .slide > div > img {
      max-height: 50vh !important;
    }
  }
`;

export const GalleryFrame = styled.div`
  background-color: #f8fafc;
  border: 1px solid #f1f5f9; /* border-slate-100 equivalent */
  aspect-ratio: 16 / 9;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  .gatsby-image-wrapper {
    width: 100%;
    height: 100%;
  }

  .gatsby-image-wrapper img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
`;

export const ProjectInfo = styled.div`
  padding: 1.5rem;
  background-color: ${props => props.theme.white};
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  h3 {
    color: ${props => props.theme.black};
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  span {
    color: ${props => props.theme.primaryColor};
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 11px;
    font-weight: 600;
  }
`;

export const ReadMoreColor = styled.div`
	.react-read-more-read-less {
		color: ${props => props.theme.primaryColor};
	}
`;

// Modal backdrop - blurred version of current carousel image
export const ModalBackdrop = styled.div<{ $backdropImage?: string; $hidden?: boolean }>`
  position: absolute;
  inset: 0;
  background-image: url(${props => props.$backdropImage || ''});
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  opacity: ${props => props.$hidden ? 0 : 1};
  z-index: 0;
  pointer-events: ${props => props.$hidden ? 'none' : 'auto'};
  transition: opacity 0.3s ease-in-out;
`;

// Modal image container with aspect ratio
export const ModalImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 70vh;
  z-index: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 767.98px) {
    max-height: 50vh;
  }
`;

// Modal image with floating effect
export const ModalImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* drop-shadow-2xl equivalent */
  border: 1px solid rgba(255, 255, 255, 0.2); /* border-white/20 equivalent */
  border-radius: 8px;
  position: relative;
  z-index: 2;
`;

// Modal meta-header for title and icons
export const ModalMetaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;

  /* Desktop (>= 640px): Horizontal row with title and date */
  @media (min-width: 640px) {
    flex-direction: row;
  }

  /* Mobile (< 640px): Vertical stack */
  @media (max-width: 639px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

// Title and Date Row (desktop)
export const MetaTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-top: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }

  @media (max-width: 639px) {
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0;
  }
`;

// Meta title (category/position) - Position Title
export const MetaTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.black}; /* text-slate-900 */
  margin: 0;
  line-height: 1.25; /* leading-tight */

  @media (min-width: 640px) {
    max-width: 70%;
  }

  @media (max-width: 639px) {
    font-size: 1rem;
    width: 100%;
    white-space: normal;
  }
`;

// Meta date in header
export const MetaDate = styled.div`
  color: #64748b; /* text-slate-500 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  white-space: nowrap;

  @media (min-width: 640px) {
    flex-shrink: 0;
    margin-top: 0;
  }

  @media (max-width: 639px) {
    margin-top: 0;
  }
`;

// Meta icons container
export const MetaIcons = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* gap-3 equivalent */
  list-style: none;
  margin: 0;
  padding: 0;
  color: ${props => props.theme.black};
  width: 100%;

  @media (min-width: 640px) {
    margin-top: 0.0rem; /* mt-4 equivalent */
    
  }

  @media (max-width: 639px) {
    margin-top: 0.75rem; /* mt-3 equivalent */
  }
`;

// Modal footer with aligned buttons
export const ModalFooterDivider = styled.div`
  border-top: 1px solid #f1f5f9; /* border-slate-100 equivalent */
  padding-top: 1rem;

  .footer-actions {
    display: flex;
    justify-content: flex-end; /* Align all buttons to the right */
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 399px) {
      /* Very narrow screens: stack buttons */
      flex-direction: column;
      align-items: stretch;
      width: 100%;
    }
  }
`;