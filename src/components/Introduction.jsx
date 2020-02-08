import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { ThemeProvider } from 'styled-components'
import { theme } from './style.js'
import { HeroWrap, Overlay, Text, Subheader, Header, Slider } from './Introduction/style.js'
import FallingArrow from './Introduction/Mouse'
import { Animated } from 'react-animated-css'
import { useStaticQuery } from 'gatsby'

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
  )
  function createArrayString(arr) {
    let rotateString = '[';
    arr.map((item, index) => {
      rotateString = rotateString + '"' + item + '"';
      if(index < arr.length - 1)
        rotateString = rotateString + ',';
    });
    rotateString = rotateString + ']';
    return rotateString;
  }
  
  let descriptions = createArrayString(data.introduction.descriptions.map(({ description }) => description));
  let examples = createArrayString(data.introduction.descriptions.map(item => item.example));
  console.log(examples);
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
                    <span className="txt-rotate" 
                          data-period={700} 
                          data-rotate={descriptions}
                    />
                  </Slider>
                    <span className="txt-rotate"
                        data-period={1500}
                        data-rotate={examples}
                    />
                </Text>
            </Col>
          </Row>
        </Container>
      </Animated>
      <FallingArrow />
    </HeroWrap>
  );
}