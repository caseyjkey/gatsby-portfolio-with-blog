import React, { lazy, useRef, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import { format, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import { fadeInUpVariants } from '../../animations'
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation'
import { ANIMATION_CONFIG, SECONDARY_DELAYS, PROGRESSIVE_STAGGER } from '../../animations/config'
import { theme } from '../style'
import Project from '../Projects/Project'
import { isSectionHeaderVisible } from '../../animations/utils/headerVisibility'

interface FeaturedProject {
  node: {
    project: string;
    title: string;
    subtitle: string;
    description: string;
    image: {
      childImageSharp: {
        gatsbyImageData: any;
      };
    };
    galleryImages?: Array<{
      image: {
        publicURL: string;
        childImageSharp?: {
          gatsbyImageData: any;
        };
      };
    }>;
    icons?: {
      di?: string[];
      fa?: string[];
      io?: string[];
      gr?: string[];
      si?: string[];
    };
    start: string;
    end?: {
      date: string;
      present: boolean;
    };
    link?: string;
  };
}

const FeaturedSection = styled.section`
  padding: 6em 0;
  background-color: ${theme.white};
`;

const FeaturedWork = () => {
  // Use the optimized hook for viewport detection
  const { ref: sectionRef, isInView: isVisible } = useInViewAnimation({
    once: true,
  });

  const { ref: subheaderRef, isInView: isSubheaderVisible } = useInViewAnimation({
    once: true,
  });

  const data = useStaticQuery(
    graphql`{
      allProject(filter: {project: {in: ["datacatalog", "farmx", "yelp"]}}) {
        edges {
          node {
            project
            title
            subtitle
            description
            image {
              childImageSharp {
                gatsbyImageData(width: 605, height: 350, layout: CONSTRAINED)
              }
            }
            galleryImages {
              image {
                publicURL
                childImageSharp {
                  gatsbyImageData(layout: FULL_WIDTH)
                }
              }
            }
            icons {
              di
              fa
              io
              si
            }
            start
            end {
              date
              present
            }
            link
          }
        }
      }
    }`
  );

  // Get components for icons specified in projects.json
  function loadIcons(iconMap: FeaturedProject['node']['icons'] = {}) {
    let Icons = [];
    if (!iconMap) return Icons;

    for (let type of Object.keys(iconMap)) {
      if (iconMap[type]) {
        iconMap[type].map((Icon: string) => {
          if (type === "fa") {
            Icons.push(lazy(() =>
              import('react-icons/fa').then(module => ({ default: module[Icon] }))
            ));
          }
          else if (type === "io") {
            Icons.push(lazy(() =>
              import('react-icons/io').then(module => ({ default: module[Icon] }))
            ));
          }
          else if (type === "di") {
            Icons.push(lazy(() =>
              import('react-icons/di').then(module => ({ default: module[Icon] }))
            ));
          }
          else if (type === "gr") {
            Icons.push(lazy(() =>
              import('react-icons/gr').then(module => ({ default: module[Icon] }))
            ));
          }
          else if (type === "si") {
            Icons.push(lazy(() =>
              import('react-icons/si').then(module => ({ default: module[Icon] }))
            ));
          }
        })
      }
    }
    return Icons;
  }

  // Calculate delay for project cards
  // Header-aware: first card waits for header if visible, otherwise starts immediately
  const getProjectDelay = (index: number) => {
    if (index === 0) {
      const headerVisible = typeof window !== 'undefined' && isSectionHeaderVisible('FeaturedWork');
      return headerVisible ? 0.3 : 0;
    }
    return index * PROGRESSIVE_STAGGER.cards.staggerIncrement; // Simple sequential stagger
  };

  // Individual viewport detection for each card
  const { ref: card1Ref, isInView: isCard1Visible } = useInViewAnimation({ once: true });
  const { ref: card2Ref, isInView: isCard2Visible } = useInViewAnimation({ once: true });
  const { ref: card3Ref, isInView: isCard3Visible } = useInViewAnimation({ once: true });

  const cardRefs = [card1Ref, card2Ref, card3Ref];
  const cardVisibility = [isCard1Visible, isCard2Visible, isCard3Visible];

  return (
    <FeaturedSection ref={sectionRef} id="FeaturedWork">
      <Container>
        <Row className="g-0 justify-content-center pb-5">
          <Col md={12} className="heading-section text-center">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInUpVariants}
            >
              <h2 style={{ fontSize: '50px', fontWeight: 700, color: theme.black }}>
                Featured Work
              </h2>
            </motion.div>
            <motion.p
              ref={subheaderRef}
              initial="hidden"
              animate={isSubheaderVisible ? 'visible' : 'hidden'}
              custom={{ delay: SECONDARY_DELAYS.default }}
              variants={fadeInUpVariants}
            >
              Highlighted projects from my portfolio.
            </motion.p>
          </Col>
        </Row>
        <Row className="gx-3" style={{ display: 'flex', alignItems: 'stretch' }}>
          {data.allProject.edges.map((project: FeaturedProject, index: number) => {
            const formattedStart = format(parseISO(project.node.start), 'MMMM yyyy')
            const formattedEnd = project.node.end?.present
              ? 'Present'
              : project.node.end?.date
                ? format(parseISO(project.node.end.date), 'MMMM yyyy')
                : formattedStart;

            // Generate post link based on start date and project slug
            const startDate = parseISO(project.node.start);
            const year = format(startDate, 'yyyy');
            const month = format(startDate, 'MM');
            const postLink = `/projects/${year}-${month}-${project.node.project}/`;

            return (
              <Col key={index} md={4} className="pb-4 d-flex align-items-stretch">
                <motion.div
                  ref={cardRefs[index]}
                  initial="hidden"
                  animate={cardVisibility[index] ? "visible" : "hidden"}
                  custom={{ delay: getProjectDelay(index) }}
                  variants={fadeInUpVariants}
                  className="h-100 d-flex flex-column"
                  style={{ width: '100%', alignItems: 'stretch' }}
                >
                  <Project
                    image={project.node.image.childImageSharp.gatsbyImageData}
                    galleryImages={(project.node.galleryImages || [{ "image": project.node.image }])}
                    title={project.node.title}
                    subtitle={project.node.subtitle}
                    icons={loadIcons(project.node.icons)}
                    date={formattedStart + ' - ' + formattedEnd}
                    link={project.node.link}
                    postLink={postLink}
                  >
                    <div dangerouslySetInnerHTML={{ __html: project.node.description }} />
                  </Project>
                </motion.div>
              </Col>
            )
          })}
        </Row>
      </Container>
    </FeaturedSection>
  );
}

export default FeaturedWork;
