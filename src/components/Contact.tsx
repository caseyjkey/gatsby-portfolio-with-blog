import React, { useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import Info from './Contact/Info'
import { Section, NoPaddingBottom } from './style.ts'
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
        setStatus("ERROR");
      }
    };
    xhr.send(data);
  }

  return (
    <ContactSection className="ftco-section contact-section ftco-no-pb" name="Contact" id="contact-section">
      <Container>
        <Row className="justify-content-center pb-3">
          <Col md={7} className="heading-section text-center ftco-animate">
            <h1 className="big big-2">Contact</h1>
            <h2 className="mb-4">Contact Me</h2>
          </Col>
        </Row>
        <Row noGutters className="block-9 mb-4">
          <Col className="order-md-last d-flex justify-content-center text-center mb-4">
            <form onSubmit={submitForm}
              action="https://formspree.io/xvokgjed"
              method="POST"
              className="bg-light p-4 p-md-5 contact-form"
            >
              <div className="form-group mb-2">
                <input type="text" className="form-control" placeholder="Your Name" name="name" />
              </div>
              <div className="form-group mb-2">
                <input type="text" className="form-control" placeholder="Your Email" name="_replyto" />
              </div>
              <div className="form-group mb-2">
                <input type="text" className="form-control" placeholder="Subject" name="_subject" />
              </div>
              <div className="form-group mb-4">
                <textarea cols={30} rows={7}
                  className="form-control"
                  placeholder=""
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