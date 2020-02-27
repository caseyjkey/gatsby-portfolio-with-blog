import React, { useEffect } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { ThemeProvider } from 'styled-components'
import { theme } from './style.js'
import { HeroWrap, Overlay, Text, Subheader, Header, Slider } from './Introduction/style.js'
import FallingArrow from './Introduction/Mouse'
import { Animated } from 'react-animated-css'
import { graphql, useStaticQuery } from 'gatsby'
import Typewriter from 'typewriter-effect/dist/core'

export default function Introduction(props) {
  const data = useStaticQuery(
    graphql`
      query {
        introduction {
          greeting
          name
          descriptions {
            description
            example
          }
        }
      }
    `
  );
 
  /* Refactor this into a seperate typewriter component */
  let headers = data.introduction.descriptions.map(({ description }) => description);
  let subheaders = data.introduction.descriptions.map(item => item.example);
  
  

  let typingSpeed = 10;
  let deleteSpeed = 1;
  let pauseDelay = 3000;

  

  
  useEffect(() => {
    let header = document.getElementById('typewriter1');
    let subheader = document.getElementById('typewriter2');
    let typewriter1 = new Typewriter(header, {
        loop: false,
        delay: typingSpeed,
        deleteSpeed: deleteSpeed,   
        autoStart: true,
      }
    );
    
    let typewriter2 = new Typewriter(subheader, {
        loop: false,
        delay: typingSpeed
      }
    );

    function subtyping(string) {
      typewriter2
          .typeString(string)
          .start();
    }

    function subdelete() {
      typewriter2
          .deleteAll(1)
          .start();
    }

    headers.forEach((header, i) => {
      console.log(header);
      console.log(typewriter1);
      typewriter1
          .typeString(header)
          .start()
          .callFunction(() => subtyping(subheaders[i]))
          .pauseFor(pauseDelay)
          .callFunction(subdelete)
          .pauseFor(subheaders[i].length * deleteSpeed)
          .deleteChars(header.length)
    });

  }, []);

  /* End of Typewriter component */
  return (  
    <HeroWrap className="js-fullheight" name="Home">
      <Overlay></Overlay>
      <Animated animationIn="fadeInUp" animationInDuration={500} animationInDelay={200} >
        <Container>
          <Row noGutters className="js-fullheight justify-content-center align-items-center">
            <Col lg="8" md="6" className="align-items-center">
                <Text className="text-center">
                  <Subheader>{data.introduction.greeting}</Subheader>
                  <Header>{data.introduction.name}</Header>
                  <Slider>I'm&nbsp;
                    <span id="typewriter1" className="header"></span><br/>
                    <span id="typewriter2" className="subheader"></span>
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