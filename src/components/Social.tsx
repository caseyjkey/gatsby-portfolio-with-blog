import React, { useState } from 'react'
import { Animated } from 'react-animated-css'
import { Waypoint } from 'react-waypoint'
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

/* This is a generic component for placing social links anywhere
   TODO: Use props for social links */
export default function Socials(props) {
  return (
    <ul className="ftco-footer-social list-unstyled ">
      <li>
        <Social Icon={FaXTwitter}
                link="https://x.com/thecaseykey"
        />
      </li>
      <li>
        <Social Icon={FaLinkedinIn}
                link="https://linkedin.com/in/keycasey"
        />
      </li>
      <li>
        <Social Icon={FaInstagram}
                link="https://instagram.com/caseyjgkey"
        />
      </li>
      <li>
        <Social Icon={FaGithub}
                link="https://github.com/caseyjkey"
        />
      </li>
    </ul>
  );
}

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
