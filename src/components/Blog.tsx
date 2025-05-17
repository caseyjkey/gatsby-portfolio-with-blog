import { useStaticQuery, graphql, Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import React from 'react'
import { Heading } from './style.ts' // Global styled-components
import { Container, Row, Col } from 'reactstrap'
import { BlogSection, BlogEntry } from './Blog/style.ts'
import styled from 'styled-components'

const Image = styled(GatsbyImage)`
    border-radius: 5px;
    width: 75%;
    margin: 0 auto;
`;


export const Blog = (props) => {
    const data = useStaticQuery(
        graphql`
            query {
                allMdx(
                    sort: {frontmatter: {date: DESC}}
                    filter: { frontmatter: { published: { eq: true } } }
                ) {
                    nodes {
                        id
                        excerpt(pruneLength: 250)
                        frontmatter {
                            title
                            date(formatString: "YYYY MMMM Do")
                            cover {
                                publicURL
                                childImageSharp {
                                  gatsbyImageData(width: 2000) 
                                }
                            }
                        }
                        fields {
                            slug
                        }
                    }
                }
            }
        `
    );


    return (
        <BlogSection name="Blog">
            <Container fluid={true} className="">
                <Row noGutters className="justify-content-center pb-5">
                    <Col md={12} className="heading-section text-center">
                        <Heading className="mb-4">Blog</Heading>
                        <p>Coding, reflecting, evolving.</p>
                    </Col>
                </Row>
                <Row>
                    {data.allMdx.nodes.map(
                        ({ id, excerpt, frontmatter, fields }) => (
                            <BlogEntry key={id}>
                                <Link to={fields.slug}>
                                    {frontmatter.cover ? (
                                        <Image
                                            image={frontmatter.cover.childImageSharp.gatsbyImageData}
                                            className='mx-auto'
                                        />
                                    ) : null}
                                    <h1>{frontmatter.title}</h1>
                                    <p>{frontmatter.date}</p>
                                    <p class="excerpt">{excerpt}</p>
                                </Link>
                            </BlogEntry>
                        )
                    )}
                </Row>
            </Container>
        </BlogSection>
    );
}

