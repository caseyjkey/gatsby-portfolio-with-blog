import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import styled from 'styled-components'
import { HeroWrap, Overlay, Text, Subheader, Header, Slider } from './Introduction/style.js'
import FallingArrow from './Introduction/Mouse'
import Socials from './Social'
import { Animated } from 'react-animated-css'
import { graphql, useStaticQuery } from 'gatsby'
import Resume from './Introduction/resume.pdf';

export default function Introduction(props) {
  const data = useStaticQuery(
    graphql`
      query {
        introduction {
          greeting
          name
          descriptions {
            description {
              header
              subheader
            }
          }
        }
      }
    `
  );
 
  let headers = data.introduction.descriptions.map(({ description }) => description.header);
  let subheaders = data.introduction.descriptions.map(({ description }) => description.subheader);

  return (  
    <HeroWrap name="Home">
      <Overlay></Overlay>
      <Animated animationIn="fadeInUp" animationInDuration={500} animationInDelay={200} >
        <Container>
          <Row noGutters className="js-fullheight justify-content-center align-items-center">
            <Col>
                <Text>
                  <Slider>
                    <Header className="header">{data.introduction.greeting}</Header>
                    <h2 className="subheader">I'm <span id="name">Casey Key</span>, a software engineer & machine learning enthuisiast 🔥. I am also a leader, teacher, and pool player 🦈.</h2>
                      <SocialStyle>
                        <Socials/>
                      </SocialStyle>
                  </Slider>

                    <Button color="primary" href={Resume}>Resume</Button>
                </Text>
            </Col>
            <Col>
            </Col>
          </Row>
          <Row>
            <Col>
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
