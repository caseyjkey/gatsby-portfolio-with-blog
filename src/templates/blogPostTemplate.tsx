import { graphql, Link } from 'gatsby'
import React from 'react'
import Layout from '../components/Layout'
import { Heading } from '../components/style.ts'
import Dump from '../components/Dump'
import styled, { ThemeProvider } from 'styled-components'
import { theme, Body } from '../components/style'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export const BlogPost = styled.div`
    margin: 0 auto;
    margin-top: 6em;
    max-width: 800px;
    padding: 20px;
`;

export default function BlogPostTemplate({ data, pageContext, children }) {
    
    
    /*
    return (
        <>
            <Dump query={query.mdx} />
            <Dump data={data} />
            <Dump pageContext={pageContext} />
        </>
    ); */
    const { frontmatter } = data.mdx; // data is from the exported graphql query below
    const { previous, next, post } = pageContext;
    return (
        <Layout>
            <ThemeProvider theme={theme}>
                <Body>
                    <Navigation />
                    <BlogPost>
                        <Heading className="text-center">
                            {frontmatter.title}
                        </Heading>
                        <p className="text-center">{post.frontmatter.date}</p>
                        {children}
                        {previous && (
                            <>
                                {previous && (
                                    <Link to={previous.fields.slug}>
                                        <p>{previous.frontmatter.title}</p>
                                    </Link>
                                )}
                            </>
                        )}
                        {next && (
                            <>
                                {next && (
                                    <Link to={next.fields.slug}>
                                        <p>{next.frontmatter.title}</p>
                                    </Link>
                                )}
                            </>
                        )}
                    </BlogPost>
                    <Footer />
                </Body>
            </ThemeProvider>
        </Layout>
    );
}

export const query = graphql`
        query PostsBySlug($slug: String) {
            mdx(fields: { slug: { eq: $slug } }) {
                frontmatter {
                    title
                }
            }
        }
    `;