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
import { Heading } from './style.ts'
import { AboutSection, AboutImage, Description, ConsultantIdentity } from './About/style.ts'
import { StaticImage } from 'gatsby-plugin-image'
import Activity from './About/Activity.tsx'
import { graphql, useStaticQuery } from 'gatsby'
import { motion } from 'motion/react'
import { fadeInUpVariants, getRootMargin, getThreshold } from '../animations'
import { ANIMATION_CONFIG } from '../animations/config'

export default function About(props) {
  const [isVisible, setIsVisible] = useState(false);

  // Check if mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: isMobile() ? getThreshold(true) : 0,
        rootMargin: getRootMargin(isMobile()),
      }
    );

    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => observer.disconnect();
  }, []);

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
      <Container>
        <Row className="justify-content-center pb-3">
          <Col md={7} className="heading-section text-center ftco-animate">
            <Heading className="mb-4">About Me</Heading>
          </Col>
        </Row>
        <Row noGutters className="block-9 justify-centent-center">
          <Col md="6" lg="6" className="justify-content-center pb-4" style={{ "paddingRight": "0.5rem" }}>
            <Row className="justify-content-center">
              <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={fadeInUpVariants}
                style={{ width: "100%" }}
              >
                <Col className="col-md-12 heading-section">
                  <Description>
                    <div dangerouslySetInnerHTML={{ __html: data.about.bio }} />
                  </Description>
                  <ul className="about-info mt-4 px-md-0 px-2">
                    {data.about.activities.map((activity, index) => {
                      return (
                        <li key={index}>
                          <Activity description={activity.activity.description}
                            Icon={loadIcon(activity.activity.icon)}
                          />
                        </li>
                      );
                    })}
                  </ul>

                  {/* Consultant Identity Placeholder Section
                      NOTE: This section emphasizes the consultant identity. Once the CMS bio
                      is updated with consultant-focused content, you can remove this section
                      or customize it further to complement the CMS content.
                  */}
                  <ConsultantIdentity>
                    <h3>Consultant Approach</h3>
                    <p>
                      <strong>Problem-Solving:</strong> I tackle complex technical challenges by combining deep technical expertise with a strategic, business-first mindset.
                    </p>
                    <p>
                      <strong>Technical Leadership:</strong> I guide teams through architectural decisions, mentor developers, and ensure scalable, maintainable solutions.
                    </p>
                    <p>
                      <strong>Client Partnership:</strong> I bridge the gap between technical requirements and business goals, communicating complex concepts to stakeholders at all levels.
                    </p>
                  </ConsultantIdentity>
                </Col>
              </motion.div>
            </Row>
          </Col>
          <Col lg="6" md="6" className="d-flex">
            <AboutImage>
              <StaticImage src='./About/images/about.png' alt='Casey Key in a suit' />
            </AboutImage>
          </Col>
        </Row>
      </Container>
    </AboutSection>
  );
}
