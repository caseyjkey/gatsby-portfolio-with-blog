import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { IoMdArrowRoundDown } from 'react-icons/io';
import Typewriter from 'typewriter-effect/dist/core';
import { HERO_TIMING, EASING, fadeInUpVariants } from '../../animations';
import { CSS_TRANSITIONS } from '../../animations/config';
import introductionData from '../../data/introduction.json';
import Socials from '../Social';
import './hero.scss';

// === Blob SVG Components ===
const MobileBlob = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="-150 20 600 350"
    preserveAspectRatio="none"
  >
    <path d="M 162,94.8 C 129.81195,93.8403 99.15574,84.930003 69.877152,75.179436 40.59857,65.42887 11.608446,54.624763 -19.808717,49.459437 c -20.207038,-3.3227 -43.313601,-3.791886 -59.59661,5.498023 -15.666306,8.957214 -20.729253,24.376417 -23.454693,38.69517 -2.04408,10.7785 -3.25262,22.11579 2.36238,32.20332 3.894189,7.00368 10.812228,12.88984 15.596681,19.59923 16.641093,23.33993 4.878933,52.12244 -13.159698,74.91214 -8.454833,10.68896 -18.272383,20.90016 -24.802493,32.27157 -6.53012,11.3714 -9.54899,24.41907 -3.83949,36.02932 5.66474,11.51642 19.15765,20.14948 33.769589,26.22758 29.686403,12.3439 64.65459,15.87985 98.7822629,17.88031 75.5066201,4.43168 151.4210581,2.51228 227.1265981,0.59287 28.02032,-0.71231 56.15998,-1.43315 83.72273,-5.14826 15.30822,-2.06443 31.11377,-5.3402 42.22441,-13.22255 14.10463,-10.03634 17.60095,-27.03373 8.15146,-39.61648 -15.8553,-21.10917 -59.68116,-26.35553 -70.77689,-49.00875 -6.1024,-12.46759 0.16413,-26.3598 9.02677,-37.92314 19.01841,-24.81147 50.89312,-46.57324 52.57414,-74.93347 C 359.05227,94.04077 343.72913,74.535369 320.0357,65.31797 295.1984,55.656976 260.76237,56.872597 242.4502,72.863357 223.57106,89.31051 190.41817,95.64454 162,94.8 Z" opacity="0.5" fill="#3e64ff" />
  </svg>
);

const DesktopBlob = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="-150 20 600 350"
    preserveAspectRatio="none"
  >
    <path d="M 162,94.8 C 129.81195,93.8403 99.15574,84.930003 69.877152,75.179436 40.59857,65.42887 11.608446,54.624763 -19.808717,49.459437 c -20.207038,-3.3227 -43.313601,-3.791886 -59.59661,5.498023 -15.666306,8.957214 -20.729253,24.376417 -23.454693,38.69517 -2.04408,10.7785 -3.25262,22.11579 2.36238,32.20332 3.894189,7.00368 10.812228,12.88984 15.596681,19.59923 16.641093,23.33993 4.878933,52.12244 -13.159698,74.91214 -8.454833,10.68896 -18.272383,20.90016 -24.802493,32.27157 -6.53012,11.3714 -9.54899,24.41907 -3.83949,36.02932 5.66474,11.51642 19.15765,20.14948 33.769589,26.22758 29.686403,12.3439 64.65459,15.87985 98.7822629,17.88031 75.5066201,4.43168 151.4210581,2.51228 227.1265981,0.59287 28.02032,-0.71231 56.15998,-1.43315 83.72273,-5.14826 15.30822,-2.06443 31.11377,-5.3402 42.22441,-13.22255 14.10463,-10.03634 17.60095,-27.03373 8.15146,-39.61648 -15.8553,-21.10917 -59.68116,-26.35553 -70.77689,-49.00875 -6.1024,-12.46759 0.16413,-26.3598 9.02677,-37.92314 19.01841,-24.81147 50.89312,-46.57324 52.57414,-74.93347 C 359.05227,94.04077 343.72913,74.535369 320.0357,65.31797 295.1984,55.656976 260.76237,56.872597 242.4502,72.863357 223.57106,89.31051 190.41817,95.64454 162,94.8 Z" opacity="0.5" fill="#3e64ff" />
  </svg>
);

