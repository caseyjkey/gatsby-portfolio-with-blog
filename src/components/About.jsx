import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import { Heading } from './style.js'
import { AboutSection, AboutImage, Counter, Description } from './About/style.js'
import Headshot from "./About/images/about.png"
import { Waypoint } from  'react-waypoint'
import { Animated } from 'react-animated-css'
import CountUp from 'react-countup'

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: {info: false, counter: false}
    };

    this.onEnter = this.onEnter.bind(this);
  }


  onEnter(section) {
    let visibleCopy = this.state.visible;
    visibleCopy[section] = true;

    this.setState({visible: visibleCopy});
  };

  render() { 
    let infoVisible = this.state.visible.info;
    let counterVisible = this.state.visible.counter;

    return (
      <AboutSection name="About">
        <Container>
          <Row noGutters>
            <Col lg="6" md="6" className="d-flex">
              <AboutImage style={{backgroundImage: this.imageURL(Headshot)}} />
            </Col> 

            <Col md="6" lg="6" className="pl-md-5 py-5">
              <Row className="justify-content-start pb-3">
                <Animated animationIn="fadeInUp" isVisible={infoVisible} style={{width: "100%"}}>
                  <Col className="col-md-12 heading-section">
                    <Heading className="mb-4">About Me</Heading>
                    <Waypoint onEnter={() => this.onEnter("info")}></Waypoint>

                    <Description>
                      The potential effect of technology on society thrills me!
                      My dream is to become a tech entrepreneur. 
                      I am confident my rigorous study of Computer Science will help me enhance people's lives.
                      My focus will be in cyberseurity, teaching, and apps for education, finance, or music. 
                      After starting successful businesses, I want to give back by providing jobs, scholarships, and education with a focus on at-risk under-represented youth.
                      <br /><br />
                      When I'm not coding, I enjoy skateboarding, sports, metalsmithing, and building sound systems or other electronics. 
                      I'm happy to help anyone learn more about technology.
                    </Description>
                    <ul className="about-info mt-4 px-md-0 px-2">
                      <li className="d-flex"><span>Name:</span> <span>Casey Key</span></li>
                      <li className="d-flex"><span>Location:</span> <span>Fort Collins, CO, USA</span></li>
                      <li className="d-flex"><span>Email:</span> <span>casey.key@protonmail.com</span></li>
                      <li className="d-flex"><span>Phone: </span> <span>+‪1 (331) 222-7919‬</span></li>
                    </ul>
                  </Col>
                </Animated>
              </Row>

              <Animated animation="fadeInUp" isVisible={counterVisible}>
                <Counter className="mt-md-3">
                  <p className="mb-4">
                    {counterVisible && 
                      <CountUp className="number" delay={0.3} duration={3} end={10}>0</CountUp>
                    }
                    <span>&nbsp;Projects complete</span>
                  </p>
                  {/* <p><Button color="primary" className="py-3 px-3">Download CV</Button></p> */}
                </Counter>
              </Animated>
              
              <Waypoint onEnter={() => this.onEnter("counter") } />
            </Col>
          </Row>
        </Container>
      </AboutSection>
    );
  }

  imageURL(image) {
    return "url(" + Headshot + ")";
  }
}