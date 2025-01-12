import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Favicon from '../data/favicon.png' 
import WebsiteImage from '../data/projects/portfolio/images/portfolio.png'
import { ThemeProvider } from 'styled-components'
import { theme, Body } from '../components/style.ts'
import Navigation from '../components/Navigation'
import { Blog } from '../components/Blog'
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

export default function BlogPage({ data }) {
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
            <meta property='og:title' content="Casey Key - Software Engineer" />
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
            <Blog />
            <Footer />
            </Body>
        </ThemeProvider>
        </Layout>
    );
}