// === Primary Button (native, replaces BootstrapButton) ===
function PrimaryButton({ children, onClick, id }: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  id?: string;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      className="btn btn-primary"
      type="button"
    >
      {children}
    </button>
  );
}

// === Falling Arrow (consolidated from Mouse.tsx) ===
function FallingArrow() {
  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const isMobile = window.innerWidth < 992;
    const offset = isMobile ? -80 : -85;

    const element = document.getElementById('Skills');
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="hero-falling-arrow" onClick={handleScroll}>
      <div className="hero-falling-arrow__container">
        <motion.div
          className="hero-falling-arrow__motion"
          animate={{
            y: [-10, 17],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.6,
            times: [0, 0.3, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <IoMdArrowRoundDown color="#3e64ff" fontSize="25px" />
        </motion.div>
      </div>
    </div>
  );
}

// === Main Hero Section ===
export default function HeroSection() {
  const headers = introductionData.descriptions.map(({ description }) => description.header);
  const subheaders = introductionData.descriptions.map(({ description }) => description.subheader);

  const typingSpeed = 35;
  const deleteSpeed = 10;
  const pauseDelay = 7000;

  const [headerEnd, setHeaderEnd] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const textRef = useRef<HTMLDivElement>(null);

  const endHeader = () => {
    setHeaderEnd(true);
  };

  // Responsive text scaling based on viewport height
  useEffect(() => {
    const calculateTextScale = () => {
      if (!textRef.current) return;

      const viewportHeight = window.innerHeight;
      const textElement = textRef.current;
      const textRect = textElement.getBoundingClientRect();
      const textTop = textRect.top;

      const availableHeight = viewportHeight - textTop;
      const currentTextHeight = textRect.height;

      const maxHeightPercent = 0.65;
      const maxHeight = availableHeight * maxHeightPercent;

      if (currentTextHeight > maxHeight) {
        const scale = maxHeight / currentTextHeight;
        setTextScale(Math.max(scale, 0.6));
      } else {
        setTextScale(1);
      }
    };

    calculateTextScale();
    window.addEventListener('resize', calculateTextScale);

    return () => window.removeEventListener('resize', calculateTextScale);
  }, [headerEnd]);

  // Trigger entrance animations and typewriter
  useEffect(() => {
    let header = document.getElementById('typewriter1');
    let subheader = document.getElementById('typewriter2');
    let typewriter1 = new Typewriter(header, {
      loop: false,
      delay: typingSpeed,
      deleteSpeed: deleteSpeed,
      autoStart: true,
      cursor: '|',
      cursorClassName: 'typewriter-cursor',
    });

    let typewriter2 = new Typewriter(subheader, {
      loop: false,
      delay: typingSpeed,
      cursor: '|',
      cursorClassName: 'typewriter-cursor',
    });

    function subtyping(string: string) {
      typewriter2
        .typeString(string)
        .start();
    }

    function subdelete() {
      typewriter2
        .deleteAll(1)
        .start();
    }

    // Technical Typewriter Chain
    headers.forEach((header: string, i: number) => {
      typewriter1
        .typeString(header)
        .callFunction(() => subtyping(subheaders[i]))
        .pauseFor(pauseDelay)
        .callFunction(subdelete)
        .pauseFor(subheaders[i].length * deleteSpeed)
        .deleteChars(header.length);
    });

    // Signal the transition to the social layer
    typewriter1
      .callFunction(endHeader)
      .start();
  }, []);

  // Handle the transition to the final text
  useEffect(() => {
    if (headerEnd) {
      const typewriter3 = new Typewriter('#typewriter3', {
        loop: false,
        delay: typingSpeed,
        cursor: '|',
        cursorClassName: 'typewriter-cursor',
      });

      typewriter3
        .pauseFor(850)
        .typeString("Find me on social media.")
        .start();
    }
  }, [headerEnd]);

  const scrollToId = (id: string, offset = 0) => {
    const element = document.getElementById(id);
    if (!element) return;

    const targetY = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section className="hero-wrap" id="Introduction">
      <div className="hero-overlay"></div>

      {/* Desktop Falling Arrow */}
      <div className="hero-desktop-arrow">
        <FallingArrow />
      </div>

      {/* Mobile Falling Arrow */}
      <div className="hero-mobile-arrow">
        <FallingArrow />
      </div>

      {/* Mobile SVG (headshot + blob) */}
      <div className="hero-mobile-svg">
        <motion.div
          initial={{ opacity: 0, scale: HERO_TIMING.portrait.scaleFrom }}
          animate={{ opacity: 1, scale: HERO_TIMING.portrait.scaleTo }}
          transition={{
            duration: HERO_TIMING.portrait.duration / 1000,
            delay: HERO_TIMING.portrait.delay / 1000,
            ease: EASING,
          }}
        >
          <div className="hero-mobile-headshot-container">
            <MobileBlob className="hero-mobile-blob" />
            <img className="hero-mobile-headshot-img" src="/mobile-headshot.webp" alt="Casey Key" />
          </div>
        </motion.div>
      </div>

      {/* Resume Button */}
      <div className={`hero-resume-btn is-visible container`}>
        <div className="hero-resume-btn__row">
          <div className="hero-resume-btn__col">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={{ delay: HERO_TIMING.cta.delay / 1000 }}
              variants={fadeInUpVariants}
            >
              <PrimaryButton
                id="resume"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('experience-scroll-trigger'));
                  scrollToId('Experience', 40);
                }}
              >
                View Experience
              </PrimaryButton>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Desktop Illustration */}
      <div className="hero-desktop-illustration">
        <motion.div
          initial={{ opacity: 0, scale: HERO_TIMING.portrait.scaleFrom }}
          animate={{ opacity: 1, scale: HERO_TIMING.portrait.scaleTo }}
          transition={{
            duration: HERO_TIMING.portrait.duration / 1000,
            delay: HERO_TIMING.portrait.delay / 1000,
            ease: EASING,
          }}
        >
          <div className="hero-desktop-headshot-container">
            <DesktopBlob className="hero-desktop-blob" />
            <img className="hero-desktop-headshot-img" src="/headshot.webp" alt="Casey Key" />
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="hero-animated-content">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-grid__content text-center">
              <div
                ref={textRef}
                className="hero-text"
                style={{ transform: `scale(${textScale})`, transformOrigin: 'top center' }}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  custom={{ delay: HERO_TIMING.hello.delay / 1000 }}
                  variants={fadeInUpVariants}
                >
                  <h3 className="hero-subheader">{introductionData.greeting}</h3>
                </motion.div>

                <div className="hero-slider">
                  <motion.h2
                    className="subheader"
                    initial="hidden"
                    animate="visible"
                    custom={{ delay: HERO_TIMING.intro.delay / 1000 }}
                    variants={fadeInUpVariants}
                  >
                    I'm <span id="name">{introductionData.name}</span>, the {introductionData.role}.
                  </motion.h2>

                  <motion.div
                    id="typewriter"
                    initial="hidden"
                    animate="visible"
                    custom={{ delay: HERO_TIMING.typewriter.delay / 1000 }}
                    variants={fadeInUpVariants}
                    style={{ transition: 'none' }}
                  >
                    {/* TECH VIEW LAYER (visible first) */}
                    <div className={`view-layer tech-view${headerEnd ? ' is-finished' : ''}`}>
                      <h2 className="subheader">Focused on...</h2>
                      <h2 id="typewriter1" className="subheader"></h2>
                      <h2 id="typewriter2" className="subheader"></h2>
                    </div>

                    {/* SOCIAL VIEW LAYER (fades in after) */}
                    <div className={`view-layer social-view${headerEnd ? ' is-finished' : ''}`}>
                      <h2 id="typewriter3" className="subheader"></h2>
                      <div className={`hero-social-style${headerEnd ? ' is-finished' : ''}`}>
                        <Socials />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            {/* Empty right column to maintain layout structure */}
            <div className="hero-grid__spacer d-none d-md-block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
