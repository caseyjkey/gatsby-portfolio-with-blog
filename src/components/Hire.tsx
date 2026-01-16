import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import { Section, Image, PrimaryButton } from './style.ts'
import bg from '../images/bg_1.jpg'
import { motion } from 'motion/react'
import { fadeInUpVariants, getRootMargin, getThreshold } from '../animations'
import { ANIMATION_CONFIG } from '../animations/config'

export default function HireMe({status}) {
  const [visible, setVisible] = useState(false);

  // Check if mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: isMobile() ? getThreshold(true) : 0,
        rootMargin: getRootMargin(isMobile()),
      }
    );

    const hireSection = document.getElementById('hire-section');
    if (hireSection) {
      observer.observe(hireSection);
    }

    return () => observer.disconnect();
  }, []);

  var Scroll = require('react-scroll');
  var scroller = Scroll.scroller;

  return (
    <motion.div
      id="hire-section"
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={fadeInUpVariants}
    >
      <HireMeWrapper className="ftco-hireme" style={{backgroundImage: "url(" + bg + ")"}}>
        <div className="overlay"></div>
        <Container>
          <Row className="row justify-content-center">
              <Col md={7} className="text-center">
                <h2>I'm <span>{status}</span> for freelancing</h2>
                {status && <p>Let's get in contact! I can turn your concept into reality.</p>}
                {status && <p className="mb-0"><PrimaryButton className="py-3 px-5" onClick={() => scroller.scrollTo('Contact', {smooth: true})}>Hire me</PrimaryButton></p>}
              </Col>
          </Row>
        </Container>
      </HireMeWrapper>
    </motion.div>
  );
}

const HireMeWrapper = styled.section`
  ${Section}
  ${Image}
  background: $primary;
  z-index: 0;
  position: relative;
  .overlay{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    background: ${(props) => props.theme.primaryColor};
    opacity: .7;
  }
  h2{
    color: ${(props) => props.theme.white};
    font-size: 40px;
    font-weight: 900;
    span{
      color: ${(props) => props.theme.secondaryColor};
    }
  }
  p{
    color: rgba(255,255,255,.9);
  }
`;
