import React, { useEffect, useState, useRef } from 'react'
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { ANIMATION_CONFIG } from '../animations/config'

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

function Social({ link, Icon }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = () => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0,
        rootMargin: ANIMATION_CONFIG.rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={fadeInUpVariants}
    >
      <a href={link} target="_blank" rel="noopener noreferrer"><Icon /></a>
    </motion.div>
  );
}

export { Social };
