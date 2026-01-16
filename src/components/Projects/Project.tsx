import React, { Suspense, useState, ReactNode, forwardRef, useMemo, useEffect, useRef } from 'react'
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap'
import { theme, PrimaryButton, GhostButton, TextIconButton } from '../style'
import { ProjectWrapper, ReadMoreColor, GalleryFrame, ProjectInfo, ModalBackdrop, ModalImageContainer, ModalImage, ModalMetaHeader, MetaTitleRow, MetaTitle, MetaDate, MetaIcons, ModalFooterDivider, CarouselGlobalStyles } from './style'
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactReadMoreReadLess from '@caseykey/react-read-more-read-less'
import { IconType } from 'react-icons'
import { FaGithub } from 'react-icons/fa'

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

  let images = galleryImages.map(dict => dict.image.publicURL);
  let carouselImages = galleryImages.map((dict, idx) => {
    const image = dict.image;
    const imageData = image.childImageSharp?.gatsbyImageData;
    const isFullBleed = fullBleedIndices[idx];

    if (imageData) {
      const aspectRatio = imageData.width / imageData.height;
      if (isFullBleed) {
        return <GatsbyImage image={imageData} alt="project" />;
      } else {
        // Use image's actual aspect ratio for the container
        const aspectRatio = imageData.width / imageData.height;
        const carouselAspect = 16 / 9;
        const isWide = aspectRatio > carouselAspect;

        const floatingSize = floatingSizes[idx];
        const floatingStyle = floatingSize
          ? { width: floatingSize.width, height: floatingSize.height, flexShrink: 0 }
          : {
              aspectRatio: `${imageData.width} / ${imageData.height}`,
              ...(isWide ? { width: '100%' } : { height: '100%' }),
            };

        return (
          <div
            className={`floating-image-container`}
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
      return <img src={image.publicURL} alt="project" />;
    }
  });

  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightbox] = useState(false);
  const toggleLightbox = () => {
    setLightbox(!lightboxOpen);
  };

  // Custom function to close modal only if lightbox is not open
  const handleModalToggle = () => {
    if (!lightboxOpen) {
      toggleModal();
    }
  };

  // Check if current image is full-bleed for backdrop visibility
  const isCurrentFullBleed = fullBleedIndices[photoIndex] ?? false;

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

      <Modal isOpen={modal} toggle={handleModalToggle} >
        <ModalHeader toggle={handleModalToggle}>
          {title}
        </ModalHeader>
        <Suspense fallback={<ModalBody>Loading...</ModalBody>}>
          <ModalBody>
            {/* Backdrop + Image Container */}
            <ModalImageContainer ref={modalImageContainerRef}>
              {/* Backdrop uses current carousel image - hidden for full-bleed images */}
              <ModalBackdrop $backdropImage={images[photoIndex]} $hidden={isCurrentFullBleed} />
              <Carousel
                dynamicHeight={false}
                infiniteLoop
                useKeyboardArrows
                showThumbs={false}
                showStatus={false}
                showIndicators
                onChange={(index: number) => {
                  setPhotoIndex(index);
                }}
                onClickItem={() => toggleLightbox()}
                selectedItem={photoIndex}
                renderThumbs={() => []}
                className="project-modal-carousel"
                showArrows={true}
              >
                {carouselImages.map((image, index) => (
                  <div key={index} className={fullBleedIndices[index] ? 'full-bleed' : ''}>{image}</div>
                ))}
              </Carousel>
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
              slides={images.map(src => ({ src }))}
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