import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Favicon from '../data/favicon.png' 
import Layout from '../components/Layout'
import Navigation from '../components/Navigation'
import Introduction from '../components/Introduction'
const aboutPromise = import(/* webpackChunkName: 'About' */ "../components/About");
const resumePromise = import(/* webpackChunkName: 'Resume' */ "../components/Resume/Resume");
const servicesPromise = import(/* webpackChunkName: 'Services' */ "../components/Services");
const projectsPromise = import(/* webpackChunkName: 'Projects' */ "../components/Projects");
const hireMePromise = import(/* webpackChunkName: 'HireMe' */ "../components/HireMe");
const contactPromise = import(/* webpackChunkName: 'Contact' */ "../components/Contact");
const footerPromise = import(/* webpackChunkName: 'Footer' */ "../components/Footer");
const About = React.lazy(() => aboutPromise);
const Resume = React.lazy(() => resumePromise);
const Services = React.lazy(() => servicesPromise);
const Projects = React.lazy(() => projectsPromise);
const HireMe = React.lazy(() => hireMePromise);
const Contact = React.lazy(() => contactPromise);
const Footer = React.lazy(() => footerPromise);
import { ThemeProvider } from 'styled-components'
import { theme, Body } from '../components/style.js'
import { initPage } from '../components/main'
import AOS from 'aos'

const IndexPage = ({ data }) => {
  useEffect(() => {
		AOS.init({
			duration: 800,
			easing: 'slide'
		});	 
		initPage();
  });
  
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
        <meta name="description" content={data.site.siteMetadata.description} />
        <link rel="canonical" href="http://caseyjkey.com" />
        <link rel="icon" type="image/png" href={Favicon} sizes="16x16" />
      </Helmet>
      <ThemeProvider theme={theme}>
        <Body>
          <Navigation></Navigation>
          <Introduction></Introduction>
          <About></About>
          <Resume></Resume>
          <Services></Services>
          <Projects></Projects>
          <HireMe status="available"></HireMe>
          <Contact></Contact>
          <Footer></Footer>
        </Body>
      </ThemeProvider>
    </Layout>
  );
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;

export default IndexPage;