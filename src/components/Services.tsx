import React from 'react'
import style from 'styled-components'
import { Heading } from './style.js' // Global styled components
import { Container, Row, Col, Button } from 'reactstrap'
import { ServicesSection } from './Services/style.js'
import Service from './Services/Service'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { MdWeb, MdAndroid } from 'react-icons/md'

export default function Services(props) {
  return (
    <ServicesSection name="Services">
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
              Tutoring for Computer Science
            </Service>
          </Col>
          <Col md={4} className="text-center d-flex">
            <Service icon={MdWeb}
                      service="Web Development"
                      button="Contact me"
            >
              Full-stack modern web applications
            </Service>
          </Col>
          <Col md={4} className="text-center d-flex">
            <Service icon={MdAndroid}
                      service="App Development"
                      button="Contact me"
            >
               Beautiful mobile applications
            </Service>
          </Col>
        </Row>
      </Container>
    </ServicesSection>
  );
}