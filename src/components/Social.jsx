import React, { useState } from 'react'
import { Animated } from 'react-animated-css'
import { Waypoint } from 'react-waypoint'
import { FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa'

/* This is a generic component for placing social links anywhere
   TODO: Use props for social links */
export default function Socials(props) {
  return (
    <ul className="ftco-footer-social list-unstyled ">
      <li>
        <Social Icon={FaTwitter}
                link="https://twitter.com/caseyjkeycodes"
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
