import React, { Suspense, useState, ReactNode, forwardRef } from 'react'
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap'
import { theme, PrimaryButton, GhostButton, TextIconButton } from '../style'
import { ProjectWrapper, ReadMoreColor, GalleryFrame, ProjectInfo, ModalBackdrop, ModalImageContainer, ModalImage, ModalMetaHeader, MetaTitle, MetaIcons, ModalFooterDivider, CarouselGlobalStyles } from './style'
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactReadMoreReadLess from '@caseykey/react-read-more-read-less'
import { IconType } from 'react-icons'
import { FaGithub } from 'react-icons/fa'

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

  let images = galleryImages.map(dict => dict.image.publicURL);
  let carouselImages = galleryImages.map(dict => dict.image).reduce((result, image) => {
    result.push((image.childImageSharp)
      ? <GatsbyImage image={image.childImageSharp.gatsbyImageData} alt="project" />
      : <img src={image.publicURL} alt="project" />
    );
    return result;
  }, []);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightbox] = useState(false);
  const toggleLightbox = () => {
    setLightbox(!lightboxOpen);
  };

  return (
    <ProjectWrapper ref={ref} onClick={toggleModal} className="shadow" {...props}>
      <CarouselGlobalStyles />
      <GalleryFrame>
        <GatsbyImage image={image} alt={title} />
      </GalleryFrame>
      <ProjectInfo>
        <h3>{title}</h3>
        <span>{subtitle}</span>
      </ProjectInfo>

      <Modal isOpen={modal} toggle={toggleModal} >
        <ModalHeader toggle={toggleModal}>
          {title}
        </ModalHeader>
        <Suspense fallback={<ModalBody>Loading...</ModalBody>}>
          <ModalBody>
            {/* Backdrop + Image Container */}
            <ModalImageContainer>
              {/* Backdrop uses current carousel image - updates on slide change */}
              <ModalBackdrop $backdropImage={images[photoIndex]} />
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
            <div className="d-flex justify-content-between align-items-center" style={{ width: '100%' }}>
              <div className="date small">{date}</div>
              <div className="d-flex gap-2">
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
            </div>
          </ModalFooterDivider>
        </ModalFooter>
      </Modal>
    </ProjectWrapper>
  );
});

export default Project;