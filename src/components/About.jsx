import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from './style.js'
import { AboutSection, AboutImage, Counter, Description } from './About/style.js'
import Headshot from "./About/images/about.png"
import { Waypoint } from  'react-waypoint'
import { Animated } from 'react-animated-css'
import CountUp from 'react-countup'
import { FiBookOpen, FiMusic } from 'react-icons/fi'
import { GiBackpack } from 'react-icons/gi'
import { FaLaptopCode } from 'react-icons/fa'

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: {info: false, counter: false},
      github: {
        isLoaded: false,
        days: 0,
      }
    };

    this.onEnter = this.onEnter.bind(this);
  }

  componentDidMount() {
    fetch("https://8370nk0aoa.execute-api.us-east-2.amazonaws.com/api/streak/caseykey.github.io,git-analytics-api,react-read-more-read-less", {
      method: "GET"
    })
      .then( res => res.json() )
      .then(
        (result) => {
          let github = {isLoaded: true, days: result.streak.days};
          this.setState({ github: github });
        },
        (error) => {
          let github = {isLoaded: true, error};
          this.setState({ github: github });
        }
      )
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
                      My dream is to travel the world as a tech entrepreneur. 
                      My focus will be in cyberseurity, teaching, and apps for education, finance, and music. 
                      After starting successful businesses, I want to give back by providing jobs, scholarships, 
                      and education with a focus on at-risk youth.
                      <br /><br />
                      When I'm not coding, I enjoy skateboarding, sports, car tuning, 
                      and building sound systems. 
                      I'm happy to help anyone learn more about technology.
                    </Description>
                    <ul className="about-info mt-4 px-md-0 px-2">
                      <li><GiBackpack /> <span>CS and ENTR @ CSU, FoCo</span></li>
                      <li><FiBookOpen /> <span><i>Hacking: The Art of Exploitation</i></span></li>
                      <li><FiMusic /> <span>"Good News" by Mac Miller</span></li>
                      <li><FaLaptopCode /> <span>Building a blog with Gatsby</span></li>
                    </ul>
                  </Col>
                </Animated>
              </Row>

              <Animated animation="fadeInUp" isVisible={counterVisible}>
                <Counter className="mt-md-3">
                    {counterVisible && 
                      ((this.state.github.isLoaded && 
                        <p className="mb-4">
                          <CountUp className="number" delay={0.3} duration={3} end={this.state.github.days}>0</CountUp><span>&nbsp;consecutive days of coding</span> 
                        </p>
                      ) || <p className="mb-4">Loading Github data...</p>)
                    }
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