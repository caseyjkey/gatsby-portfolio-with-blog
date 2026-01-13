import { useStaticQuery, graphql, Link } from 'gatsby'
import React, { useState, useEffect } from 'react'
import { Heading } from './style'
import { Container, Row, Col } from 'reactstrap'
import { BlogSection, BlogEntry } from './Blog/style'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { ANIMATION_CONFIG, TIMING } from '../animations/config'

// Animated blog entry component
const AnimatedBlogEntry = ({ children, index }: { children: React.ReactNode; index: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const entryRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1, rootMargin: ANIMATION_CONFIG.rootMargin }
        );

        if (entryRef.current) {
            observer.observe(entryRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    return (
        <BlogEntry ref={entryRef}>
            <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                custom={{ delay: index * 0.1, distance: TIMING.primaryUnit.distance }}
                variants={fadeInUpVariants}
            >
                {children}
            </motion.div>
        </BlogEntry>
    );
};


export const Blog = (props) => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const headerRef = React.useRef<HTMLDivElement>(null);

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
                        }
                        fields {
                            slug
                        }
                    }
                }
            }
        `
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isHeaderVisible) {
                        setIsHeaderVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1, rootMargin: ANIMATION_CONFIG.rootMargin }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => observer.disconnect();
    }, [isHeaderVisible]);


    return (
        <BlogSection name="Blog">
            <Container fluid={true} className="">
                <Row noGutters className="justify-content-center pb-5">
                    <Col md={12} className="heading-section text-center">
                        <motion.div
                            ref={headerRef}
                            initial="hidden"
                            animate={isHeaderVisible ? "visible" : "hidden"}
                            custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                            variants={fadeInUpVariants}
                        >
                            <Heading className="mb-4 mt-5">Blog</Heading>
                            <p>Coding, reflecting, evolving.</p>
                        </motion.div>
                    </Col>
                </Row>
                <Row>
                    {data.allMdx.nodes.map(
                        ({ id, excerpt, frontmatter, fields }, index) => (
                            <AnimatedBlogEntry key={id} index={index}>
                                <Link to={fields.slug}>
                                    {/* TODO: Implement proper cover image handling - cover is currently a string path */}
                                    {/* {frontmatter.cover ? (
                                        <Image
                                            image={frontmatter.cover.childImageSharp.gatsbyImageData}
                                            className='mx-auto'
                                        />
                                    ) : null} */}
                                    <h1>{frontmatter.title}</h1>
                                    <p>{frontmatter.date}</p>
                                    <p class="excerpt">{excerpt}</p>
                                </Link>
                            </AnimatedBlogEntry>
                        )
                    )}
                </Row>
            </Container>
        </BlogSection>
    );
}

