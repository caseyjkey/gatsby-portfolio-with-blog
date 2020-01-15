import React, { useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import Info from './Contact/Info'
import { Section, NoPaddingBottom } from './style.js'
import { FaSign, FaPhone } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Headshot from './About/images/about.png'

export default function Contact(props) {
  const [visible, setVisible] = useState(false);
  const makeVisible = () => setVisible(true);

  const [status, setStatus] = useState("");
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
        setStatus("ERROR" );
      }
    };
    xhr.send(data);
  }

  return (
    <ContactSection className="ftco-section contact-section ftco-no-pb" name="Contact" id="contact-section">
        <Container>
          <Row className="justify-content-center mb-5 pb-3">
            <Col md={7} className="heading-section text-center ftco-animate">
                <h1 className="big big-2">Contact</h1>
                <h2 className="mb-4">Contact Me</h2>
                <p>Let's chat! I am open to meeting for coffee, phone calls, or a quick email.</p>
            </Col>
          </Row>
          <Row className="contact-info mb-5">
            <Col md={4} lg={4} className="text-center">
              <Info type="Location"
                    info="Fort Collins, CO"
                    Icon={FaSign}
              />              
            </Col>
            <Col md={4} lg={4} className="text-center">
              <Info type="Contact Phone"
                    info="+‪1 (331) 222-7919‬"
                    link="tel:13312227919"
                    Icon={FaPhone}
              />
            </Col>
            <Col md={4} lg={4} className="text-center"> 
              <Info type="Email"
                    info="Email"
                    link="mailto:casey.key@protonmail.com"
                    Icon={MdEmail}
              />
            </Col>
          </Row>
          <Row noGutters className="block-9">
            <Col md={6} className="order-md-last d-flex">
              <form onSubmit={submitForm} 
                    action="https://formspree.io/xvokgjed" 
                    method="POST" 
                    className="bg-light p-4 p-md-5 contact-form"
              >
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Your Name" name="name" />
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Your Email" name="_replyto" />
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Subject" name="_subject"/>
                </div>
                <div className="form-group">
                  <textarea cols={30} rows={7} 
                            className="form-control" 
                            placeholder="Let's grab a coffee together!" 
                            name="message" 
                            defaultValue={""} 
                  />
                </div>
                <div className="form-group">
                  {status == "SUCCESS" ? <p>Thanks!</p> : <button className="btn btn-primary py-3 px-5">Submit</button>}
                  {status == "ERROR" && <p>Oops! There was an error.</p>}
                </div>
              </form>
            </Col>
            <Col md={6} className="d-flex">
              <div className="img" style={{backgroundImage: 'url(' + Headshot + ')'}} />
            </Col>
          </Row>
        </Container>
      </ContactSection>
 );
}

const ContactSection = styled.section`
  ${Section}
  ${NoPaddingBottom}

`;