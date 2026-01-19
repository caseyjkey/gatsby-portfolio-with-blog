import React, { Suspense, useState, ReactNode, forwardRef, useMemo, useEffect, useRef } from 'react'
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap'
import { theme, PrimaryButton, GhostButton, TextIconButton } from '../style'
import { ProjectWrapper, ReadMoreColor, GalleryFrame, ProjectInfo, ModalImageContainer, ModalImage, ModalBackdrop, ModalMetaHeader, MetaTitleRow, MetaTitle, MetaDate, MetaIcons, ModalFooterDivider, CarouselGlobalStyles } from './style'
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import ReactReadMoreReadLess from '@caseykey/react-read-more-read-less'
import { IconType } from 'react-icons'
import { FaGithub, FaChevronLeft, FaChevronRight, FaSearchPlus } from 'react-icons/fa'
import { motion, AnimatePresence } from 'motion/react'

// Helper: Check if image is approximately 16:9 aspect ratio (within 5% tolerance)
const is16by9 = (width: number, height: number): boolean => {
  const ratio = width / height;
  const targetRatio = 16 / 9;
  return Math.abs(ratio - targetRatio) < 0.1;
};

interface GalleryImage {
  image: {
    publicURL: string;
    childImageSharp?: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
}

interface ProjectProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  image: IGatsbyImageData;
  galleryImages: GalleryImage[];
  icons: IconType[];
  link?: string;
  postLink?: string;
  sourceLink?: string;  // Optional: GitHub repository URL
  date: string;
  [key: string]: any; // Allow data attributes
}

