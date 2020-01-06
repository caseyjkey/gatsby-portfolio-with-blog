import React, { Component } from 'react'
import style from 'styled-components'
import { Heading } from './style.js' // Global styled components
import { Container, Row, Col, Button } from 'reactstrap'
import { ServicesSection } from './Services/style.js'
import Service from './Services/Service'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { MdWeb, MdAndroid } from 'react-icons/md'

export default class Services extends Component {
  render() {
    return (
      <ServicesSection>
        <Container fluid={true} className="px-md-5">
          <Row className="justify-content-center py-5 mt-5">
            <Col md={12} className="text-center">
              <Heading className="mb-4">Services</Heading>
              <p>Outside of class and work, I offer these services in-person and remotely.</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="text-center d-flex">
              <Service icon={FaChalkboardTeacher}
                       service="Tutoring"
                       link="http://fiver.com/s2/9916472099"
              >
                Local and online tutoring for Computer Science, Math, Physics, and Economics.
              </Service>
            </Col>
            <Col md={4} className="text-center d-flex">
              <Service icon={MdWeb}
                       service="Web Development"
                       link="#contact"
                       button="Contact me"
              >
                Full-stack web development from design to implementation.
              </Service>
            </Col>
            <Col md={4} className="text-center d-flex">
              <Service icon={MdAndroid}
                       service="App Development"
                       link="#contact"
                       button="Contact me"
              >
                Excited to turn your idea into a well-crafted Android app. 
              </Service>
            </Col>
          </Row>
        </Container>
      </ServicesSection>
    );
  }
}