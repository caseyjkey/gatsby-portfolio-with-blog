import React, { useState } from 'react'
import styled from 'styled-components'
import { lighten, darken } from 'polished'
import { Container, Row, Col } from 'reactstrap'
import { Animated } from 'react-animated-css'
import { Waypoint } from 'react-waypoint'
import { FaHeartBroken, FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram, FaPhone, FaSign, FaLongArrowAltRight } from 'react-icons/fa'
import { Section } from './style'
import { Link } from 'react-scroll'

export default function Footer(props) {
  return (
    <FooterSection>
      <Container>
        <Row mb={5}>
          <Col md>
            <div className="ftco-footer-widget">
              <h2 className="ftco-heading-2">About</h2>
              <p>Casey J. Key is a software engineer with a focus on finance, education, and security.</p>
              <ul className="ftco-footer-social list-unstyled float-md-left float-lft">
                <li>
                  <Social Icon={FaTwitter}
                          link="https://twitter.com/caseyjkey"
                  />
                </li>
                <li>
                  <Social Icon={FaLinkedinIn}
                          link="https://linkedin.com/in/caseyjkey"
                  />
                </li>
                <li>
                  <Social Icon={FaFacebookF}
                          link="https://www.facebook.com/caseyjkey"
                  />
                </li>
                <li>
                  <Social Icon={FaInstagram}
                          link="https://instagram.com/caseyjkey"
                  />
                </li>
              </ul>
              
            </div>
          </Col>
          <Col md>
            <div className="ftco-footer-widget mb-4 ml-md-4">
              <h2 className="ftco-heading-2">Links</h2>
              <ul className="list-unstyled">
                 <li><Link to="Home" offset={-80} smooth>Home</Link></li>
                 <li><Link to="About" offset={-70} smooth>About</Link></li>
                 {/*<li><Link to="Resume" smooth>Resume</Link></li>
                 <li><Link to="Services" smooth>Services</Link></li>*/}
                 <li><Link to="Projects" smooth>Projects</Link></li>
                 <li><Link to="Contact" smooth>Contact</Link></li>
              </ul>
            </div>
          </Col>
          <Col md>
            <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">Services</h2>
              <ul className="list-unstyled">
                <li><a href="http://fiver.com/s2/9916472099" target="_blank"><FaLongArrowAltRight />Tutoring</a></li>
              </ul>
            </div>
          </Col>
          <Col md>
            <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">Questions?</h2>
              <div className="block-23 mb-3">
                <ul>
                  <li><FaSign /><span className="text">Fort Collins, Colorado, USA</span></li>
                  <li><a href="tel:13312227919"><FaPhone />+1 (331) 222-7919</a></li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-center">
            <p>Made with <FaHeartBroken /> by Casey J. Key</p>
          </Col>
        </Row>
      </Container>
    </FooterSection>
  );
};

function Social({link, Icon}) {
  const [visible, setVisible] = useState(false);
  const makeVisible = () => setVisible(true);

  return (
    <Animated animationIn={"fadeInUp"} isVisible={visible}>
      <a href={link} target="_blank"><Icon /></a>
      <Waypoint onEnter={makeVisible}></Waypoint>
    </Animated>
  );
}

const FooterSection = styled.footer`
  ${Section}
  padding: 3em 0;
	font-size: 16px;
	background: ${props => props.theme.black};
	z-index: 0;

	.ftco-footer-logo {
		text-transform: uppercase;
		letter-spacing: .1em;
	}
	.ftco-footer-widget {
		h2 {
			font-weight: normal;
			color: ${props => props.theme.white};
			font-size: 22px;
			font-weight: 600;
		}
		ul{
			li{
        a {
          &:hover {
            color: ${props => props.theme.white};
          }
        }
        
        svg {
          margin-right: 1em;
        }
			}
		}
	}
	p {
		color: ${props => darken(0.3, props.theme.white)};
	}
	a {
		color: ${props => darken(0.3, props.theme.white)};
		&:hover {
			color: ${props => props.theme.white};
		}
	}
	.ftco-heading-2 {
		font-size: 17px;
		font-weight: 400;
		color: ${props => props.theme.black};
	}
}


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
      color: ${props => lighten(0.1, props.theme.black)};
      background: ${props => darken(0.7, props.theme.white)};
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
        color: ${props => props.theme.white};
        background: ${props => props.theme.black};
			}
		}
	}
`;