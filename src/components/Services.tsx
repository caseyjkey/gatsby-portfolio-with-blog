import React, { useEffect, useRef } from 'react'
import style from 'styled-components'
import { Heading } from './style.ts'
import { Container, Row, Col, Button } from 'reactstrap'
import { ServicesSection } from './Services/style.ts'
import Service from './Services/Service'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { MdWeb, MdAndroid } from 'react-icons/md'
import { motion } from 'motion/react'
import { TIMING, EASING, fadeInUpVariants } from '../animations'

export default function Services(props) {
  const servicesRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <ServicesSection name="Services">
      <Container fluid={true} className="px-md-5" ref={servicesRef}>
        <Row className="justify-content-center py-5 mt-5">
          <Col md={12} className="text-center">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInUpVariants}
            >
              <Heading className="mb-4">Services</Heading>
              <p>Outside of class and work, I offer these services in-person and remotely.</p>
            </motion.div>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="text-center d-flex">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              custom={{ delay: 0.15 }}
              variants={fadeInUpVariants}
            >
              <Service
                icon={FaChalkboardTeacher}
                service="Tutoring"
                link="http://fiver.com/s2/9916472099"
              >
                Tutoring for Computer Science
              </Service>
            </motion.div>
          </Col>
          <Col md={4} className="text-center d-flex">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              custom={{ delay: 0.30 }}
              variants={fadeInUpVariants}
            >
              <Service
                icon={MdWeb}
                service="Web Development"
                button="Contact me"
              >
                Full-stack modern web applications
              </Service>
            </motion.div>
          </Col>
          <Col md={4} className="text-center d-flex">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              custom={{ delay: 0.45 }}
              variants={fadeInUpVariants}
            >
              <Service
                icon={MdAndroid}
                service="App Development"
                button="Contact me"
              >
                 Beautiful mobile applications
              </Service>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </ServicesSection>
  );
}
