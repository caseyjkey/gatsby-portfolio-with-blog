import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'
import { Overlay, Text, Subheader, Header, Slider, Mouse } from './style.js'
import FallingArrow from './Mouse'
import { Animated } from 'react-animated-css'

export default class Introduction extends Component  {
  constructor(props) {
    super(props);
    let visible = false;
  }

	render() {
		return (
      
      <ThemeProvider theme={theme}>
        <section className="hero-wrap js-fullheight">
          <Overlay></Overlay>
          <Animated animationIn="fadeInUp" animationInDuration={500} animationInDelay={200} >
            <Container>
              <Row noGutters className="js-fullheight justify-content-center align-items-center">
                <Col lg="8" md="6" className="d-flex align-items-center">
                    <Text className="text-center">
                      <Subheader>Hey! I am</Subheader>
                      <Header>Casey Key</Header>
                      <Slider>I'm a&nbsp;
                        <span className="txt-rotate" 
                              data-period={2000} 
                              data-rotate='[ "Hacker.", "Coder.", "Maker.", "Leader." ]' />
                      </Slider>
                    </Text>
                </Col>
              </Row>
            </Container>
          </Animated>
          <FallingArrow />
        </section>
      </ThemeProvider>
    );
  }
}