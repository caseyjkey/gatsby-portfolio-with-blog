import React, { Suspense, useState, ReactNode, forwardRef } from 'react'
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap'
import { theme, Button as EnhancedButton } from '../style'
import { ProjectWrapper, ReadMoreColor, GalleryFrame, ProjectInfo } from './style'
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactReadMoreReadLess from '@caseykey/react-read-more-read-less'
import { IconType } from 'react-icons'

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
  date,
  ...props
}, ref) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  let images = galleryImages.map(dict => dict.image.publicURL);
  let carouselImages = galleryImages.map(dict => dict.image).reduce((result, image) => {
    result.push((image.childImageSharp)
      ? <GatsbyImage image={image.childImageSharp.gatsbyImageData} alt="project" style={{ width: '100%', height: 'auto' }} />
      : <img src={image.publicURL} alt="project" style={{ width: '100%', height: 'auto' }} />
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
            <Carousel dynamicHeight
              infiniteLoop
              useKeyboardArrows
              showThumbs={false}
              onChange={(index: number) => {
                setPhotoIndex(index);
              }}
              onClickItem={() => toggleLightbox()}
              selectedItem={photoIndex}
              style={{ paddingBottom: "16px" }}
            >
              {carouselImages.map((image, index) => {
                return <div key={index}>{image}</div>
              })}
            </Carousel>
            <ul className="list-unstyled d-flex flex-row flex-wrap my-1 pt-4">
              {icons.map((Icon, index) => {
                return (
                  <li key={index} className="ml-4" mb-2 style={{ color: theme.black, marginRight: '0.5rem' }}>
                    <Icon size={21} />
                  </li>
                );
              })}
            </ul>
            <h4 className="h6">{subtitle}</h4>
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
        <ModalFooter className="d-flex justify-content-between align-items-center">
          <div className="date small">{date}</div>
          <div>
            {postLink && <EnhancedButton color={link ? "secondary" : "primary"} href={postLink} style={{ marginRight: '8px' }}>Read post</EnhancedButton>}
            {link && <EnhancedButton color="primary" href={link} target={"_blank"}>View project</EnhancedButton>}
          </div>
        </ModalFooter>
      </Modal>
    </ProjectWrapper>
  );
});

export default Project;