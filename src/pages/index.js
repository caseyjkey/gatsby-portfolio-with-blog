import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Favicon from '../data/favicon.png' 
import Layout from '../components/Layout'
import Navigation from '../components/Navigation'
import Introduction from '../components/Introduction'
import About from '../components/About'
import Resume from '../components/Resume/Resume'
import Services from '../components/Services'
import { Projects } from '../components/Projects'
import HireMe from '../components/Hire'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
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