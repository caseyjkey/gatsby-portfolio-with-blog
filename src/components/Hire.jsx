
import React, { useState } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import styled from 'styled-components'
import { Section, Image } from './style.js'
import bg from '../data/bg_1.jpg'
import { Animated } from 'react-animated-css'
import { Waypoint } from 'react-waypoint'


export default function HireMe({status}) {
  const [visible, setVisible] = useState(false);
  const makeVisible = () => setVisible(true);
  
  var Scroll = require('react-scroll');
  var scroller = Scroll.scroller;

  return (
    <Animated animationIn={"fadeInUp"} isVisible={visible}>
      <HireMeWrapper className="ftco-hireme" style={{backgroundImage: "url(" + bg + ")"}}>
        <div className="overlay"></div>
        <Container>
          <Row className="row justify-content-center">
              <Col md={7} className="text-center">
                <h2>I'm <span>{status}</span> for freelancing</h2>
                {status && <p>Let's get in contact! I can turn your concept into reality.</p>}
                <Waypoint onEnter={makeVisible}></Waypoint>
                {status && <p className="mb-0"><Button color="primary" className="py-3 px-5" onClick={() => scroller.scrollTo('Contact', {smooth: true})}>Hire me</Button></p>}
              </Col>
          </Row>
        </Container>
      </HireMeWrapper>
    </Animated>
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
  button {
    background: ${(props) => props.theme.primaryColor};
    border: 1px solid ${(props) => props.theme.primaryColor}!important;
    color: ${(props) => props.theme.white}!important;
    cursor: pointer;
    -webkit-border-radius: 40px;
    -moz-border-radius: 40px;
    -ms-border-radius: 40px;
    border-radius: 40px;
    -webkit-box-shadow: 0 24px 36px -11px rgba(0,0,0,.09);
    -moz-box-shadow: 0 24px 36px -11px rgba(0,0,0,.09);
    box-shadow: 0 24px 36px -11px rgba(0,0,0,.09);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
  }
`;