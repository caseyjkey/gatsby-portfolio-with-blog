import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Favicon from '../data/favicon.png' 
import Layout from '../components/Layout'
import Navigation from '../components/Navigation'
import Introduction from '../components/Introduction'
import About from '../components/About'
import Skills from '../components/Skills'
import Services from '../components/Services'
import HireMe from '../components/Hire'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { ThemeProvider } from 'styled-components'
import { theme, Body } from '../components/style.ts'
import { initPage } from '../components/main'
import AOS from 'aos'
import { SEO } from '../components/SEO'

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
      <ThemeProvider theme={theme}>
        <Body>
          <Navigation />
          <Introduction />
          <Skills />
          {/* <Services />
          <HireMe status="available" /> */}
          <Footer />
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
        canonical
      }
    }
  }
`;

export default IndexPage;

export const Head = () => (
  <SEO />
)