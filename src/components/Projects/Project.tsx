import React, { Suspense, useState, ReactNode } from 'react'
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap'
import { theme } from '../style.ts'
import { ProjectWrapper, ReadMoreColor } from './style.ts'
import { Animated } from 'react-animated-css'
import { Waypoint } from 'react-waypoint'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
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
}

export default function Project({
  children,
  title,
  subtitle,
  image,
  galleryImages,
  icons,
  link,
  postLink,
  date
}: ProjectProps): JSX.Element {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const [visible, setVisible] = useState(false);
  const makeVisible = () => setVisible(true);
  let images = galleryImages.map(dict => dict.image.publicURL);
  let carouselImages = galleryImages.map(dict => dict.image).reduce((result, image) => {
    result.push((image.childImageSharp) ? <GatsbyImage image={image.childImageSharp.gatsbyImageData} /> : <img src={image.publicURL} />);
    return result;
  }, []);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightbox] = useState(false);
  const toggleLightbox = () => {
    setLightbox(!lightboxOpen);
  };

  return (
    <Animated animationIn={"fadeInUp"} isVisible={visible}>
      <ProjectWrapper onClick={toggleModal} className="shadow d-flex justify-content-center align-items-center">
        <GatsbyImage image={image} style={{ position: "absolute" }} />
        <div className="overlay" />
        <div className="text text-center p-4">
          <h3>{title}</h3>
          <Waypoint onEnter={makeVisible}></Waypoint>
          <span>{subtitle}</span>
        </div>

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
              {lightboxOpen && (
                <Lightbox
                  reactModalStyle={{ overlay: { zIndex: 1100 } }}
                  mainSrc={images[photoIndex]}
                  nextSrc={images[(photoIndex + 1) % images.length]}
                  prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                  onCloseRequest={() => toggleLightbox()}
                  onMovePrevRequest={() =>
                    setPhotoIndex((photoIndex + images.length - 1) % images.length)
                  }
                  onMoveNextRequest={() =>
                    setPhotoIndex((photoIndex + 1) % images.length)
                  }
                  enableZoom={true}
                  clickOutsideToClose={false}
                />
              )}
            </ModalBody>
          </Suspense>
          <ModalFooter className="d-flex justify-content-between align-items-center">
            <div className="date small">{date}</div>
            <div>
              {postLink && <Button color={link ? "secondary" : "primary"} href={postLink} style={{ marginRight: '8px' }}>Read post</Button>}
              {link && <Button color="primary" href={link} target={"_blank"}>View project</Button>}
            </div>
          </ModalFooter>
        </Modal>
      </ProjectWrapper>
    </Animated>
  );
}