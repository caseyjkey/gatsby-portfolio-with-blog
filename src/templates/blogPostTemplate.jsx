import { graphql, Link } from 'gatsby'
import React from 'react'
import Layout from '../components/Layout'
import { Heading } from '../components/style.js'
import Dump from '../components/Dump'
import styled from 'styled-components'

export const BlogPost = styled.div`
    margin: 0 auto;
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
            <BlogPost>
                <Heading>
                    {frontmatter.title}
                </Heading>
                <p>Date: {post.frontmatter.date}</p>
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