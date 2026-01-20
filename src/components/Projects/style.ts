import styled, { css, createGlobalStyle } from 'styled-components'
import { Section, Image } from '../style.ts'

export const ProjectSection = styled.section`
  margin-top: 6em;

  @media (max-width: 767.98px) {
    margin-top: 0;
  }

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
  border-radius: 0.5rem;
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

export const GalleryFrame = styled.div`
  background-color: #f8fafc;
  border: 1px solid #f1f5f9; /* border-slate-100 equivalent */
  aspect-ratio: 16 / 9;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;

  .gatsby-image-wrapper {
    max-width: 100%;
    max-height: 100%;
  }

  /* Disable GatsbyImage's aspect ratio padding hack */
  .gatsby-image-wrapper > div[aria-hidden="true"] {
    display: none !important;
  }

  .gatsby-image-wrapper picture,
  .gatsby-image-wrapper img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }

  .gatsby-image-wrapper img {
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

// Global styles for project modal carousel images
export const CarouselGlobalStyles = createGlobalStyle`
  /* Cross-fade slide stacking - all slides absolutely positioned on top of each other */
  .project-modal-carousel {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
  }

  .project-modal-carousel .slide {
    position: absolute !important;
    inset: 0 !important;
  }

  /* Floating image container: enhanced shadow for depth */
  .project-modal-carousel .floating-image-container {
    box-shadow: 0 35px 35px rgba(0, 0, 0, 0.6) !important;
    border-radius: 0.5rem !important;
    overflow: hidden !important;
  }

  /* Full-bleed images: fill container */
  .project-modal-carousel .slide > div > .gatsby-image-wrapper,
  .project-modal-carousel .slide > .gatsby-image-wrapper {
    width: 100% !important;
    height: 100% !important;
  }

  /* Hide scrollbar on indicator container while keeping scroll functionality */
  .project-modal-carousel div[style*="overflowX: auto"] {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }

  .project-modal-carousel div[style*="overflowX: auto"]::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
`;

// Global styles for modal content styling
export const ModalGlobalStyles = createGlobalStyle`
  /* Modal content padding */
  .modal-content {
    padding: 0 0.5rem !important;
  }

  /* Modal body text - industry standard for readability */
  .modal-body {
    font-size: 1rem !important; /* 16px */
    line-height: 1.625 !important; /* leading-relaxed */
  }

  /* Base list styling (Amazon-style cards) */
  .modal-body ul,
  .modal-body ol {
    padding-left: 0.1rem !important;
    list-style-position: outside !important;
  }

  /* Follow-up rule (Curriculum-style cards) */
  .modal-body p + ul,
  .modal-body p + ol {
    padding-left: 1.5rem !important;
    margin-top: 1rem !important;
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