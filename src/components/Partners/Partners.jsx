import React, { Component } from 'react'
import { Container, Row, Col, Media } from 'reactstrap'
import { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'
import { PartnersSection } from './style.js'

import Partner1 from './images/partner-1.png'
import Partner2 from './images/partner-2.png'
import Partner3 from './images/partner-3.png'
import Partner4 from './images/partner-4.png'
import Partner5 from './images/partner-5.png'


export default class Partners extends Component {
  
  render() {
    return (
      <ThemeProvider theme={theme}>
        <PartnersSection>
          <Container>
            <Row>
              <Col sm>
                <Media object className="img-fluid partner" src={Partner1} alt="Colorlib Template" />
              </Col>
              <Col sm>
                <Media object className="img-fluid partner" src={Partner2} alt="Colorlib Template" />
              </Col>
              <Col sm>
                <Media object className="img-fluid partner" src={Partner3} alt="Colorlib Template" />
              </Col>
              <Col sm>
                <Media object className="img-fluid partner" src={Partner4} alt="Colorlib Template" />
              </Col>
              <Col sm>
                <Media object className="img-fluid partner" src={Partner5} alt="Colorlib Template" />
              </Col>
            </Row>
          </Container>
        </PartnersSection>
      </ThemeProvider>
    );
  }
}