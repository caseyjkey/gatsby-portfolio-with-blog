import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { ThemeProvider } from 'styled-components'
import { theme } from './style.js'
import { HeroWrap, Overlay, Text, Subheader, Header, Slider } from './Introduction/style.js'
import FallingArrow from './Introduction/Mouse'
import { Animated } from 'react-animated-css'

export default function Introduction(props) {
  return (  
    <HeroWrap className="js-fullheight" name="Home">
      <Overlay></Overlay>
      <Animated animationIn="fadeInUp" animationInDuration={500} animationInDelay={200} >
        <Container>
          <Row noGutters className="js-fullheight justify-content-center align-items-center">
            <Col lg="8" md="6" className="align-items-center">
                <Text className="text-center">
                  <Subheader>Hey! I am</Subheader>
                  <Header>Casey Key</Header>
                  <Slider>I'm a&nbsp;
                    <span className="txt-rotate" 
                          data-period={700} 
                          data-rotate='[ "a developer.", "a producer.", "an artist.", "a maker.", "a leader." ]' />
                  </Slider>
                </Text>
            </Col>
          </Row>
        </Container>
      </Animated>
      <FallingArrow />
    </HeroWrap>
  );
}