import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Favicon from '../data/favicon.png' 
import WebsiteImage from '../data/projects/portfolio/images/portfolio.png'
import { ThemeProvider } from 'styled-components'
import { theme, Body } from '../components/style.ts'
import Navigation from '../components/Navigation'
import { Resume } from '../components/Resume/Resume.tsx'
import Footer from '../components/Footer'

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

export default function ResumePage({ data }) {
    return (
        <Layout>
            {/* Replace with: https://www.gatsbyjs.com/docs/add-seo-component/ */}
            <ThemeProvider theme={theme}>
                <Body>
                    <Navigation />
                    <Resume />
                    <Footer />
                </Body>
            </ThemeProvider>
        </Layout>

    );
};
