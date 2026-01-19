/*
 * TODO: Update CMS Bio Content to Emphasize Consultant Identity
 * =============================================================
 * The bio content is sourced from the CMS (GraphQL query at line 33-48).
 * To emphasize your consultant identity, update the CMS 'bio' field to include:
 *
 * 1. Problem-Solving Approach: Highlight how you approach complex technical
 *    challenges, analyze requirements, and deliver tailored solutions.
 *
 * 2. Technical Leadership: Emphasize your experience leading teams, making
 *    architectural decisions, and guiding technical strategy.
 *
 * 3. Consultant Mindset: Showcase your ability to understand client needs,
 *    communicate technical concepts to non-technical stakeholders, and deliver
 *    business value through technology.
 *
 * Example themes to incorporate:
 * - "I partner with organizations to solve complex technical challenges..."
 * - "As a technical consultant, I bring a strategic approach to..."
 * - "My expertise lies in bridging the gap between business requirements and technical solutions..."
 */

import React, { useEffect, useState, lazy } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from './style'
import { AboutSection, AboutImage, Description, ConsultantIdentity } from './About/style'
// Removed: import { StaticImage } from 'gatsby-plugin-image'
import Activity from './About/Activity'
import { graphql, useStaticQuery } from 'gatsby'
import { motion } from 'motion/react'
import { fadeInUpVariants, getRootMargin, getThreshold } from '../animations'
import { ANIMATION_CONFIG, TIMING, SECONDARY_DELAYS, PROGRESSIVE_STAGGER, ILLUSTRATION, TIMELINE } from '../animations/config'
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation'
import { isSectionHeaderVisible } from '../animations/utils/headerVisibility'

