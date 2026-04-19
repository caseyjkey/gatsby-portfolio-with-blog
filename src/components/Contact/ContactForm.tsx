import { useState, type FormEvent } from 'react';
import AnimatedSection from '../AnimatedSection';
import { SECONDARY_DELAYS, PROGRESSIVE_STAGGER } from '../../animations/config';
import './contact.scss';

export default function ContactForm() {
  const [status, setStatus] = useState('');

  const submitForm = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        form.reset();
        setStatus('SUCCESS');
      } else {
        setStatus('ERROR');
      }
    };
    xhr.send(data);
  };

  const fieldDelay = (index: number) =>
    PROGRESSIVE_STAGGER.contact.fieldBase + (index * PROGRESSIVE_STAGGER.contact.fieldIncrement);

  return (
    <section className="contact">
      <div className="container">
        <AnimatedSection>
          <div className="contact__header">
            <h1 className="big">Contact</h1>
            <h2>Start a Conversation</h2>
            <p>Available for architectural consulting and senior engineering lead roles.</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="contact__form-wrapper">
            <form
              onSubmit={submitForm}
              action="https://formspree.io/xvokgjed"
              method="POST"
              className="contact__form"
            >
              <AnimatedSection delay={fieldDelay(1)}>
                <div className="field-group">
                  <input type="text" placeholder="Your Name" name="name" />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={fieldDelay(3)}>
                <div className="field-group">
                  <input type="text" placeholder="Your Email" name="_replyto" />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={fieldDelay(4)}>
                <div className="field-group">
                  <input type="text" placeholder="Subject" name="_subject" />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={fieldDelay(5)}>
                <div className="field-group">
                  <textarea placeholder="Your Message" name="message" rows={7} />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={fieldDelay(6)}>
                {status === 'SUCCESS' ? (
                  <p className="contact__status contact__status--success">Thanks! I'll get back to you soon.</p>
                ) : (
                  <button type="submit" className="btn-primary py-3 px-5">Submit</button>
                )}
                {status === 'ERROR' && (
                  <p className="contact__status contact__status--error">Oops! There was an error. Please try again.</p>
                )}
              </AnimatedSection>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
