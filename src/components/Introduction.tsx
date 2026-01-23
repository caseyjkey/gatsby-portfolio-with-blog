import React, { useEffect, useState, useRef } from 'react'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import { HeroWrap, Overlay, Text, Subheader, Header, Slider } from './Introduction/style.ts'
import { Button, PrimaryButton } from './style.ts'
import FallingArrow from './Introduction/Mouse'
import Socials from './Social'
import Resume from './Introduction/resume.pdf'
import { graphql, useStaticQuery } from 'gatsby'
import Typewriter from 'typewriter-effect/dist/core'
import { motion } from 'motion/react'
import { HERO_TIMING, EASING, fadeInUpVariants } from '../animations'

// Blob SVG components with preserveAspectRatio="none" for controlled stretching
const MobileBlob = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="-150 20 600 350"
    preserveAspectRatio="none"
  >
    <path d="M 162,94.8 C 129.81195,93.8403 99.15574,84.930003 69.877152,75.179436 40.59857,65.42887 11.608446,54.624763 -19.808717,49.459437 c -20.207038,-3.3227 -43.313601,-3.791886 -59.59661,5.498023 -15.666306,8.957214 -20.729253,24.376417 -23.454693,38.69517 -2.04408,10.7785 -3.25262,22.11579 2.36238,32.20332 3.894189,7.00368 10.812228,12.88984 15.596681,19.59923 16.641093,23.33993 4.878933,52.12244 -13.159698,74.91214 -8.454833,10.68896 -18.272383,20.90016 -24.802493,32.27157 -6.53012,11.3714 -9.54899,24.41907 -3.83949,36.02932 5.66474,11.51642 19.15765,20.14948 33.769589,26.22758 29.686403,12.3439 64.65459,15.87985 98.7822629,17.88031 75.5066201,4.43168 151.4210581,2.51228 227.1265981,0.59287 28.02032,-0.71231 56.15998,-1.43315 83.72273,-5.14826 15.30822,-2.06443 31.11377,-5.3402 42.22441,-13.22255 14.10463,-10.03634 17.60095,-27.03373 8.15146,-39.61648 -15.8553,-21.10917 -59.68116,-26.35553 -70.77689,-49.00875 -6.1024,-12.46759 0.16413,-26.3598 9.02677,-37.92314 19.01841,-24.81147 50.89312,-46.57324 52.57414,-74.93347 C 359.05227,94.04077 343.72913,74.535369 320.0357,65.31797 295.1984,55.656976 260.76237,56.872597 242.4502,72.863357 223.57106,89.31051 190.41817,95.64454 162,94.8 Z" opacity="0.5" fill="#3e64ff" />
  </svg>
);

const DesktopBlob = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="-150 20 600 350"
    preserveAspectRatio="none"
  >
    <path d="M 162,94.8 C 129.81195,93.8403 99.15574,84.930003 69.877152,75.179436 40.59857,65.42887 11.608446,54.624763 -19.808717,49.459437 c -20.207038,-3.3227 -43.313601,-3.791886 -59.59661,5.498023 -15.666306,8.957214 -20.729253,24.376417 -23.454693,38.69517 -2.04408,10.7785 -3.25262,22.11579 2.36238,32.20332 3.894189,7.00368 10.812228,12.88984 15.596681,19.59923 16.641093,23.33993 4.878933,52.12244 -13.159698,74.91214 -8.454833,10.68896 -18.272383,20.90016 -24.802493,32.27157 -6.53012,11.3714 -9.54899,24.41907 -3.83949,36.02932 5.66474,11.51642 19.15765,20.14948 33.769589,26.22758 29.686403,12.3439 64.65459,15.87985 98.7822629,17.88031 75.5066201,4.43168 151.4210581,2.51228 227.1265981,0.59287 28.02032,-0.71231 56.15998,-1.43315 83.72273,-5.14826 15.30822,-2.06443 31.11377,-5.3402 42.22441,-13.22255 14.10463,-10.03634 17.60095,-27.03373 8.15146,-39.61648 -15.8553,-21.10917 -59.68116,-26.35553 -70.77689,-49.00875 -6.1024,-12.46759 0.16413,-26.3598 9.02677,-37.92314 19.01841,-24.81147 50.89312,-46.57324 52.57414,-74.93347 C 359.05227,94.04077 343.72913,74.535369 320.0357,65.31797 295.1984,55.656976 260.76237,56.872597 242.4502,72.863357 223.57106,89.31051 190.41817,95.64454 162,94.8 Z" opacity="0.5" fill="#3e64ff" />
  </svg>
);