const Project = forwardRef<HTMLDivElement, ProjectProps>(({
  children,
  title,
  subtitle,
  image,
  galleryImages,
  icons,
  link,
  postLink,
  sourceLink,
  date,
  ...props
}, ref) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const modalImageContainerRef = useRef<HTMLDivElement>(null);
  const [floatingSizes, setFloatingSizes] = useState<Record<number, { width: number; height: number }>>({});
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightbox] = useState(false);

  // Detect which images are full-bleed (16:9) vs floating
  const fullBleedIndices = useMemo(() => {
    return galleryImages.map((dict) => {
      if (dict.image.childImageSharp?.gatsbyImageData) {
        const { width, height } = dict.image.childImageSharp.gatsbyImageData;
        return is16by9(width, height);
      }
      return false;
    });
  }, [galleryImages]);

  useEffect(() => {
    if (!modal) return;
    const container = modalImageContainerRef.current;
    if (!container) return;

    const updateSizes = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      if (!containerWidth || !containerHeight) return;

      const nextSizes: Record<number, { width: number; height: number }> = {};
      galleryImages.forEach((dict, idx) => {
        if (fullBleedIndices[idx]) return;
        const imageData = dict.image.childImageSharp?.gatsbyImageData;
        if (!imageData?.width || !imageData?.height) return;

        const scale = Math.min(containerWidth / imageData.width, containerHeight / imageData.height);
        nextSizes[idx] = {
          width: Math.round(imageData.width * scale),
          height: Math.round(imageData.height * scale),
        };
      });
      setFloatingSizes(nextSizes);
    };

    updateSizes();
    const resizeObserver = new ResizeObserver(() => updateSizes());
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [modal, galleryImages, fullBleedIndices]);

  // Navigation effect state for indicator animations
  const [navigationDirection, setNavigationDirection] = useState<'left' | 'right' | null>(null);
  const [keyboardActive, setKeyboardActive] = useState<'left' | 'right' | null>(null);

  // Navigation handlers with direction tracking
  const goToPrevious = () => {
    setNavigationDirection('left');
    setPhotoIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setNavigationDirection('right');
    setPhotoIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const goToSlide = (index: number) => {
    setNavigationDirection(index > photoIndex ? 'right' : 'left');
    setPhotoIndex(index);
  };

  // Keyboard navigation for carousel
  useEffect(() => {
    if (!modal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setKeyboardActive('left');
        goToPrevious();
        setTimeout(() => setKeyboardActive(null), 200);
      } else if (e.key === 'ArrowRight') {
        setKeyboardActive('right');
        goToNext();
        setTimeout(() => setKeyboardActive(null), 200);
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Spacebar or Enter opens lightbox (accessibility standard)
        e.preventDefault();
        toggleLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal, galleryImages.length, photoIndex]);

  // Ensure publicURL exists, otherwise fallback to empty string (will be handled by lightbox)
  let images = galleryImages.map((dict, idx) => {
    const url = dict.image.publicURL || dict.image.childImageSharp?.gatsbyImageData?.images?.fallback?.src || '';
    if (!url && process.env.NODE_ENV === 'development') {
      console.warn(`Missing image URL for gallery image ${idx} in project "${title}":`, dict);
    }
    return url;
  });

  const toggleLightbox = () => {
    // Ensure photoIndex is valid before opening lightbox
    const validImages = images.filter(src => src);
    if (photoIndex >= validImages.length) {
      setPhotoIndex(0);
    }
    setLightbox(!lightboxOpen);
  };

  // Custom function to close modal only if lightbox is not open
  const handleModalToggle = () => {
    if (!lightboxOpen) {
      toggleModal();
    }
  };

  // Helper to render the current carousel image inline with fresh state
  const renderCurrentImage = () => {
    const dict = galleryImages[photoIndex];
    if (!dict) return null;

    const imageData = dict.image.childImageSharp?.gatsbyImageData;
    const isFullBleed = fullBleedIndices[photoIndex];

    if (imageData) {
      if (isFullBleed) {
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GatsbyImage image={imageData} alt="project" style={{ width: '100%', height: '100%' }} />
          </div>
        );
      } else {
        const aspectRatio = imageData.width / imageData.height;
        const carouselAspect = 16 / 9;
        const isWide = aspectRatio > carouselAspect;

        const floatingSize = floatingSizes[photoIndex];
        const floatingStyle = floatingSize
          ? { width: floatingSize.width, height: floatingSize.height, flexShrink: 0 }
          : {
              aspectRatio: `${imageData.width} / ${imageData.height}`,
              ...(isWide ? { width: '100%' } : { height: '100%' }),
            };

        return (
          <div
            className="floating-image-container"
            style={floatingStyle}
          >
            <GatsbyImage
              image={imageData}
              alt="project"
              imgStyle={{ objectFit: 'cover' }}
            />
          </div>
        );
      }
    } else {
      return <img src={dict.image.publicURL} alt="project" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />;
    }
  };

  return (
    <ProjectWrapper ref={ref} onClick={(e) => {
      // Only toggle modal if not already open and not clicking a button/link
      if (!modal && !(e.target as HTMLElement).closest('a, button')) {
        toggleModal();
      }
    }} className="shadow" {...props}>
      <CarouselGlobalStyles />
      <GalleryFrame>
        <GatsbyImage image={image} alt={title} />
      </GalleryFrame>
      <ProjectInfo>
        <h3>{title}</h3>
        <span>{subtitle}</span>
      </ProjectInfo>

      <Modal isOpen={modal} toggle={handleModalToggle} centered>
        <ModalHeader toggle={handleModalToggle}>
          {title}
        </ModalHeader>
        <Suspense fallback={<ModalBody>Loading...</ModalBody>}>
          <ModalBody>
            {/* Backdrop + Image Container */}
            <ModalImageContainer ref={modalImageContainerRef}>
              {/* Custom Framer Motion Carousel with cross-fade transition */}
              <div className="project-modal-carousel">
                {/* mode="sync": Both entering and exiting slides animate simultaneously, creating a smooth cross-fade.
                    mode="wait" (default) would make exit complete before enter starts, causing a flash. */}
                <AnimatePresence mode="sync" initial={false}>
                  <motion.div
                    key={photoIndex}
                    className="slide"
                    initial={{ opacity: 0, zIndex: 0 }}  // Start invisible and below exiting slide
                    animate={{ opacity: 1, zIndex: 1 }}  // Fade in and rise to top layer
                    exit={{ opacity: 0, zIndex: 0 }}     // Fade out and drop behind entering slide
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => toggleLightbox()}
                  >
                    {/* Backdrop rendered INSIDE motion.div so it fades in/out with its slide.
                        This prevents backdrop flashes during navigation since AnimatePresence
                        manages the backdrop as part of the slide's transition lifecycle. */}
                    {!fullBleedIndices[photoIndex] && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${images[photoIndex]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'blur(2px)',
                          zIndex: -1,
                        }}
                      />
                    )}

                    {/* Foreground image */}
                    {renderCurrentImage()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {galleryImages.length > 1 && (
                  <>
                    <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          scale: keyboardActive === 'left' ? 0.95 : 1,
                        }}
                        transition={{ delay: 0.1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPrevious();
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          border: 'none',
                          background: 'rgba(255, 255, 255, 0.9)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transformOrigin: 'center center',
                        }}
                        whileHover={{ scale: 1.1, transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                        aria-label="Previous image"
                      >
                        <FaChevronLeft size={18} color="#333" />
                      </motion.button>
                    </div>

                    <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          scale: keyboardActive === 'right' ? 0.95 : 1,
                        }}
                        transition={{ delay: 0.1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNext();
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          border: 'none',
                          background: 'rgba(255, 255, 255, 0.9)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transformOrigin: 'center center',
                        }}
                        whileHover={{ scale: 1.1, transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                        aria-label="Next image"
                      >
                        <FaChevronRight size={18} color="#333" />
                      </motion.button>
                    </div>

                    {/* Indicators with better contrast - dark background with semi-transparent overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 8,
                      padding: '6px 12px',
                      borderRadius: 20,
                      background: 'rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(4px)',
                      zIndex: 10,
                      maxWidth: 'calc(100% - 24px)',
                    }}>
                      {galleryImages.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            goToSlide(index);
                          }}
                          initial={false}
                          animate={{
                            width: photoIndex === index ? 24 : 8,
                            backgroundColor: photoIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                          }}
                          transition={{
                            width: { duration: 0.3, ease: 'easeInOut' },
                            backgroundColor: { duration: 0.3 }
                          }}
                          style={{
                            height: 8,
                            borderRadius: 4,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Magnifying glass icon in top-right corner */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLightbox();
                  }}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}
                  whileHover={{ opacity: 1, scale: 1.05, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                  aria-label="Open lightbox"
                >
                  <FaSearchPlus size={16} color="#fff" />
                </motion.button>
              </div>
            </ModalImageContainer>

            {/* Meta Header with aligned title/date/icons */}
            <ModalMetaHeader>
              <MetaTitleRow>
                <MetaTitle>{subtitle}</MetaTitle>
                <MetaDate>{date}</MetaDate>
              </MetaTitleRow>
              <MetaIcons>
                {icons.map((Icon, i) => <li key={i}><Icon size={21} /></li>)}
              </MetaIcons>
            </ModalMetaHeader>

            {/* Description with read-more */}
            <ReadMoreColor>
              <ReactReadMoreReadLess charLimit={200}
                readMoreText={"Read More ▼"}
                readLessText={"Read Less ▲"}
                readMoreClassname="read-more-less--more"
                readLessClassname="read-more-less--less"
              >
                {children.props.dangerouslySetInnerHTML.__html}
              </ReactReadMoreReadLess>
            </ReadMoreColor>

            <Lightbox
              open={lightboxOpen}
              close={() => setLightbox(false)}
              slides={images.filter(src => src).map(src => ({ src }))}
              index={photoIndex}
              plugins={[Zoom]}
              zoom={{
                maxZoomPixelRatio: 3,
                zoomInMultiplier: 2,
                scrollToZoom: true
              }}
              on={{
                view: ({ index }) => setPhotoIndex(index)
              }}
              styles={{ container: { zIndex: 1100 } }}
            />
          </ModalBody>
        </Suspense>
        <ModalFooter>
          <ModalFooterDivider>
            <div className="footer-actions">
              {/* Tertiary: Source Code */}
              {sourceLink && (
                <TextIconButton as="a" href={sourceLink} target="_blank" rel="noopener noreferrer">
                  <FaGithub size={16} /> Source
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
          </ModalFooterDivider>
        </ModalFooter>
      </Modal>
    </ProjectWrapper>
  );
});

export default Project;