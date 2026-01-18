import { graphql, Link } from 'gatsby'
import React from 'react'
import Layout from '../components/Layout'
import { Heading } from '../components/style.ts'
import Dump from '../components/Dump'
import styled, { ThemeProvider } from 'styled-components'
import { theme, Body } from '../components/style'
import { lighten } from 'polished'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Container } from 'reactstrap'

export const BlogPost = styled.div`
    margin-top: 6em;
    padding-bottom: 0.5rem;
    color: ${props => props.theme.black};

    /* Ensure all child elements inherit black text, but not code blocks */
    p, li {
        color: ${props => props.theme.black};
    }

    /* Subheading uses lighter grey like other pages */
    .subheading {
        color: ${props => lighten(0.60, props.theme.black)};
    }
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
                    <Container className="mt-5">
                        <BlogPost>
                            <div className="mb-5">
                                <Heading className="text-center mb-4">
                                    {frontmatter.title}
                                </Heading>
                                <p className="text-center subheading">{post.frontmatter.date}</p>
                            </div>
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
                    </Container>
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