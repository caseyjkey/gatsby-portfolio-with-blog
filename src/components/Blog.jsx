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
}