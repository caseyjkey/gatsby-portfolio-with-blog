import React from 'react'
import Layout from '../components/Layout'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Favicon from '../data/favicon.png'
import WebsiteImage from '../data/projects/portfolio/images/portfolio.png'
import { ThemeProvider } from 'styled-components'
import { theme, Body } from '../components/style.ts'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Heading } from '../components/style.ts'
import { Container, Row, Col } from 'reactstrap'
import { ProjectSection } from '../components/Projects/style.ts'
import Project from '../components/Projects/Project'
import { format, parseISO } from 'date-fns'

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

    return (
        <Layout>
        <Helmet>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" />
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
            <Navigation className="mb-4" />
            <ProjectSection name="Projects" className="mt-4">
              <Container fluid={true}>
                <Row noGutters className="justify-content-center pb-5 mt-5">
                  <Col md={12} className="heading-section text-center ">
                    <Heading className="mb-4">Projects</Heading>
                    <p>A mix of client work, late nights, and bold ideas.</p>
                  </Col>
                </Row>
                <Row>
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

                    return (
                      <Col key={index} md={4} className="pb-4">
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
                      </Col>
                    )
                  })}
                </Row>
              </Container>
            </ProjectSection>
            <Footer />
            </Body>
        </ThemeProvider>
        </Layout>
    );
}