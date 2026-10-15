import type { ComponentType } from 'react';
import { FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

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
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Social link"
    >
      <Icon />
    </a>
  );
}

export { Social };
