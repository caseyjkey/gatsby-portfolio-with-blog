import React, { Fragment, lazy, Suspense } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import { motion } from 'motion/react';
import AnimatedSection from '../AnimatedSection';
import {
  TIMING,
  SECONDARY_DELAYS,
  ILLUSTRATION,
  TIMELINE,
} from '../../animations/config';
import aboutData from '../../data/about.json';
import './about.scss';

type AboutIcon = {
  name: string;
  type: string;
};

const FallbackIcon: ComponentType = () => <span aria-hidden="true">?</span>;

// Lazyload an icon component
// [param] icon {name: String, type: String}
// [return] Component
const createIconLoader = (
  importer: () => Promise<unknown>,
  name: string
): LazyExoticComponent<ComponentType> =>
  lazy(async () => {
    const module = (await importer()) as Record<string, ComponentType>;
    return { default: module[name] ?? FallbackIcon };
  });

function loadIcon(
  icon: AboutIcon
): LazyExoticComponent<ComponentType> | ComponentType {
  if (icon.type === 'gi') {
    return createIconLoader(() => import('react-icons/gi'), icon.name);
  }
  if (icon.type === 'fi') {
    return createIconLoader(() => import('react-icons/fi'), icon.name);
  }
  if (icon.type === 'fa') {
    return createIconLoader(() => import('react-icons/fa'), icon.name);
  }

  return FallbackIcon;
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
  const isSSR = typeof window === 'undefined';

  return (
    <Fragment>
      {!isSSR && (
        <Suspense fallback={<p>Loading...</p>}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              scale: isVisible ? 1 : 0,
            }}
            transition={{
              duration: TIMELINE.dot.duration,
              delay: delay,
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
        </Suspense>
      )}
    </Fragment>
  );
}

const consultantBullets = [
  '<strong>Problem-Solving:</strong> I tackle complex technical challenges by combining deep technical expertise with a strategic, business-first mindset.',
  '<strong>Technical Leadership:</strong> I guide teams through architectural decisions, mentor developers, and ensure scalable, maintainable solutions.',
  '<strong>Client Partnership:</strong> I bridge the gap between technical requirements and business goals, communicating complex concepts to stakeholders at all levels.',
];

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
          <AnimatedSection delay={1.0}>
            <div className="about-section__consultant">
              <AnimatedSection delay={0.2}>
                <h3>Consultant Approach</h3>
              </AnimatedSection>
              {consultantBullets.map((bullet, index) => (
                <AnimatedSection
                  key={index}
                  delay={0.8 + index * TIMELINE.bullet.staggerIncrement}
                >
                  <p dangerouslySetInnerHTML={{ __html: bullet }} />
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
