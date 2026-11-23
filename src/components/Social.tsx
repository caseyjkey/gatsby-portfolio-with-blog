import type { ComponentType } from 'react';
import { FaLinkedinIn, FaInstagram, FaGithub, FaFacebookF, FaSoundcloud } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useKonamiMode } from '../hooks/useKonamiMode'

type SocialEntry = {
  Icon: ComponentType
  link: string
  label: string
}

/* Default hero socials: X, LinkedIn, Instagram, GitHub */
const defaultSocials: SocialEntry[] = [
  { Icon: FaXTwitter, link: 'https://x.com/thecaseykey', label: 'X (Twitter)' },
  { Icon: FaLinkedinIn, link: 'https://linkedin.com/in/keycasey', label: 'LinkedIn' },
  { Icon: FaInstagram, link: 'https://instagram.com/caseyjgkey', label: 'Instagram' },
  { Icon: FaGithub, link: 'https://github.com/caseyjkey', label: 'GitHub' },
]

/* Konami mode swaps in SoundCloud + Facebook, dropping X and LinkedIn */
const konamiSocials: SocialEntry[] = [
  { Icon: FaSoundcloud, link: 'https://soundcloud.com/trk-daddy-key', label: 'SoundCloud' },
  { Icon: FaFacebookF, link: 'https://www.facebook.com/caseyjkey', label: 'Facebook' },
  { Icon: FaInstagram, link: 'https://instagram.com/caseyjgkey', label: 'Instagram' },
  { Icon: FaGithub, link: 'https://github.com/caseyjkey', label: 'GitHub' },
]

export function getSocialsForMode(konamiMode: boolean): SocialEntry[] {
  return konamiMode ? konamiSocials : defaultSocials
}

/* This is a generic component for placing social links anywhere
   TODO: Use props for social links */
export default function Socials({ className = 'social-list' }: { className?: string }) {
  const konamiMode = useKonamiMode();
  const socials = getSocialsForMode(konamiMode);

  return (
    <ul className={className} data-konami-socials={konamiMode ? 'active' : 'default'}>
      {socials.map(({ Icon, link, label }) => (
        <li key={label}>
          <Social Icon={Icon} link={link} label={label} />
        </li>
      ))}
    </ul>
  );
}

function Social({ link, Icon, label }: { link: string; Icon: ComponentType; label: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <Icon />
    </a>
  );
}

export { Social };
