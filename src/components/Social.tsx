import React, { useEffect, useState, useRef } from 'react'
import type { ComponentType } from 'react';
import { FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { ANIMATION_CONFIG } from '../animations/config'

/* This is a generic component for placing social links anywhere
   TODO: Use props for social links */
export default function Socials({ className = 'social-list' }: { className?: string }) {
  return (
    <ul className={className}>
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

function Social({ link, Icon }: { link: string; Icon: ComponentType }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <motion.a
      ref={ref}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={fadeInUpVariants}
      aria-label="Social link"
    >
      <Icon />
    </motion.a>
  );
}

export { Social };
