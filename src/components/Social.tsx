import React from 'react'
import { XIcon } from './XIcon'

// SSR-safe icon replacements - using emoji/text fallbacks instead of react-icons
const FaLinkedinIn = ({ size }: { size?: number }) => <span style={{ fontSize: size }}>in</span>;
const FaInstagram = ({ size }: { size?: number }) => <span style={{ fontSize: size }}>📷</span>;
const FaGithub = ({ size }: { size?: number }) => <span style={{ fontSize: size }}>🐙</span>;
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation'

/* This is a generic component for placing social links anywhere
   TODO: Use props for social links */
export default function Socials(props) {
  return (
    <ul className="ftco-footer-social list-unstyled ">
      <li>
        <Social Icon={XIcon}
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
  const { ref, isInView } = useInViewAnimation({
    once: true,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUpVariants}
    >
      <a href={link} target="_blank"><Icon /></a>
    </motion.div>
  );
}
