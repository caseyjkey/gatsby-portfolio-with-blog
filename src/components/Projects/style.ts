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
    max-height: 70vh !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
  }

  /* Make images in carousel properly sized - constrained by container */
  .project-modal-carousel .slide .gatsby-image-wrapper {
    width: 100% !important;
    max-width: 100% !important;
    max-height: 70vh !important;
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
  }

  .project-modal-carousel .slide .gatsby-image-wrapper img {
    max-width: 100% !important;
    max-height: 70vh !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain !important;
    display: block !important;
  }

  /* Regular img tags (non-Gatsby) */
  .project-modal-carousel .slide > div > img {
    max-width: 100% !important;
    max-height: 70vh !important;
    height: auto !important;
    object-fit: contain !important;
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

  /* Mobile */
  @media (max-width: 767.98px) {
    .project-modal-carousel,
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
export const ModalBackdrop = styled.div<{ $backdropImage?: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${props => props.$backdropImage || ''});
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  opacity: 1;
  z-index: 0;
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
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0 1rem 0;

  @media (max-width: 767.98px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Meta title (category/position)
export const MetaTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.darken};
  margin: 0;
`;

// Meta icons container
export const MetaIcons = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  color: ${props => props.theme.black};

  @media (max-width: 767.98px) {
    width: 100%;
  }
`;

// Modal footer divider
export const ModalFooterDivider = styled.div`
  border-top: 1px solid #f1f5f9; /* border-slate-100 equivalent */
  padding-top: 1rem;
`;