import React, { Suspense, useState } from 'react'
import Img from 'gatsby-image'
import { useStaticQuery, graphql } from 'gatsby'
import { Modal, ModalHeader, ModalFooter, ModalBody, Button} from 'reactstrap'
import { theme } from '../style.js'
import { ProjectWrapper, ReadMoreColor } from './style.js'
import { Animated } from 'react-animated-css'
import { Waypoint } from 'react-waypoint'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactReadMoreReadLess from 'react-read-more-read-less'

// Using a functional component because we don't use state, constructor, or lifecycle hooks
export default function Project({children, title, subtitle, image, icons, link, date, project}) {
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);

    const [visible, setVisible] = useState(false);
    const makeVisible = () => setVisible(true);
    
    const data = useStaticQuery(
      graphql`
        query {
          allFile(filter: {
            extension: {regex: "/(jpg)|(jpeg)|(png)|(gif)|(webm)|(avi)\\z/"}, 
            sourceInstanceName: {eq: "projectImages"}}) 
            {
              edges {
                node {
                  childImageSharp {
                    fluid(maxWidth: 466, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                  extension
                  relativeDirectory
                  relativePath
                  publicURL
                }
              }
          }
        }
      `
    );
        
    const images = Object.values(data.allFile.edges).reduce((result, image) => {
      if(project === image.node.relativeDirectory)
        result.push(image.node.publicURL);
      return result;
    }, []);

    const carouselImages = Object.values(data.allFile.edges).reduce((result, image) => {
      if(project == image.node.relativeDirectory) 
        result.push((image.node.childImageSharp) ? <Img fluid={image.node.childImageSharp.fluid} /> : <img src={image.node.publicURL} />);
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
          <Img fluid={image} style={{position: "static"}}/>
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
                          showThumbs={false}
                          onChange={(index, something) => {
                            setPhotoIndex(index);
                          }}
                          onClickItem={() => toggleLightbox()}
                          selectedItem={photoIndex}
                          style={{paddingBottom: "16px"}}
                >
                  {carouselImages.map(image => {
                    return <div>{image}}</div>
                  })}
                </Carousel>
                <ul className="list-unstyled d-flex flex-row flex-wrap my-1 pt-4">
                  {icons.map((Icon, index) => { 
                    return (
                      <li key={index} className="mr-3 mb-2" styled={{color: theme.black}}>
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
                  <Lightbox reactModalStyle={{overlay: {zIndex: 1100}}}
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
                  />
                )}
                </ModalBody>
            </Suspense>
            <ModalFooter>
              <div className="date mr-auto small">{date}</div>
              {link && <Button color="primary" href={link} target={"_blank"}>View project</Button>}
            </ModalFooter>
          </Modal>
        </ProjectWrapper>
      </Animated>
    );
}