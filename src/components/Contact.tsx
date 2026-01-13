import React, { useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import Info from './Contact/Info'
import { Section, NoPaddingBottom } from './style'
import { Heading } from './style'
import { FaSign, FaPhone } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Headshot from './About/images/about.png'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { ANIMATION_CONFIG, TIMING } from '../animations/config'
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation'

export default function Contact(props) {
  const [status, setStatus] = useState("");

  // Use the optimized hook for header viewport detection
  const { ref: headerRef, isInView: isHeaderVisible } = useInViewAnimation({
    once: true,
    rootMargin: ANIMATION_CONFIG.rootMargin,
  });

  // Use the optimized hook for form viewport detection
  const { ref: formRef, isInView: isFormVisible } = useInViewAnimation({
    once: true,
    rootMargin: ANIMATION_CONFIG.rootMargin,
  });

  const submitForm = (ev) => {
    ev.preventDefault();
    const form = ev.target;
    const data = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        form.reset();
        setStatus("SUCCESS");
      } else {
        setStatus("ERROR");
      }
    };
    xhr.send(data);
  }

  return (
    <ContactSection className="ftco-section contact-section ftco-no-pb" name="Contact" id="contact-section">
      <Container className="mt-5">
        <Row className="justify-content-center pb-3">
          <Col md={7} className="heading-section text-center ftco-animate">
            <motion.div
              ref={headerRef}
              initial="hidden"
              animate={isHeaderVisible ? "visible" : "hidden"}
              custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
              variants={fadeInUpVariants}
            >
              <h1 className="big big-2">Contact</h1>
              <Heading className="mb-4">Start a Conversation</Heading>
              <p>Available for architectural consulting and senior engineering lead roles.</p>
            </motion.div>
          </Col>
        </Row>
        <Row noGutters className="block-9 mb-4">
          <Col className="order-md-last d-flex justify-content-center text-center mb-4">
            <motion.form
              ref={formRef}
              initial="hidden"
              animate={isFormVisible ? "visible" : "hidden"}
              custom={{ delay: 0, distance: TIMING.primaryUnit.distance }}
              variants={fadeInUpVariants}
              onSubmit={submitForm}
              action="https://formspree.io/xvokgjed"
              method="POST"
              className="bg-light p-4 p-md-5 contact-form"
            >
              <motion.div
                initial="hidden"
                animate={isFormVisible ? "visible" : "hidden"}
                custom={{ delay: 0.1 }}
                variants={fadeInUpVariants}
                className="form-group mb-2"
              >
                <input type="text" className="form-control" placeholder="Your Name" name="name" />
              </motion.div>
              <motion.div
                initial="hidden"
                animate={isFormVisible ? "visible" : "hidden"}
                custom={{ delay: 0.15 }}
                variants={fadeInUpVariants}
                className="form-group mb-2"
              >
                <input type="text" className="form-control" placeholder="Your Email" name="_replyto" />
              </motion.div>
              <motion.div
                initial="hidden"
                animate={isFormVisible ? "visible" : "hidden"}
                custom={{ delay: 0.2 }}
                variants={fadeInUpVariants}
                className="form-group mb-2"
              >
                <input type="text" className="form-control" placeholder="Subject" name="_subject" />
              </motion.div>
              <motion.div
                initial="hidden"
                animate={isFormVisible ? "visible" : "hidden"}
                custom={{ delay: 0.25 }}
                variants={fadeInUpVariants}
                className="form-group mb-4"
              >
                <textarea cols={30} rows={7}
                  className="form-control"
                  placeholder=""
                  name="message"
                  defaultValue={""}
                />
              </motion.div>
              <motion.div
                initial="hidden"
                animate={isFormVisible ? "visible" : "hidden"}
                custom={{ delay: 0.3 }}
                variants={fadeInUpVariants}
                className="form-group"
              >
                {status == "SUCCESS" ? <p>Thanks!</p> : <button className="btn btn-primary py-3 px-5">Submit</button>}
                {status == "ERROR" && <p>Oops! There was an error.</p>}
              </motion.div>
            </motion.form>
          </Col>
        </Row>
      </Container>
    </ContactSection>
  );
}

const ContactSection = styled.section`
  margin-top: 6em;
  ${Section}
  ${NoPaddingBottom}
  flex: 1 0 auto;

`;

const AvailabilityNote = styled.p`
  color: ${props => props.theme.primaryColor};
  font-weight: 500;
  margin-top: 0.5rem;
`;