export default function Introduction(props) {

  const data = useStaticQuery(
    graphql`
      query {
        introduction {
          greeting
          name
	        role
          descriptions {
            description {
              header
              subheader
            }
          }
        }
      }
    `
  );

  let headers = data.introduction.descriptions.map(({ description }) => description.header);
  let subheaders = data.introduction.descriptions.map(({ description }) => description.subheader);

  let typingSpeed = 35;
  let deleteSpeed = 10;
  let pauseDelay = 7000;

  const [headerEnd, setHeaderEnd] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const endHeader = () => {
    setHeaderEnd(true);
  };


  // Delay rendering content until component is mounted to prevent flash
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Responsive text scaling based on viewport height
  useEffect(() => {
    const calculateTextScale = () => {
      if (!textRef.current) return;

      const viewportHeight = window.innerHeight;
      const textElement = textRef.current;
      const textRect = textElement.getBoundingClientRect();
      const textTop = textRect.top;

      // Calculate available height from top of text to bottom of viewport
      const availableHeight = viewportHeight - textTop;
      const currentTextHeight = textRect.height;

      // If text takes up more than 65% of available height, scale it down
      const maxHeightPercent = 0.65;
      const maxHeight = availableHeight * maxHeightPercent;

      if (currentTextHeight > maxHeight) {
        const scale = maxHeight / currentTextHeight;
        setTextScale(Math.max(scale, 0.6)); // Minimum scale of 0.6
      } else {
        setTextScale(1);
      }
    };

    calculateTextScale();
    window.addEventListener('resize', calculateTextScale);

    return () => window.removeEventListener('resize', calculateTextScale);
  }, [headerEnd]); // Recalculate when headerEnd changes

  // Trigger entrance animations
  useEffect(() => {
    const timer = setTimeout(() => setEntranceComplete(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let header = document.getElementById('typewriter1');
    let subheader = document.getElementById('typewriter2');
    let typewriter1 = new Typewriter(header, {
      loop: false,
      delay: typingSpeed,
      deleteSpeed: deleteSpeed,
      autoStart: true,
      cursor: '|',
      cursorClassName: 'typewriter-cursor',
    }
    );

    let typewriter2 = new Typewriter(subheader, {
      loop: false,
      delay: typingSpeed,
      cursor: '|',
      cursorClassName: 'typewriter-cursor',
    }
    );

    function subtyping(string: string) {
      typewriter2
        .typeString(string)
        .start();
    }

    function subdelete() {
      typewriter2
        .deleteAll(1)
        .start();
    }

    // 1. Technical Typewriter Chain
    headers.forEach((header: string, i: number) => {
      typewriter1
        .typeString(header)
        .callFunction(() => subtyping(subheaders[i]))
        .pauseFor(pauseDelay)
        .callFunction(subdelete)
        .pauseFor(subheaders[i].length * deleteSpeed)
        .deleteChars(header.length);
    });

    // Signal the transition to the social layer
    typewriter1
      .callFunction(endHeader) // Toggles isFinished, hiding this layer
      .start();
  }, []);

  // This effect handles the transition to the final text
  useEffect(() => {
    if (headerEnd) {
      const typewriter3 = new Typewriter('#typewriter3', {
        loop: false,
        delay: typingSpeed, // Your typing speed
        cursor: '|',
        cursorClassName: 'typewriter-cursor',
      });

      typewriter3
        .pauseFor(850) // Wait for the fade-in animation to finish
        .typeString("Find me on social media.")
        .start();
    }
  }, [headerEnd]); // Only runs when headerEnd changes to true


  return (
    <HeroWrap name="Home">
      <Overlay></Overlay>
      <DesktopArrowWrapper>
        <FallingArrow />
      </DesktopArrowWrapper>
      <MobileArrowWrapper>
        <FallingArrow />
      </MobileArrowWrapper>

      <MobileSvgWrapper>
        <motion.div
          initial={{ opacity: 0, scale: HERO_TIMING.portrait.scaleFrom }}
          animate={{ opacity: 1, scale: HERO_TIMING.portrait.scaleTo }}
          transition={{
            duration: HERO_TIMING.portrait.duration / 1000,
            delay: HERO_TIMING.portrait.delay / 1000,
            ease: EASING,
          }}
        >
          <MobileHeadshotContainer>
            <StyledMobileBlob />
            <MobileHeadshotImage src="/mobile-headshot.webp" alt="Casey Key" />
          </MobileHeadshotContainer>
        </motion.div>
      </MobileSvgWrapper>

      <ResumeButtonWrapper $isVisible={true} className="container position-absolute start-50 translate-middle-x resume-responsive-container">
        <div className="row justify-content-center-mobile">
          <div className="col-6-responsive d-flex justify-content-center">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={{ delay: HERO_TIMING.cta.delay / 1000 }}
              variants={fadeInUpVariants}
            >
              <PrimaryButton
                id="resume"
                onClick={(e) => {
                  e.preventDefault();
                  // Fire custom event to signal Experience section to use staggered timing
                  window.dispatchEvent(new CustomEvent('experience-scroll-trigger'));
                  const Scroll = require('react-scroll');
                  Scroll.scroller.scrollTo('Experience', { smooth: true, offset: 40, delay: 0 });
                }}
              >
                View Experience
              </PrimaryButton>
            </motion.div>
          </div>
        </div>
      </ResumeButtonWrapper>

      {/* Desktop illustration - positioned outside container, centered at 75% viewport width */}
      <DesktopIllustrationPositioner>
        <motion.div
          initial={{ opacity: 0, scale: HERO_TIMING.portrait.scaleFrom }}
          animate={{ opacity: 1, scale: HERO_TIMING.portrait.scaleTo }}
          transition={{
            duration: HERO_TIMING.portrait.duration / 1000,
            delay: HERO_TIMING.portrait.delay / 1000,
            ease: EASING,
          }}
        >
          <DesktopHeadshotContainer>
            <StyledDesktopBlob />
            <DesktopHeadshotImage src="/headshot.webp" alt="Casey Key" />
          </DesktopHeadshotContainer>
        </motion.div>
      </DesktopIllustrationPositioner>

      <AnimatedContent>
        <Container>
          <Row className="g-0 justify-content-center align-items-center" xs="1" md="2">
            <Col md className="text-center">
              <Text ref={textRef} style={{ transform: `scale(${textScale})`, transformOrigin: 'top center' }}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  custom={{ delay: HERO_TIMING.hello.delay / 1000 }}
                  variants={fadeInUpVariants}
                >
                  <Subheader>{data.introduction.greeting}</Subheader>
                </motion.div>
                <Slider $isFinished={headerEnd}>
                  <motion.h2
                    className="subheader"
                    initial="hidden"
                    animate="visible"
                    custom={{ delay: HERO_TIMING.intro.delay / 1000 }}
                    variants={fadeInUpVariants}
                  >
                    I'm <span id="name">{data.introduction.name}</span>, the {data.introduction.role}.
                  </motion.h2>

                  <motion.div
                    id="typewriter"
                    initial="hidden"
                    animate="visible"
                    custom={{ delay: HERO_TIMING.typewriter.delay / 1000 }}
                    variants={fadeInUpVariants}
                    style={{ transition: 'none' }} // Disable CSS transitions to prevent conflicts
                  >
                    {/* THIS LAYER IS VISIBLE FIRST */}
                    <div className="view-layer tech-view">
                      <h2 className="subheader">Focused on...</h2>
                      <h2 id="typewriter1" className="subheader"></h2>
                      <h2 id="typewriter2" className="subheader"></h2>
                    </div>

                    {/* THIS LAYER FADES IN AFTER A DELAY */}
                    <div className="view-layer social-view">
                      <h2 id="typewriter3" className="subheader"></h2>
                      <SocialStyle $isFinished={headerEnd}>
                        <Socials />
                      </SocialStyle>
                    </div>
                  </motion.div>
                </Slider>

              </Text>
            </Col>
            {/* Empty right column to maintain original layout structure */}
            <Col md className="d-none d-md-block"></Col>
          </Row>
        </Container>
      </AnimatedContent>
    </HeroWrap>
  );
}


interface SocialStyleProps {
  $isFinished?: boolean;
}

/* Remove the <{ isVisible: boolean }> prop requirement */
const SocialStyle = styled.div<SocialStyleProps>`
  opacity: ${(props) => (props.$isFinished ? 1 : 0)};
  transform: ${(props) => (props.$isFinished ? 'translateY(0)' : 'translateY(10px)')};
  
  /* 0.6s duration, but wait 1.8s so the text types first */
  transition: opacity 0.6s ease-out 1.8s, transform 0.6s ease-out 1.8s;
  
  .ftco-footer-social {
    li {
      list-style: none;
      margin: 0 10px; /* Centered spacing */
      display: inline-block;
      
      a {
        height: 40px;
        width: 40px;
        display: block;
        background: rgba(from ${props => props.theme.white} r g b / 10%);
        border-radius: 50%;
        position: relative;
        transition: background 0.3s ease; /* Hover transition only */

        svg {
          position: absolute;
          font-size: 24px; /* Matches LinkedIn/Github visual weight */
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        &:hover {
          color: ${props => props.theme.black};
          background: rgba(from ${props => props.theme.black} r g b / 10%);
        }
      }
    }
  }
  
  /* Responsive social icons */
  @media (max-width: 767.98px) {
    .ftco-footer-social {
      li {
        margin: 0 6px;
        
        a {
          height: 32px;
          width: 32px;
          
          svg {
            font-size: 18px;
          }
        }
      }
    }
  }
  
  @media (max-height: 600px) {
    .ftco-footer-social {
      li {
        margin: 0 4px;
        
        a {
          height: 28px;
          width: 28px;
          
          svg {
            font-size: 16px;
          }
        }
      }
    }
  }
`;

const MobileArrowWrapper = styled.div`
  display: none;
  @media (max-width: 767.98px) {
    position: absolute;
    /* Position so triangle top edge (at +35px from container top) aligns with Overlay bottom (50vh) */
    top: calc(50vh - 35px);
    left: 0;
    right: 0;
    justify-content: center;
    z-index: 20;
    display: flex;
  }
`;

const MobileSvgWrapper = styled.div`
  display: none;

  @media (max-width: 767.98px) {
    display: flex;
    position: absolute;
    bottom: 2vh;
    left: 0;
    right: 0;
    justify-content: center;
    z-index: 5;
    overflow: visible !important;
  }
`;

const DesktopArrowWrapper = styled.div`
  position: absolute;
  top: 65%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 20;
  transform: translateY(-50%);
  @media (max-width: 767.98px) {
    display: none;
  }
`;

const AnimatedContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  /* Force the container to ignore injected inline heights */
  height: auto !important;
  min-height: 0 !important;

  /* Ensure the internal Reactstrap container also stays fluid */
  .container {
    height: auto !important;
  }

  @media (max-width: 767.98px) {
    /* Position text content in the blue area (top ~42%) and center it */
    flex: 0 0 auto !important;
    height: 42vh !important;
    max-height: 42vh !important;
    justify-content: center !important;
    overflow: hidden !important;
    padding-top: 0 !important;

    /* Hide illustration in the text area - show separately */
    .illustration-col {
      display: none !important;
    }
  }
`;

// Desktop illustration positioner - places illustration at center of right half (75% viewport width)
const DesktopIllustrationPositioner = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    position: absolute;
    top: 54%;
    left: 75%;
    min-width: 337px;
    transform: translate(-50%, -50%);
    z-index: 10;
    pointer-events: none;
    transition: top 0.3s ease-in-out;
  }

  @media (min-width: 768px) and (max-width: 1580px) {
    top: 58%;
  }
`;

const ResumeButtonWrapper = styled.div<{ $isVisible?: boolean }>`
  @media (min-width: 768px) {
    #resume {
      margin-top: 1rem;
    }
  }
  z-index: 100;
  height: 0;

  /* Fade-in animation: 0.3s after the slide-up animation completes */
  /* Slide-up: 500ms duration + 100ms delay = 600ms finish */
  /* Resume fade-in: 800ms delay, 400ms duration */
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 400ms ease-out 800ms;

  @media (min-width: 768px) {
    margin-top: 1rem;
  }
`;

// Mobile headshot + blob components
const MobileHeadshotContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  overflow: visible !important;
  right: 17px;
`;

const StyledMobileBlob = styled(MobileBlob)`
  position: absolute;
  bottom: 28px;
  left: 58%;
  transform: translateX(-50%);
  /* Width: same as headshot (78%) + 3rem */
  width: calc(68% + 3rem);
  /* Height: will be determined by the aspect ratio, approximately headshot height + 2rem */
  height: 71%;
  z-index: 0;
  overflow: visible !important;
  display: block;
`;

const MobileHeadshotImage = styled.img`
  position: relative;
  z-index: 1;
width: 76%;
  height: auto;
  object-fit: cover;
  border-radius: 16px;
  
  @media (max-height: 836px) {
    width: 58%;
  }
`;

// Desktop headshot + blob components
const DesktopHeadshotContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  overflow: visible !important;
  bottom: 35px;
`;

const StyledDesktopBlob = styled(DesktopBlob)`
  position: absolute;
  bottom: 62px;
  left: 56%;
  transform: translateX(-50%);
  /* Width: same as headshot (100%) + 4rem */
  width: calc(100% + 4rem);
  /* Height: will be determined by the aspect ratio, approximately headshot height + 2rem */
  height: 89%;
  z-index: 0;
  overflow: visible !important;
  display: block;
`;

const DesktopHeadshotImage = styled.img`
  position: relative;
  z-index: 1;
  width: 85%;
  max-width: 450px;
  height: auto;
  object-fit: cover;
  border-radius: 24px;
`;
