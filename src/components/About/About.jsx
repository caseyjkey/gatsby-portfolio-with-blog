import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'
import { AboutSection, AboutImage } from './style.js'
import Headshot from "./images/about.jpg"

export default class About extends Component {
  render() { 
    return (
      <ThemeProvider theme={theme}>
        <AboutSection>
          <Container>
            <Row noGutters className="d-flex">
              <Col md-6 lg-6 className="d-flex">
                <AboutImage style={{backgroundImage: this.imageURL(Headshot)}} 
                            className="d-flex align-items-stretch" />
              </Col> 
                <div className="row justify-content-start pb-3">
                  <div className="col-md-12 heading-section ftco-animate">
                    <h1 className="big">About</h1>
                    <h2 className="mb-4">About Me</h2>
                    <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
                    <ul className="about-info mt-4 px-md-0 px-2">
                      <li className="d-flex"><span>Name:</span> <span>Ronaldo Fredrickson</span></li>
                      <li className="d-flex"><span>Date of birth:</span> <span>November 28, 1989</span></li>
                      <li className="d-flex"><span>Address:</span> <span>San Francisco CA 97987 USA</span></li>
                      <li className="d-flex"><span>Zip code:</span> <span>1000</span></li>
                      <li className="d-flex"><span>Email:</span> <span>ronaldo@gmail.com</span></li>
                      <li className="d-flex"><span>Phone: </span> <span>+1-2234-5678-9-0</span></li>
                    </ul>
                  </div>
                </div>
                <div className="counter-wrap ftco-animate d-flex mt-md-3">
                  <div className="text">
                    <p className="mb-4">
                      <span className="number" data-number={120}>0</span>
                      <span>Project complete</span>
                    </p>
                    <p><a href="#" className="btn btn-primary py-3 px-3">Download CV</a></p>
                  </div>
                </div>
            </Row>
          </Container>
        </AboutSection>
      </ThemeProvider>
    );
  }

  imageURL(image) {
    return "url(" + Headshot + ")";
  }
}