export default function About(props) {
  // Use the optimized hook for header viewport detection
  const { ref: headerRef, isInView: isHeaderVisible } = useInViewAnimation({
    once: true,
  });

  // Use the optimized hook for content viewport detection
  const { ref: contentRef, isInView: isContentVisible } = useInViewAnimation({
    once: true,
  });

  // Use the optimized hook for headshot viewport detection
  const { ref: headshotRef, isInView: isHeadshotVisible } = useInViewAnimation({
    once: true,
  });

  // Use the optimized hook for subheader viewport detection
  const { ref: subheaderRef, isInView: isSubheaderVisible } = useInViewAnimation({
    once: true,
  });

  // Use the optimized hook for bio text viewport detection
  const { ref: bioRef, isInView: isBioVisible } = useInViewAnimation({
    once: true,
  });

  // Use the optimized hook for consultant section viewport detection
  const { ref: consultantRef, isInView: isConsultantVisible } = useInViewAnimation({
    once: true,
  });

  const data = useStaticQuery(
    graphql`{
  about {
    bio
    activities {
      activity {
        description
        icon {
          name
          type
        }
      }
    }
  }
}`
  );

  // Lazyload the an icon component
  // [param] icon {name: String, type: String}
  // [return] Component
  function loadIcon(icon) {
    let moduleName = 'react-icons/' + icon.type;
    if (icon.type === 'gi') {
      return lazy(() =>
        import('react-icons/gi').then(module =>
          ({ default: module[icon.name] })
        )
      );
    }
    else if (icon.type === 'fi') {
      return lazy(() =>
        import('react-icons/fi').then(module =>
          ({ default: module[icon.name] })
        )
      );
    }
    else if (icon.type === 'fa') {
      return lazy(() =>
        import('react-icons/fa').then(module =>
          ({ default: module[icon.name] })
        )
      );
    }
  }

  return (
    <AboutSection name="About" id="about-section">
      <Container className="mt-5">
        <Row className="justify-content-center pb-5">
          <Col md={7} className="heading-section text-center ftco-animate">
            <motion.div
              ref={headerRef}
              initial="hidden"
              animate={isHeaderVisible ? "visible" : "hidden"}
              custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
              variants={fadeInUpVariants}
            >
              <Heading className="mb-4">About Me</Heading>
            </motion.div>
            <motion.p
              ref={subheaderRef}
              initial="hidden"
              animate={isSubheaderVisible ? 'visible' : 'hidden'}
              custom={{ delay: SECONDARY_DELAYS.default }}
              variants={fadeInUpVariants}
            >
              Technical leadership, strategic mindset, and mission.
            </motion.p>
          </Col>
        </Row>
        <Row>
          <motion.div
            ref={bioRef}
            initial="hidden"
            animate={isBioVisible ? "visible" : "hidden"}
            custom={{
              // Header-aware delay: if header is visible, wait for it; otherwise start immediately
              delay: (typeof window !== 'undefined' && isSectionHeaderVisible('about-section')) ? 0.5 : 0,
              distance: TIMING.primaryUnit.distance
            }}
            variants={fadeInUpVariants}
            style={{ width: "100%" }}
          >
            <Description>
              <div dangerouslySetInnerHTML={{ __html: data.about.bio }} />
            </Description>
          </motion.div>
        </Row>
        <Row className="g-0 block-9 justify-centent-center mt-4">
          <Col md="6" lg="6" className="justify-content-center pb-4" style={{ "paddingRight": "0.5rem" }}>
            <Row className="justify-content-center">
              <motion.div
                ref={contentRef}
                initial="hidden"
                animate={isContentVisible ? "visible" : "hidden"}
                variants={fadeInUpVariants}
                custom={{ delay: 0.7, distance: TIMING.primaryUnit.distance }}
                style={{ width: "100%" }}
              >
                <Col className="col-md-12 heading-section">
                  <ul className="about-info px-md-0 px-2">
                    {data.about.activities.map((activity, index) => {
                      return (
                        <motion.li
                          key={index}
                          initial="hidden"
                          animate={isContentVisible ? "visible" : "hidden"}
                          custom={{
                            delay: 0.1, // All animate at 0.7s + 0.1s = 0.8s total
                            distance: TIMING.primaryUnit.distance
                          }}
                          variants={fadeInUpVariants}
                        >
                          <Activity
                            description={activity.activity.description}
                            Icon={loadIcon(activity.activity.icon)}
                            icon={activity.activity.icon}
                            isVisible={isContentVisible}
                            delay={0.1} // All icons animate at 0.7s + 0.1s = 0.8s total
                          />
                        </motion.li>
                      );
                    })}
                  </ul>
                </Col>
              </motion.div>
            </Row>
          </Col>
          <Col lg="6" md="6" className="d-flex justify-content-center">
            <motion.div
              ref={headshotRef}
              initial="hidden"
              animate={isHeadshotVisible ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              custom={{ delay: 0.7, distance: TIMING.primaryUnit.distance }}
              style={{ width: "100%" }}
            >
              <motion.div
                initial={{ opacity: 0, x: 20, y: 30 }}
                animate={isHeadshotVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 20, y: 30 }}
                transition={{ duration: ILLUSTRATION.element.duration, delay: ILLUSTRATION.element.delay }}
              >
                <AboutImage>
                  <img src="/about.webp" alt="Casey Key in a suit" />
                </AboutImage>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <motion.div
              ref={consultantRef}
              initial="hidden"
              animate={isConsultantVisible ? "visible" : "hidden"}
              custom={{ delay: 1.0, distance: TIMING.primaryUnit.distance }}
              variants={fadeInUpVariants}
              style={{ width: "100%" }}
            >
              {/* Consultant Identity Placeholder Section
                  NOTE: This section emphasizes the consultant identity. Once the CMS bio
                  is updated with consultant-focused content, you can remove this section
                  or customize it further to complement the CMS content.
              */}
              <ConsultantIdentity>
                <motion.h3
                  initial="hidden"
                  animate={isConsultantVisible ? "visible" : "hidden"}
                  custom={{ delay: 0.2, distance: TIMING.primaryUnit.distance }}
                  variants={fadeInUpVariants}
                >
                  Consultant Approach
                </motion.h3>
                {[
                  '<strong>Problem-Solving:</strong> I tackle complex technical challenges by combining deep technical expertise with a strategic, business-first mindset.',
                  '<strong>Technical Leadership:</strong> I guide teams through architectural decisions, mentor developers, and ensure scalable, maintainable solutions.',
                  '<strong>Client Partnership:</strong> I bridge the gap between technical requirements and business goals, communicating complex concepts to stakeholders at all levels.',
                ].map((bullet, index) => (
                  <motion.p
                    key={index}
                    initial="hidden"
                    animate={isConsultantVisible ? "visible" : "hidden"}
                    custom={{
                      delay: 0.8 + (index * TIMELINE.bullet.staggerIncrement), // Added 0.4s to previous 0.4, 0.5, 0.6
                      distance: TIMING.primaryUnit.distance
                    }}
                    variants={fadeInUpVariants}
                    dangerouslySetInnerHTML={{ __html: bullet }}
                  />
                ))}
              </ConsultantIdentity>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </AboutSection>
  );
}
