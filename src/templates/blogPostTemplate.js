import { graphql, Link } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import Layout from '../components/Layout'
import Dump from '../components/Dump'

export default function blogPostTemplate({ data, pageContext, children }) {
    
    
    /*
    return (
        <>
            <Dump query={query.mdx} />
            <Dump data={data} />
            <Dump pageContext={pageContext} />
        </>
    ); */
    const { frontmatter, body } = data.mdx; // data is from the exported graphql query below
    const { previous, next, post } = pageContext;
    
    return (
        <Layout>
            <Dump previous={previous} />
            <Dump next={next} />
            <h1>{frontmatter.title}</h1>
            <p>{frontmatter.date}</p>
            <MDXProvider>{children}</MDXProvider>
            {previous === false ? null : (
                <>
                    {previous && (
                        <Link to={previous.fields.slug}>
                            <p>{previous.frontmatter.title}</p>
                        </Link>
                    )}
                </>
            )}
            {next === false ? null : (
                <>
                    {next && (
                        <Link to={next.fields.slug}>
                            <p>{next.frontmatter.title}</p>
                        </Link>
                    )}
                </>
            )}
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