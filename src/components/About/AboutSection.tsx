import React from 'react';
import type { ComponentType } from 'react';
import { motion, type Variants } from 'motion/react';
import { FaLaptopCode } from 'react-icons/fa';
import { FiBookOpen, FiMusic } from 'react-icons/fi';
import { GiBackpack } from 'react-icons/gi';
import AnimatedSection from '../AnimatedSection';
import { ILLUSTRATION, TIMELINE } from '../../animations/config';
import aboutData from '../../data/about.json';
import './about.scss';

type AboutIcon = {
  name: string;
  type: string;
};

const FallbackIcon: ComponentType = () => <span aria-hidden="true">?</span>;
const activityIcons: Record<string, ComponentType> = {
  GiBackpack,
  FiBookOpen,
  FiMusic,
  FaLaptopCode,
};

function loadIcon(
  icon: AboutIcon
): ComponentType {
  return activityIcons[icon.name] ?? FallbackIcon;
}

interface ActivityProps {
  Icon: React.ComponentType;
  description: string;
  icon?: { name?: string };
  isVisible?: boolean;
  delay?: number;
}

function Activity({
  Icon,
  description,
  icon,
  isVisible = false,
  delay = 0,
}: ActivityProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0,
        }}
        transition={{
          duration: TIMELINE.dot.duration,
          delay,
          ease: TIMELINE.dot.ease,
        }}
      >
        <div
          className="about-section__activity-icon"
          data-icon-name={icon?.name}
        >
          <Icon />
        </div>
      </motion.div>
      <span dangerouslySetInnerHTML={{ __html: description }} />
    </>
  );
}

const consultantBullets = [
  '<strong>Problem-Solving:</strong> I tackle complex technical challenges by combining deep technical expertise with a strategic, business-first mindset.',
  '<strong>Technical Leadership:</strong> I guide teams through architectural decisions, mentor developers, and ensure scalable, maintainable solutions.',
  '<strong>Client Partnership:</strong> I bridge the gap between technical requirements and business goals, communicating complex concepts to stakeholders at all levels.',
];

const consultantGroupVariants: Variants = {
  hidden: {},
  visible: {},
};

const consultantItemVariants = (index: number): Variants => ({
  hidden: {
    opacity: 0,
    y: 30,
    willChange: 'opacity, transform',
  },
  visible: (timing?: { duration?: number }) => {
    const duration = timing?.duration ?? 0.6;
    const timingScale = duration / 0.6;

    return {
      opacity: 1,
      y: 0,
      willChange: 'auto',
      transition: {
        duration,
        delay: index * 0.1 * timingScale,
        ease: [0.25, 0.1, 0.25, 1],
      },
    };
  },
});

export default function AboutSection() {
  return (
    <section className="about-section" id="about-section">
      <div className="container">
        {/* Header */}
        <AnimatedSection className="about-section__header">
          <h2 className="about-section__heading">About Me</h2>
          <p className="about-section__subheader">
            Technical leadership, strategic mindset, and mission.
          </p>
        </AnimatedSection>

        {/* Bio */}
        <AnimatedSection>
          <div className="about-section__bio">
            <div dangerouslySetInnerHTML={{ __html: aboutData.bio }} />
          </div>
        </AnimatedSection>

        {/* Activities + Headshot Grid */}
        <div className="about-section__content-grid">
          {/* Activities Column */}
          <div className="about-section__activities-col">
            <AnimatedSection delay={0.7}>
              <ul className="about-section__activities">
                {aboutData.activities.map((activity, index) => (
                  <AnimatedSection
                    key={index}
                    delay={0.1}
                  >
                    <li>
                      <Activity
                        description={activity.activity.description}
                        Icon={loadIcon(activity.activity.icon)}
                        icon={activity.activity.icon}
                        isVisible={true}
                        delay={0.1}
                      />
                    </li>
                  </AnimatedSection>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          {/* Headshot Column */}
          <div className="about-section__headshot-col">
            <AnimatedSection delay={0.7}>
              <motion.div
                initial={{ opacity: 0, x: 20, y: 30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: ILLUSTRATION.element.duration,
                  delay: ILLUSTRATION.element.delay,
                }}
              >
                <div className="about-section__image">
                  <img src="/about.webp" alt="Casey Key in a suit" />
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>

        {/* Consultant Approach */}
        <div className="about-section__consultant-wrapper">
          <AnimatedSection
            className="about-section__consultant"
            delay={0}
            duration={600}
            rootMargin="0px"
            threshold={0}
            trackViewportEdges
            variants={consultantGroupVariants}
          >
            <motion.h3 variants={consultantItemVariants(0)}>Consultant Approach</motion.h3>
            {consultantBullets.map((bullet, index) => (
              <motion.p
                key={index}
                variants={consultantItemVariants(index + 1)}
                dangerouslySetInnerHTML={{ __html: bullet }}
              />
            ))}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
