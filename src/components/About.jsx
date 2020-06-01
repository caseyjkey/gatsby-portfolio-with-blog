import React, { useEffect, useState, lazy } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from './style.js'
import { AboutSection, AboutImage, Counter, Description } from './About/style.js'
import Img from 'gatsby-image'
import Activity from './About/Activity.jsx'
import { graphql, useStaticQuery } from 'gatsby'
import { Waypoint } from  'react-waypoint'
import { Animated } from 'react-animated-css'
// For Github streak
// import CountUp from 'react-countup'

export default function About(props) {

  const [visible, setVisible] = useState({info: false, counter: false});
  const makeVisible = (section) => setVisible({...visible}[section] = true);

  // const [github, setGithub] = useState({streak: NaN});

  
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
        about {
          image {
            childImageSharp {
              fluid(maxWidth: 555, maxHeight: 735) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          bio
          activities {
            activity {
              description
              icon {
                name
                type
              }
            }
          }
        }
      }
  `);

  // Lazyload the an icon component
  // [param] icon {name: String, type: String}
  // [return] Component
  function loadIcon(icon) {
    let moduleName = 'react-icons/' + icon.type;
    if (icon.type === 'gi') {
      return lazy(() => 
        import('react-icons/gi').then(module => 
          ({default: module[icon.name]})
        )
      );
    }
    else if (icon.type === 'fi') {
      return lazy(() => 
        import('react-icons/fi').then(module => 
          ({default: module[icon.name]})
        )
      );
    }
    else if (icon.type === 'fa') {
      return lazy(() => 
        import('react-icons/fa').then(module => 
          ({default: module[icon.name]})
        )
      );
    }
  }

  return (
    <AboutSection name="About">
      <Container>
        <Row noGutters>
          <Col lg="6" md="6" className="d-flex">
            <AboutImage>
                <Img fluid={data.about.image.childImageSharp.fluid} />
            </AboutImage>
          </Col> 

          <Col md="6" lg="6" className="pl-md-5 py-5">
            <Row className="justify-content-start pb-3">
              <Animated animationIn="fadeInUp" isVisible={visible.info} style={{width: "100%"}}>
                <Col className="col-md-12 heading-section">
                  <Heading className="mb-4">About Me</Heading>
                  <Waypoint onEnter={() => makeVisible("info")}></Waypoint>

                  <Description>
                    <div dangerouslySetInnerHTML={{ __html: data.about.bio}} />
                  </Description>
                  <ul className="about-info mt-4 px-md-0 px-2">
                    {data.about.activities.map((activity, index) => {
                      return (
                        <li>
                          <Activity description={activity.activity.description}
                                    Icon={loadIcon(activity.activity.icon)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </Col>
              </Animated>
            </Row>
            {/*
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
              </Counter>
            </Animated>
            <Waypoint onEnter={() => makeVisible("counter") } />
            */}
          </Col>
        </Row>
      </Container>
    </AboutSection>
  );
}