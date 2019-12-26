import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { ThemeProvider } from 'styled-components'

import { theme } from '../style.js'
import { Overlay, Text, Subheader, Header, Slider, Mouse } from './style.js'
  
import FallingArrow from './Mouse'

export default class Introduction extends Component  {
	render() {
		return (
      <ThemeProvider theme={theme}>
        <section className="hero-wrap js-fullheight">
          <Overlay></Overlay>
          <Container>
            <Row noGutters className="js-fullheight justify-content-center align-items-center">
              <Col lg="8" md="6" className="ftco-animate d-flex align-items-center">
                <Text className="text-center">
                  <Subheader>Hey! I am</Subheader>
                  <Header>Casey Key</Header>
                  <Slider>I'm a&nbsp;
                    <span className="txt-rotate" 
                          data-period={2000} 
                          data-rotate='[ "Hacker.", "Coder.", "Maker.", "Entrepreneur." ]' />
                  </Slider>
                </Text>
              </Col>
            </Row>
          </Container>
          <FallingArrow />
        </section>
      </ThemeProvider>
    );
  }
}