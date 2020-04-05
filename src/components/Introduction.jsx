import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import { HeroWrap, Overlay, Text, Subheader, Header, Slider } from './Introduction/style.js'
import FallingArrow from './Introduction/Mouse'
import Socials from './Social'
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
  let headers = data.introduction.descriptions.map(({ description }) => description.header);
  let subheaders = data.introduction.descriptions.map(({ description }) => description.subheader);

  let typingSpeed = 50;
  let deleteSpeed = 10;
  let pauseDelay = 4000;

  const [headerEnd, setHeaderEnd] = useState(false);
  const endHeader = () => setHeaderEnd(true);

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
      typewriter1
          .typeString(header)
          .start()
          .callFunction(() => subtyping(subheaders[i]))
          .pauseFor(pauseDelay)
          .callFunction(subdelete)
          .pauseFor(subheaders[i].length * deleteSpeed)
          .deleteChars(header.length);
        
    });

    typewriter1
        .typeString("on social media.")
        .start()
        .callFunction(endHeader);
  }, []);


  /* End of Typewriter component */
  return (  
    <HeroWrap name="Home">
      <Overlay></Overlay>
      <Animated animationIn="fadeInUp" animationInDuration={500} animationInDelay={200} >
        <Container>
          <Row noGutters className="js-fullheight justify-content-center align-items-center">
            <Col lg="8" md="6" className="align-items-center">
                <Text className="text-center">
                  <Subheader>{data.introduction.greeting}</Subheader>
                  <Header>{data.introduction.name}</Header>
                  <Slider>
                    I'm&nbsp;
                    <span id="typewriter1" className="header"></span><br/>
                    {!headerEnd &&
                      <span id="typewriter2" className="subheader"></span>
                    }
                    {headerEnd &&
                      <Animated animationIn={"fadeInUp"} isVisible={headerEnd}>
                        <SocialStyle>
                          <Socials/>
                        </SocialStyle>
                      </Animated>
                    }
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

const SocialStyle = styled.div`
  .ftco-footer-social {
    li {
      list-style: none;
      margin: 0 10px 0 0;
      display: inline-block;
      a {
        height: 40px;
        width: 40px;
        display: block;
        float: left;
        background: rgba(${props => props.theme.white}, .1);
        border-radius: 50%;
        position: relative;
        svg {
          position: absolute;
          font-size: 26px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        &:hover {
          color: ${props => props.theme.black};
        }
      }
    }
`;
