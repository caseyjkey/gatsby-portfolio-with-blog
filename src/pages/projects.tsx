import React, { Suspense, useLayoutEffect, useState, useRef } from 'react';
import Layout from '../components/Layout'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Favicon from '../data/favicon.png'
import WebsiteImage from '../data/projects/portfolio/images/portfolio.png'
import { ThemeProvider } from 'styled-components'
import { theme, Body, Heading } from '../components/style'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Container, Row, Col } from 'reactstrap'
import { ProjectSection } from '../components/Projects/style'
import Project from '../components/Projects/Project'
import { format, parseISO } from 'date-fns'
import { motion } from 'motion/react'
import { fadeInUpVariants, useInViewAnimation, WAVE_STAGGER, STAGGER, TIMING } from '../animations'

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        canonical
      }
    }
    allProject(sort: {start: DESC}) {
      edges {
        node {
          project
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
          title
          subtitle
          description
          icons {
            di
            fa
            io
            gr
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
  }
`;

export default function ProjectsPage({ data }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialBatchCount, setInitialBatchCount] = useState(0);

  useLayoutEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.project-card-wrapper');
    if (!cards) return;

    const viewportHeight = window.innerHeight;
    let count = 0;

    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (rect.top < viewportHeight) {
        count++;
      } else {
        break;
      }
    }
    setInitialBatchCount(count);
  }, []);

  // Get components for icons specified in projects.json
  function loadIcons(iconMap) {
    let Icons = [];
    const React = require('react');
    const { lazy } = React;

    for (let type of Object.keys(iconMap || {})) {
      if (iconMap[type]) {
        iconMap[type].map(Icon => {
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

  const { ref: headerRef, isInView: isHeaderVisible } = useInViewAnimation();
  const { ref: subheaderRef, isInView: isSubheaderVisible } = useInViewAnimation();

  return (
    <Layout>
      <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1QQK6QY29Z"></script>
        <script>
          {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-1QQK6QY29Z');
            `}
        </script>
        <meta charSet="utf-8" />
        <title>{data.site.siteMetadata.title}</title>
        <meta property='og:title' content="Casey Key's Website" />
        <meta property='og:image' content={WebsiteImage} />
        <meta property='og:description' content={data.site.siteMetadata.description} />
        <meta property='og:url' content={data.site.siteMetadata.canonical} />
        <meta name="description" content={data.site.siteMetadata.description} />
        <link rel="canonical" href={data.site.siteMetadata.canonical} />
        <link rel="icon" type="image/png" href={Favicon} sizes="16x16" />
      </Helmet>
      <ThemeProvider theme={theme}>
        <Body>
          <Navigation />
          <ProjectSection name="Projects" className="">
            <Container fluid={true}>
              <Row noGutters className="justify-content-center pb-5 mt-5">
                <Col md={12} className="heading-section text-center ">
                  <motion.div
                    ref={headerRef}
                    initial="hidden"
                    animate={isHeaderVisible ? 'visible' : 'hidden'}
                    custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                    variants={fadeInUpVariants}
                  >
                    <Heading className="mb-4 mt-5">
                      Projects
                    </Heading>
                  </motion.div>
                  <motion.p
                    ref={subheaderRef}
                    initial="hidden"
                    animate={isSubheaderVisible ? 'visible' : 'hidden'}
                    custom={{ delay: 0.2 }}
                    variants={fadeInUpVariants}
                  >
                    A mix of client work, late nights, and bold ideas.
                  </motion.p>
                </Col>
              </Row>
              <div ref={containerRef} style={{ display: 'flex', alignItems: 'stretch' }}>
                <Row style={{ display: 'flex', alignItems: 'stretch' }}>
                  {data.allProject.edges.map((project, index) => {
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

                    // Only items in the first "screen-full" get the sequential delay
                    const delay = index < initialBatchCount
                      ? 0.3 + (index * STAGGER / 1000)  // Convert STAGGER ms to seconds
                      : STAGGER / 1000;  // Fixed delay for items below the fold
                    const { ref, isInView } = useInViewAnimation();

                    return (
                      <Col key={index} md={4} className="project-card-wrapper pb-4 d-flex align-items-stretch">
                        <motion.div
                          ref={ref}
                          initial="hidden"
                          animate={isInView ? 'visible' : 'hidden'}
                          custom={{ delay }}
                          variants={fadeInUpVariants}
                          style={{ display: 'flex', flexGrow: 1 }}
                        >
                          <Project image={project.node.image.childImageSharp.gatsbyImageData}
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
              </div>
            </Container>
          </ProjectSection>
          <Footer />
        </Body>
      </ThemeProvider>
    </Layout>
  );
}