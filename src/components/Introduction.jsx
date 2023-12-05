import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import styled from 'styled-components'
import { HeroWrap, Overlay, Text, Subheader, Header, Slider } from './Introduction/style.js'
import FallingArrow from './Introduction/Mouse'
import Socials from './Social'
import { Animated } from 'react-animated-css'
import { graphql, useStaticQuery } from 'gatsby'
import { lighten } from 'polished'
import Typewriter from 'typewriter-effect/dist/core'

export default function Introduction(props) {

  const data = useStaticQuery(
    graphql`
      query {
        introduction {
          greeting
          name
	  role
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
          .start()
          .typeString(header)
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


  return (  
    <HeroWrap name="Home">
      <Overlay></Overlay>
      <Animated animationIn="fadeInUp" animationInDuration={500} animationInDelay={200} >
        <Container>
          <Row noGutters xs="1" md="2" className="js-fullheight justify-content-center align-items-center">
            <Col className="text-center">
                <Text>
                  <Subheader>{data.introduction.greeting}</Subheader>
                  <Slider>
                    <h2 className="subheader">My name is <span id="name">{data.introduction.name}</span>, the {data.introduction.role}.</h2>
                    <h1>I am...</h1>
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

                    <Button color="primary" className="text-center" style={{zIndex: "100", position: "relative"}} href="https://cos5lbzflgz.typeform.com/to/dVpncV8k">Email Me</Button>
                </Text>
            </Col>
            <Col>
              <SittingSvg version="1.1" viewBox="80 -10 100.1879 500" height="650.68268" width="711.1879" data-name="Layer 1" id="b52d7e2d-d80f-4111-b6ed-d15502ee1edd">
                      <path d="M 162,94.8 C 129.81195,93.8403 99.15574,84.930003 69.877152,75.179436 40.59857,65.42887 11.608446,54.624763 -19.808717,49.459437 c -20.207038,-3.3227 -43.313601,-3.791886 -59.59661,5.498023 -15.666306,8.957214 -20.729253,24.376417 -23.454693,38.69517 -2.04408,10.7785 -3.25262,22.11579 2.36238,32.20332 3.894189,7.00368 10.812228,12.88984 15.596681,19.59923 16.641093,23.33993 4.878933,52.12244 -13.159698,74.91214 -8.454833,10.68896 -18.272383,20.90016 -24.802493,32.27157 -6.53012,11.3714 -9.54899,24.41907 -3.83949,36.02932 5.66474,11.51642 19.15765,20.14948 33.769589,26.22758 29.686403,12.3439 64.65459,15.87985 98.7822629,17.88031 75.5066201,4.43168 151.4210581,2.51228 227.1265981,0.59287 28.02032,-0.71231 56.15998,-1.43315 83.72273,-5.14826 15.30822,-2.06443 31.11377,-5.3402 42.22441,-13.22255 14.10463,-10.03634 17.60095,-27.03373 8.15146,-39.61648 -15.8553,-21.10917 -59.68116,-26.35553 -70.77689,-49.00875 -6.1024,-12.46759 0.16413,-26.3598 9.02677,-37.92314 19.01841,-24.81147 50.89312,-46.57324 52.57414,-74.93347 C 359.05227,94.04077 343.72913,74.535369 320.0357,65.31797 295.1984,55.656976 260.76237,56.872597 242.4502,72.863357 223.57106,89.31051 190.41817,95.64454 162,94.8 Z" opacity="0.5" class="primaryColor" id="path13"></path>
                      <g id="body">
                      <g id="tshirt">
                        <path id="path2" d="M127.7,186.5c-8.3,0-23.5-7.9-25-13c-0.3-1.1,0.1-2.1,1.2-2.8c2.9-1.8,7.9-2.8,15-2.8        c8.2,0,16.5,1.3,17.5,1.5c0,0.8-0.4,6-3.4,14.4C132.3,185.6,130.6,186.5,127.7,186.5C127.7,186.5,127.7,186.5,127.7,186.5z" fill="#E3405F"></path>
                        <path id="path4" d="M118.8,168c8,0,16,1.2,17.4,1.4c-0.1,1.1-0.5,6.1-3.4,14.2c-0.6,1.7-2.3,2.6-5.2,2.6        c-8.3,0-23.4-7.8-24.9-12.9c-0.3-1.1,0.1-2,1.1-2.6C106.8,168.9,111.8,168,118.8,168 M118.8,167.8c-5.8,0-11.7,0.6-15,2.8        c-6.8,4.2,13.5,16,23.9,16c2.7,0,4.7-0.8,5.4-2.7c3.4-9.3,3.4-14.5,3.4-14.5S127.7,167.8,118.8,167.8L118.8,167.8z" fill="#2D2D2D"></path>
                      </g>
                      <g id="arms">
                        <path id="path7" d="M177.5,221.6c0,0,3.3,23.5,0,27.7s-14.5,0-16-5.8c-1.5-5.8-1.5-5.8-1.5-5.8s-0.2-6.8,2.9-9.2        c3.1-2.4,3.4-2.7,3.4-2.7L177.5,221.6z" fill="#D3B39B"></path>
                        <path id="path9" d="M62.5,221.6c0,0-3.3,23.5,0,27.7c3.3,4.2,14.5,0,16-5.8c1.5-5.8,1.5-5.8,1.5-5.8s0.2-6.8-2.9-9.2        c-3.1-2.4-3.4-2.7-3.4-2.7L62.5,221.6z" fill="#D3B39B"></path>
                      </g>

                      <g id="head">
                        <g id="ccc">
                          <rect id="rect15" height="47" width="27" fill="#F7B799" y="147.5" x="105.5"></rect>
                        </g>
                        <path id="path18" d="M104.4,172.5c-0.1,4.6,25.5,9.1,29.6-0.5c0,0-1,6.9-2.8,8.3c-1.8,1.3-12,8.5-12,8.5s-12.8-2.9-14.1-7.2        C103.8,177.3,104.4,172.5,104.4,172.5z" opacity="0.1"></path>
                        <g id="ears">
                          <g id="g28">
                            <g id="g22">
                              <path id="path20" d="M178.5,113.7L178.5,113.7c0-5.3-4-9.2-8.6-9.2h-11.5l-6.2,18.6c0,0.2,9.4,0.4,9.5,0.4h8.2              C174.5,123.5,178.5,118.9,178.5,113.7z" fill="#F7B799"></path>
                            </g>
                            <g id="g26" opacity="6.000000e-002">
                              <path id="path24" d="M166,108.8c0,0,1-0.5,2.6-0.5c0.8,0,1.9,0.1,2.9,0.8c0.5,0.3,1,0.8,1.3,1.4c0.1,0.3,0.3,0.6,0.3,0.9              c0.1,0.2,0.1,0.5,0.2,0.8c0.2,1.1,0.2,2.2-0.1,3.3c-0.1,0.5-0.3,1-0.6,1.5c-0.2,0.5-0.6,0.8-0.9,1.1c-0.7,0.6-1.5,0.7-2,0.6              c-0.5,0-0.7-0.1-0.7-0.1c0,0,1.2-0.2,1.9-1.3c0.7-1.1,0.8-3,0.5-4.8c0-0.2-0.1-0.5-0.1-0.7c0-0.2-0.1-0.4-0.2-0.5              c-0.2-0.3-0.3-0.6-0.6-0.9c-0.5-0.5-1.3-0.8-2-1.1C167.1,108.9,166,108.8,166,108.8z"></path>
                            </g>
                          </g>
                          <g id="g38">
                            <g id="g32">
                              <path id="path30" d="M58.5,113.7L58.5,113.7c0-5.3,4-9.2,8.7-9.2h11.5l6.2,18.6c0,0.2-9.4,0.4-9.5,0.4h-8.2              C62.5,123.5,58.5,118.9,58.5,113.7z" fill="#F7B799"></path>
                            </g>
                            <g id="g36" opacity="8.000000e-002">
                              <path id="path34" d="M70.3,108.8c0,0-1.1,0.2-2.5,0.6c-0.7,0.2-1.5,0.6-2,1.1c-0.3,0.2-0.4,0.6-0.6,0.9c0,0.2-0.1,0.3-0.2,0.5              c0,0.3-0.1,0.5-0.1,0.7c-0.3,1.8-0.2,3.8,0.5,4.8c0.7,1.1,2,1.2,1.9,1.3c0,0-0.2,0.1-0.7,0.1c-0.5,0-1.3-0.1-2-0.6              c-0.4-0.3-0.7-0.7-0.9-1.1c-0.3-0.4-0.5-0.9-0.6-1.5c-0.3-1.1-0.2-2.2-0.1-3.3c0-0.3,0.1-0.5,0.2-0.8c0.1-0.3,0.2-0.6,0.3-0.9              c0.3-0.6,0.8-1.1,1.3-1.4c1-0.7,2-0.8,2.9-0.8C69.3,108.3,70.3,108.8,70.3,108.8z"></path>
                            </g>
                          </g>
                        </g>
                        <g id="g43" opacity="0.1">
                          <path id="path41" d="M104.6,156.7l27.9,1.1v2.2c0,0-20,6-27,3.4v-5.6L104.6,156.7z"></path>
                        </g>
                        <g id="chin">
                          <path id="path45" d="M73.8,115.3c0-24.9,20.2,6.3,45.1,6.3s45.1-31.2,45.1-6.3s-20.2,45.1-45.1,45.1S73.8,140.2,73.8,115.3z" fill="#F7B799"></path>
                        </g>
                        <g id="face">
                          <path id="path48" d="M163.5,108.9c0,15.3-12.4,27.6-27.6,27.6h-33.7c-15.3,0-27.6-12.4-27.6-27.6V75.1          c0-15.3,12.4-27.6,27.6-27.6h33.7c15.3,0,27.6,12.4,27.6,27.6V108.9z" fill="#F7B799"></path>
                        </g>
                        <g id="mouth">
                          <path id="path54" d="M127.2,131.5c0,0,0.7,0.6,0.8,2.1c0,0.7-0.1,1.5-0.6,2.3c-0.2,0.4-0.5,0.8-0.9,1.1          c-0.4,0.3-0.8,0.5-1.3,0.8c-0.3,0.1-0.9,0.3-1.4,0.3c-0.5,0-1-0.1-1.4-0.2c-0.9-0.3-1.6-0.8-2-1.3c-0.9-1.1-0.7-2.1-0.8-2.1          c0,0,0.1,0.2,0.4,0.4c0.2,0.3,0.6,0.6,1.1,0.8c0.5,0.3,1,0.4,1.6,0.5c0.3,0,0.6,0,0.9,0c0.3,0,0.5-0.1,0.9-0.2          c0.2-0.1,0.5-0.2,0.8-0.4c0.2-0.2,0.5-0.4,0.7-0.6c0.4-0.4,0.7-1,0.9-1.5c0.2-0.5,0.3-1,0.3-1.3          C127.2,131.8,127.2,131.5,127.2,131.5z" fill="#CE9A74"></path>
                        </g>
                        <g id="hair">
                          <g id="sides">
                            <g id="g59">
                              <path id="path57" d="M84.4,67c0,0-5.9,10-9,13.8c0,0,3.9,26.7-1.7,32.6c0,0-0.8-2.4-2.6-5.4c-1.8-3.1-6.5-37.2-4.7-42.3              s6.1-13.8,12-12.8C84.4,54,84.4,67,84.4,67z" fill="#000000"></path>
                            </g>
                            <g id="g63">
                              <path id="path61" d="M164,114.4l0.1,0.1c0,0,6.8-27.6,6-36.6s-3.3-18.7-5.1-21.7c-1.8-3.1-10.7-5.6-12-2.8              c-1.3,2.8-6.1,9-6.1,9s12.5,12,13,14.8c0.4,2.1,0.5,15.3-0.1,24.2C159.4,106.2,160.9,110.9,164,114.4z" fill="#000000"></path>
                            </g>
                            <g id="g67">
                              <path id="path65" d="M84.2,65.4c0,0-5.6,11.5-9.6,14c0,0,7.8-12.3,8-14c0.2-1.8,0.2-1.8,0.2-1.8L84.2,65.4z" fill="#000000"></path>
                            </g>
                            <g id="g71">
                              <path id="path69" d="M73.8,113.5c0,0-3.2-13.9-3.2-15.6c0-1.8,0.2-4.9,0.2-4.9s-1.8,8.3,0,14.2L73.8,113.5z" fill="#000000"></path>
                            </g>
                            <g id="g75">
                              <path id="path73" d="M162,94.8c0,0-0.2,11,1.4,14.5l0.5-2.7L162,94.8z" fill="#000000"></path>
                            </g>
                          </g>
                          <g id="stripe">
                            <g id="g80">
                              <path id="path78" d="M72.9,59.6c0,0,33.5,22.5,72.7,7.7c0,0,17.4-1.8,22.3-11.8c0,0-6.1,1-7.2,1c-1,0,4.6-6.7,4.9-16.9              c0.3-10.2-3.3-13.6-3.3-13.6s-5.9,10-10.5,11c0,0,2.6-8.7,2.3-13.3s0-6.1,0-6.1s-8.2,12-36.8,13.8c-28.7,1.8-39.1,3.1-43.2,7.7              c-4.1,4.6-4.1,12.8-3.3,15.6S72.9,59.6,72.9,59.6z" fill="#000000"></path>
                            </g>
                            <g id="g84">
                              <path id="path82" d="M73.6,55.9c0.2-1.2-2.6-8.1,1.2-11.7c3.8-3.6,15.3-6.9,23.5-7.2c8.1-0.2,29.2-1.7,34.2-3.4              c5-1.7,7.4-3.8,7.4-3.8s-2.6,6.9-37.8,10.3C66.9,43.4,73.6,55.9,73.6,55.9z" fill="#000000"></path>
                            </g>
                            <g id="g88">
                              <path id="path86" d="M154.7,37.7c0,0-8,7-26,9.3c-18,2.2-24.6,4.9-24.6,4.9s32.5-3.5,34.6-3.7              C140.8,48.1,151.6,47.9,154.7,37.7z" fill="#000000"></path>
                            </g>
                            <g id="g92">
                              <path id="path90" d="M83.7,57.8c0,0,12,2.9,15.3,2.6c3.4-0.2,9.1-2.2,9.1-2.2S103.1,65.9,83.7,57.8z" fill="#000000"></path>
                            </g>
                            <g id="g96">
                              <path id="path94" d="M154,17.6c0,0-5.2,12.9-6.7,14.1c-1.4,1.2-4.5,3.8-4.5,3.8s7.7-2.9,9.8-9.1L154,17.6z" fill="#000000"></path>
                            </g>
                            <g id="g100">
                              <path id="path98" d="M150.7,66.4c0,0,15.1-5.8,17.1-10.9c0,0-19.7,11-22.3,11.8L150.7,66.4z" fill="#000000"></path>
                            </g>
                          </g>
                        </g>
                        <g id="eyeb">
                          <g id="g106">
                            <path id="path104" d="M84.6,92c0,0,16.8-9.6,14.2-12.2C96.2,77.2,84.6,92,84.6,92z" fill="#000000"></path>
                          </g>
                          <g id="g110">
                            <path id="path108" d="M151.5,91.5c0,0-16.8-9.6-14.2-12.2C139.9,76.8,151.5,91.5,151.5,91.5z" fill="#000000"></path>
                          </g>
                        </g>
                        <g id="eyey2">
                          <circle id="circle113" r="5" cy="114" cx="98.4" fill="#000000"></circle>
                          <circle id="circle115" r="5" cy="114" cx="136.9" fill="#000000"></circle>
                        </g>
                      </g>
                      <g id="shirt">
                        <path id="path119" d="M137.9,174.8c0,0,35.4,13.8,38.3,40.9l-11,11.5c0,0-0.5,67.7,1.9,71.6c0,0-20.1,12.2-33.3,15.1        s-40-2.2-43.1-3.6c-3.1-1.4-15.3-10.8-15.3-10.8s2.6-9.8,2.4-13.9c-0.2-4.1,0.5-27.5,0.2-31.8c-0.2-4.3-1.2-19.9-1.2-19.9        l-15.3-14.4c0,0,7.6-41.2,38.7-42.3c0,0,13,15.5,15.6,15.5s3.1,6.2,3.1,6.2s3.1-6.3,11-15.2C137.9,174.8,137.9,174.8,137.9,174.8z" fill="#E3405F"></path>
                        <g id="g123">
                          <polygon id="polygon121" points="62.8,220.6 60.2,224.5 77,238.6 77.8,236.8 77.2,233.2   " fill="#353535"></polygon>
                        </g>
                        <g id="g127">
                          <polygon id="polygon125" points="165.1,227.1 175.5,216.3 179.3,223.2 165.1,235.8   " fill="#353535"></polygon>
                        </g>
                        <g id="gola">
                          <g id="g131">
                            <path id="path129" d="M109,189.8l-0.2-8.2l7.7,0.8l1.9,1.4c0,0,2.3,4.6,2.1,8.8c-0.2,4.1-4.6,5-4.6,5L109,189.8z" fill="#E3405F"></path>
                          </g>
                          <g id="g135">
                            <path id="path133" d="M121.8,182c0,0-5.4,15.2-5.6,23.3l0.5,6.4l8.9,0.2l-1-8.8c0,0,6.7-11,7.7-12            C133.3,190.2,130.1,179.5,121.8,182z" fill="#E3405F"></path>
                          </g>
                          <g id="g145">
                            <g id="g143">
                              <g id="g141">
                                <path id="path137" d="M109.7,196.7c-4.3-4.1-12.4-18.1-12.5-18.2c0.4-2.1,5.6-7,6.5-7.7c0,0,0,0.1,0.1,0.2                c0.5,0.8,2.8,2.8,3.5,3c0.7,0.1,10.6,6.3,11.4,7.1c0.6,0.6,0.8,4.1,0.9,6c-0.3-0.8-1-2.1-1.2-2.8c-0.2-0.5-0.7-0.8-1.6-0.8                c-1,0-2.5,0.3-4.5,1c-2.8,1-2.7,7.5-2.7,10.7C109.7,195.8,109.7,196.4,109.7,196.7z" fill="#E3405F"></path>
                                <path id="path139" d="M103.6,170.9C103.7,170.9,103.7,170.9,103.6,170.9c0.5,0.9,2.8,2.9,3.6,3.1c0.7,0.1,10.6,6.3,11.4,7.1                c0.4,0.4,0.7,3.1,0.8,5.3c-0.3-0.7-0.7-1.7-0.9-2.2c-0.2-0.6-0.8-0.9-1.7-0.9c-1,0-2.6,0.3-4.5,1c-2.9,1-2.8,7.4-2.8,10.8                c0,0.4,0,0.9,0,1.2c-4.1-4.1-11.5-16.7-12.2-17.9C97.9,176.4,102.5,171.8,103.6,170.9 M103.8,170.5c-0.3,0-6.2,5.7-6.7,8                c0,0,8.3,14.4,12.6,18.3c0,0,0,0,0,0c0.4,0-0.9-11,2.7-12.3c2-0.7,3.4-1,4.4-1c0.9,0,1.3,0.2,1.5,0.7c0.3,1,1.4,3.4,1.4,3.4                s-0.2-5.9-1-6.7c-0.8-0.8-10.7-7-11.5-7.2C106.5,173.6,103.6,171,103.8,170.5C103.8,170.5,103.8,170.5,103.8,170.5L103.8,170.5                z" fill="#2D2D2D"></path>
                              </g>
                            </g>
                          </g>
                          <g id="g149">
                            <path id="path147" d="M129.5,191.6c0,0-5.2-4.5-6.8-4.2c-1.6,0.3-4.2,5.5-4.5,6.2c-0.2,0.7-1,18.7-0.4,20.6l-0.7-0.1            c0,0,0.6-20.3,0.6-21c0.1-0.7,2-5.5,2-5.5l2.1-5.6C121.8,182,129.1,177.8,129.5,191.6z" fill="#353535"></path>
                          </g>
                          <g id="g153">
                            <circle id="circle151" r="2.2" cy="194.2" cx="121.6" fill="#BCBCBC"></circle>
                          </g>
                          <g id="g157">
                            <circle id="circle155" r="2" cy="202.3" cx="121.7" fill="#BCBCBC"></circle>
                          </g>
                          <g id="g167">
                            <g id="g165">
                              <g id="g163">
                                <path id="path159" d="M129.7,199.1c0.2-2.4,0.7-12.4-2.8-16.2c-0.9-0.9-1.9-1.4-3.1-1.4c-0.4,0-0.8,0.1-1.2,0.2                c2.5-1.7,11.3-8,12.6-10.6l1.4-1.7c0.5,0.2,3.5,1.6,7.3,8.3L129.7,199.1z" fill="#E3405F"></path>
                                <path id="path161" d="M136.6,169.6c0.7,0.3,3.5,1.9,7.1,8.1l-13.9,20.9c0.2-3,0.4-12.2-2.8-15.8c-0.9-1-2-1.5-3.2-1.5                c-0.2,0-0.5,0-0.7,0c3-2.1,10.8-7.8,12.2-10.3L136.6,169.6 M136.5,169.3l-1.4,1.8c-1.6,3-13.2,11-13.2,11                c0.7-0.2,1.4-0.4,1.9-0.4c7.4,0,5.7,17.9,5.7,17.9l14.5-21.9C139.7,170.2,136.5,169.3,136.5,169.3L136.5,169.3z" fill="#2D2D2D"></path>
                              </g>
                            </g>
                          </g>
                        </g>
                        <g id="g172" opacity="0.14">
                          <path id="path170" d="M78.9,288c0,0-0.7,5.3-1.4,6.9c-0.7,1.7,24.4,11.5,24.4,11.5L78.9,288z"></path>
                        </g>
                      </g>
                      <g id="legs">
                        
                        <g id="g188">
                          <path id="path186" d="M15.7,303.3c0,0-1.9-11.2,8-15c9.9-3.8,37,3.2,64.8,18.5c27.8,15.3,69.9-5.1,98-14.7          c28.1-9.6,45.9-10.1,49.3,0.9c0,0-24.7,39.3-45.5,40.6s-48.2-1-48.2-1l-31.9,0.6c0,0-24.3,8.6-28.7,8.3          C77,341.2,20.8,325.3,15.7,303.3z" fill="#212121"></path>
                        </g>
                        <g id="g192">
                          <path id="path190" d="M91.2,333.1c0,0,20.3-12,21.9-11.5c1.6,0.5,6.9,5.9,9.1,6.9c2.2,1,1.6,3.7,1.6,3.7l-3,9.3l-22.3-1.9          L91.2,333.1z" fill="#2B2B2B"></path>
                        </g>
                        <g id="g196">
                          <polygon id="polygon194" points="134.9,341.1 114.3,342 119.9,331 137.6,330.6 136.7,342.2   " fill="#F7B799"></polygon>
                        </g>
                        <g id="g200">
                          <polygon id="polygon198" points="119,329.9 127.3,330.7 126,342.5 115.4,340.3   " fill="#EAEAEA"></polygon>
                        </g>
                        <g id="notebook">
                          <g id="g210">
                            <g id="g204">
                              <path id="path202" d="M212.5,295.1c0,1.9-1.5,3.4-3.4,3.4H33.9c-1.9,0-3.4-1.5-3.4-3.4v-1.3c0-1.9,1.5-3.4,3.4-3.4h175.3              c1.9,0,3.4,1.5,3.4,3.4V295.1z" fill="#7F8DAA"></path>
                            </g>
                            <g id="g208">
                              <path id="path206" d="M212.5,289.7c0,3.8-3,6.8-6.8,6.8H37.3c-3.8,0-6.8-3-6.8-6.8V186.3c0-3.8,3-6.8,6.8-6.8h168.4              c3.8,0,6.8,3,6.8,6.8V289.7z" fill="#292A2D"></path>
                            </g>
                          </g>
                          <g id="logobook">
                            <rect rx="3" id="rect1150" fill="#E3405F" width="15" height="15" x="-92.187965" y="245.78786" transform="rotate(-45)"></rect>
                          </g>
                          <radialgradient gradientUnits="userSpaceOnUse" r="17.2316" cy="239.6875" cx="121.6441" id="logo1"></radialgradient>
                          <path d="M138.7,239.7c0,2.9-0.7,5.7-2,8.1c-2.9,5.4-8.6,9.1-15.2,9.1          c-9.5,0-17.2-7.7-17.2-17.2s7.7-17.2,17.2-17.2c7.3,0,13.5,4.5,16,10.9c0.7,1.7,1.1,3.5,1.2,5.4l0.2,0.3l0,0.3L138.7,239.7z" fill="url(#logo1)" opacity="0.66" id="logo2"></path>
                        </g>
                        <g id="g218" opacity="0.1">
                          <polygon id="polygon216" points="135.8,341 132.4,341.2 134.8,330.6 136,330.5   "></polygon>
                        </g>
                        <g id="g222">
                          <path id="path220" d="M135.7,326.9l-1,27.8c0,0,55.2-2.9,87.4-33.8s2.2-37,2.2-37s-10.2-0.6-10.2,1.3          C214.2,287,191.9,319.9,135.7,326.9z" fill="#000000"></path>
                        </g>
                        <g id="g226">
                          <path id="path224" d="M129.3,349.5c0,0,24.9-2.1,25.4-1.6c0.5,0.5,3.8,8.9,3.8,8.9l-34,1.4c0,0,1.1-5.3,1.8-6.5          C126.9,350.5,129.3,349.5,129.3,349.5z" fill="#F7B799"></path>
                        </g>
                        <g id="g230">
                          <path id="path228" d="M130.9,361c0.9-0.2-1.6-23.3-1.6-23.3s-68.3-5.1-98.3-45.6h0c-1.5-2.9-6.7-5.8-9.3-3.9l-2.3,1          c-8.7,6.3-7.5,19.3-1.7,28.4c3.1,4.8,7.6,10.1,14.3,15.3C53.4,349.5,88.8,368.7,130.9,361z" fill="#000000"></path>
                        </g>
                        <g id="g234" opacity="0.1">
                          <polygon id="polygon232" points="150.4,357.3 145.7,357.4 146.8,348 149.4,351.4   "></polygon>
                        </g>
                        <g id="g238">
                          <polygon id="polygon236" points="157.2,358.6 149.4,357.8 146.4,347.8 155.8,347.3   " fill="#EAEAEA"></polygon>
                        </g>
                        <g id="pe">
                          <g id="g242">
                            <path id="path240" d="M150.9,347c-0.7-0.5,12.3-10.4,13.4-10.2c1.1,0.2,11.6,9.4,12.8,9.4c1.1,0,27.8,8.5,25.2,16.4l-25.5-0.6            l-19.9-1.1C156.8,360.9,155.3,350.7,150.9,347z" fill="#2B2B2B"></path>
                          </g>
                          <g id="g246">
                            <rect id="rect244" height="7.9" width="1.9" fill="#777070" transform="matrix(0.9869 0.1612 -0.1612 0.9869 59.7596 -21.5769)" y="353.5" x="161.9"></rect>
                          </g>
                          <g id="g250">
                            <rect id="rect248" height="7.6" width="1.9" fill="#777070" transform="matrix(0.9821 0.1884 -0.1884 0.9821 70.3837 -24.9184)" y="353.9" x="165.3"></rect>
                          </g>
                          <g id="g254">
                            <rect id="rect252" height="7" width="1.9" fill="#777070" transform="matrix(0.9989 4.593970e-002 -4.593970e-002 0.9989 16.6397 -7.4027)" y="354.8" x="168.4"></rect>
                          </g>
                          <g id="g258">
                            <rect id="rect256" height="6.1" width="1.9" fill="#777070" transform="matrix(0.9914 0.1308 -0.1308 0.9914 48.3763 -19.4954)" y="355.6" x="171.7"></rect>
                          </g>
                        </g>
                        <g id="g263">
                          <path id="path261" d="M133,342.9" fill="#E6B99B"></path>
                        </g>
                      </g>
                      
                      </g>
                      <g id="g177">
                        <path id="path175" d="M43.6,262" fill="#E6B99B"></path>
                      </g>

                      <g opacity="0.20" id="shadow">
                        <path id="path12" d="M1.5,406.1c0-1.2,1.9-1.8,5.4-2.8c6.2-1.8,17.3-4,32-5.3c22.5-2,53.4-2,87.4-3.3c19.6-0.7,41.2,1,58.8,1.9        c39.1,1.9,65.9,5.2,65.9,9.6c0,4.4-26.9,8.2-66.4,10.1c-7.3,0.4-16.1-0.5-24.2-0.3c-11.1,0.3-21.9,1.6-34.1,1.6        c-4.2,0-8.4,0-12.6-0.1c-9.2-0.1-18.1-0.3-26.6-0.5C37.3,415.4,1.5,411.1,1.5,406.1z" fill="#0A0A0A"></path>
                      </g>
              </SittingSvg>
            </Col>
          </Row>
          <Row>
            <Col>
              <FallingArrow />
            </Col>
          </Row>
        </Container>
      </Animated>
    </HeroWrap>
  );
}

const SittingSvg = styled.svg`
  @media (max-width: 767.98px) {
    bottom: 35px;
    position:relative;
  }

  max-width: 100%;
  height: auto;
  margin: 3rem 0rem 0 0rem;

  .primaryColor {
    fill: ${props => props.theme.primaryColor};
  }

  @keyframes slide {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(15px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  @keyframes read {
    0% {
      transform: translatex(1px);
    }
    50% {
      transform: translateX(-3px);
    }
    100% {
      transform: translateX(1px);
    }
  }

  @keyframes eyebrows {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-4px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  #eyeb {
    animation: eyebrows 9s 6.5s ease infinite;
  }

  #eyey2 {
    animation: read 9s 6.5s ease infinite;
  }

  #body {
    animation: slide 9s 6.5s ease infinite;
  }

  #shadow {
    animation: slide 10s 6.5s ease infinite;
  }

  .gray, #path186, #path206, #path240, #path190 {
    color:
      ${props => props.theme.black};
    fill: ${props => lighten(0.1, props.theme.black)};
  }

  #rect1150, #path119, #path137, #path159, #path2 {
    fill: ${props => props.theme.primaryColor};
  }
`

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
