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
import { StaticImage } from 'gatsby-plugin-image'
import Activity from './About/Activity'
import { graphql, useStaticQuery } from 'gatsby'
import { motion } from 'motion/react'
import { fadeInUpVariants, getRootMargin, getThreshold } from '../animations'
import { ANIMATION_CONFIG, TIMING } from '../animations/config'
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation'

export default function About(props) {
  // Use the optimized hook for header viewport detection
  const { ref: headerRef, isInView: isHeaderVisible } = useInViewAnimation({
    once: true,
    rootMargin: ANIMATION_CONFIG.rootMargin,
  });

  // Use the optimized hook for content viewport detection
  const { ref: contentRef, isInView: isContentVisible } = useInViewAnimation({
    once: true,
    rootMargin: ANIMATION_CONFIG.rootMargin,
  });

  // Use the optimized hook for headshot viewport detection
  const { ref: headshotRef, isInView: isHeadshotVisible } = useInViewAnimation({
    once: true,
    rootMargin: ANIMATION_CONFIG.rootMargin,
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
        <Row className="justify-content-center pb-3">
          <Col md={7} className="heading-section text-center ftco-animate">
            <motion.div
              ref={headerRef}
              initial="hidden"
              animate={isHeaderVisible ? "visible" : "hidden"}
              custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
              variants={fadeInUpVariants}
            >
              <Heading className="mb-4">About Me</Heading>
              <p>Technical leadership, strategic mindset, and mission.</p>
            </motion.div>
          </Col>
        </Row>
        <Row noGutters className="block-9 justify-centent-center">
          <Col md="6" lg="6" className="justify-content-center pb-4" style={{ "paddingRight": "0.5rem" }}>
            <Row className="justify-content-center">
              <motion.div
                ref={contentRef}
                initial="hidden"
                animate={isContentVisible ? "visible" : "hidden"}
                variants={fadeInUpVariants}
                custom={{ delay: 0, distance: TIMING.primaryUnit.distance }}
                style={{ width: "100%" }}
              >
                <Col className="col-md-12 heading-section">
                  <Description>
                    <div dangerouslySetInnerHTML={{ __html: data.about.bio }} />
                  </Description>
                  <ul className="about-info mt-4 px-md-0 px-2">
                    {data.about.activities.map((activity, index) => {
                      return (
                        <motion.li
                          key={index}
                          initial="hidden"
                          animate={isContentVisible ? "visible" : "hidden"}
                          custom={{ delay: 0.1 + (index * 0.08) }}
                          variants={fadeInUpVariants}
                        >
                          <Activity description={activity.activity.description}
                            Icon={loadIcon(activity.activity.icon)}
                          />
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* Consultant Identity Placeholder Section
                      NOTE: This section emphasizes the consultant identity. Once the CMS bio
                      is updated with consultant-focused content, you can remove this section
                      or customize it further to complement the CMS content.
                  */}
                  <ConsultantIdentity>
                    <motion.h3
                      initial="hidden"
                      animate={isContentVisible ? "visible" : "hidden"}
                      custom={{ delay: 0.15 }}
                      variants={fadeInUpVariants}
                    >
                      Consultant Approach
                    </motion.h3>
                    <motion.p
                      initial="hidden"
                      animate={isContentVisible ? "visible" : "hidden"}
                      custom={{ delay: 0.2 }}
                      variants={fadeInUpVariants}
                    >
                      <strong>Problem-Solving:</strong> I tackle complex technical challenges by combining deep technical expertise with a strategic, business-first mindset.
                    </motion.p>
                    <motion.p
                      initial="hidden"
                      animate={isContentVisible ? "visible" : "hidden"}
                      custom={{ delay: 0.3 }}
                      variants={fadeInUpVariants}
                    >
                      <strong>Technical Leadership:</strong> I guide teams through architectural decisions, mentor developers, and ensure scalable, maintainable solutions.
                    </motion.p>
                    <motion.p
                      initial="hidden"
                      animate={isContentVisible ? "visible" : "hidden"}
                      custom={{ delay: 0.4 }}
                      variants={fadeInUpVariants}
                    >
                      <strong>Client Partnership:</strong> I bridge the gap between technical requirements and business goals, communicating complex concepts to stakeholders at all levels.
                    </motion.p>
                  </ConsultantIdentity>
                </Col>
              </motion.div>
            </Row>
          </Col>
          <Col lg="6" md="6" className="d-flex">
            <motion.div
              ref={headshotRef}
              initial={{ opacity: 0, x: 20, y: 30 }}
              animate={isHeadshotVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 20, y: 30 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <AboutImage>
                <StaticImage src='./About/images/about.png' alt='Casey Key in a suit' />
              </AboutImage>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </AboutSection>
  );
}
