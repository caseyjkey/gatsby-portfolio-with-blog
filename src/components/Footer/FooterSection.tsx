import { FaLinkedinIn, FaInstagram, FaPhone, FaSign, FaLongArrowAltRight, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import './footer.scss'

const socialLinks = [
  { Icon: FaXTwitter, href: 'https://x.com/thecaseykey', label: 'X (Twitter)' },
  { Icon: FaLinkedinIn, href: 'https://linkedin.com/in/keycasey', label: 'LinkedIn' },
  { Icon: FaInstagram, href: 'https://instagram.com/caseyjgkey', label: 'Instagram' },
  { Icon: FaGithub, href: 'https://github.com/caseyjkey', label: 'GitHub' },
] as const

export default function FooterSection() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* About column */}
          <div className="footer__widget">
            <h2>About</h2>
            <p>Casey J. Key is a software engineer with a focus on finance, education, and security.</p>
            <ul className="footer__social-list">
              {socialLinks.map(({ Icon, href, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services column */}
          <div className="footer__widget">
            <h2>Services</h2>
            <ul className="footer__services-list">
              <li>
                <a
                  href="https://www.fiverr.com/caseykey/tutor-java-cpp-python-or-javascript"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLongArrowAltRight />
                  Tutoring
                </a>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div className="footer__widget">
            <h2>Questions?</h2>
            <ul className="footer__contact-list">
              <li>
                <FaSign />
                <span className="text">San Francisco, CA, USA</span>
              </li>
              <li>
                <a href="tel:13072242940">
                  <FaPhone />
                  +1 (307) 224-2940
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
