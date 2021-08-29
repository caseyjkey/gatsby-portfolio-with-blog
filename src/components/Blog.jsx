import React from 'react'

import { Heading } from './style.js' // Global styled-components
import { Container, Row, Col } from 'reactstrap'
import { BlogSection } from './Blog/style.js'

export const Blog = (props) => {
    return (
        <BlogSection name="Blog">
            <Container fluid={true} className="">
                <Row noGutters className="justify-content-center pb-5">
                    <Col md={12} className="heading-section text-center">
                        <Heading className="mb-4">Blog</Heading>
                        <p>My place to let my thoughts flow and grow.</p>
                    </Col>
                </Row>
                <Row>
                    {}
                </Row>
            </Container>
        </BlogSection>
    );

export const query = graphql`
    query SITE_INDEX_QUERY {
        allMdx(
            sort: { fields: [frontmatter___date], order: DESC }
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
}