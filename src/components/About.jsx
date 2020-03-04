import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from './style.js'
import { AboutSection, AboutImage, Counter, Description } from './About/style.js'
import Img from 'gatsby-image'
import { graphql, useStaticQuery } from 'gatsby'
import { Waypoint } from  'react-waypoint'
import { Animated } from 'react-animated-css'
import CountUp from 'react-countup'
import { FiBookOpen, FiMusic } from 'react-icons/fi'
import { GiBackpack } from 'react-icons/gi'
import { FaLaptopCode } from 'react-icons/fa'

export default function About(props) {

  const [visible, setVisible] = useState({info: false, counter: false});
  const makeVisible = (section) => setVisible({...visible}[section] = true);

  const [github, setGithub] = useState({streak: NaN});

  
  useEffect(() => {
    /* Commenting this out to see if it is holding up the page
    fetch("https://8370nk0aoa.execute-api.us-east-2.amazonaws.com/api/streak/caseykey.github.io,git-analytics-api,react-read-more-read-less", {
      method: "GET"
    })
      .then( res => res.json() )
      .then(
        (result) => setGithub({days: result.streak.days}),
        (error) => setGithub(error)
      ) */
  }, []);

  const data = useStaticQuery(
    graphql`
      query {
        fileName: file(relativePath: {eq: "about/aboutPic.png"}) {
          size
          childImageSharp {
            fluid(maxWidth: 555, maxHeight: 735) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
  `);

  return (
    <AboutSection name="About">
      <Container>
        <Row noGutters>
          <Col lg="6" md="6" className="d-flex">
            <AboutImage>
                <Img fluid={data.fileName.childImageSharp.fluid} />
            </AboutImage>
          </Col> 

          <Col md="6" lg="6" className="pl-md-5 py-5">
            <Row className="justify-content-start pb-3">
              <Animated animationIn="fadeInUp" isVisible={visible.info} style={{width: "100%"}}>
                <Col className="col-md-12 heading-section">
                  <Heading className="mb-4">About Me</Heading>
                  <Waypoint onEnter={() => makeVisible("info")}></Waypoint>

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
                    <li><FiBookOpen /> <span><i>Man's Search for Meaning</i></span></li>
                    <li><FiMusic /> <span>"Good News" by Mac Miller</span></li>
                    <li><FaLaptopCode /> <span>Working on this site</span></li>
                  </ul>
                </Col>
              </Animated>
            </Row>

            <Animated animation="fadeInUp" isVisible={visible.counter}>
              <Counter className="mt-md-3">
                  {visible.counter && 
                    ((Number.isInteger(github.streak) && 
                      (this.state.github.days > 19 && 
                      <p className="mb-4">
                        <CountUp className="number" delay={0.3} duration={3} end={github.streak}>0</CountUp><span>&nbsp;consecutive days of coding</span> 
                      </p>
                    ) || <div></div>) || <p className="mb-4">Loading Github data...</p>)
                  }
                {/* <p><Button color="primary" className="py-3 px-3">Download CV</Button></p> */}
              </Counter>
            </Animated>
            
            <Waypoint onEnter={() => makeVisible("counter") } />
          </Col>
        </Row>
      </Container>
    </AboutSection>
  );
}