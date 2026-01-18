import { useStaticQuery, graphql, Link } from 'gatsby'
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Heading } from './style'
import { Container, Row, Col } from 'reactstrap'
import { BlogSection, BlogEntry } from './Blog/style'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { ANIMATION_CONFIG, TIMING, STAGGER, SECONDARY_DELAYS, PROGRESSIVE_STAGGER } from '../animations/config'

// Animated blog entry component
const AnimatedBlogEntry = ({ children, index, initialBatchCount, isLast }: { children: React.ReactNode; index: number; initialBatchCount: number; isLast?: boolean }) => {
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
            { threshold: 0.1, rootMargin: '0px' }
        );

        if (entryRef.current) {
            observer.observe(entryRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    // Only items in the first "screen-full" get the sequential delay

    // Responsive stagger: sequential on desktop, column-based on mobile
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const delay = index < initialBatchCount
        ? 0.3 + (index * STAGGER / 1000)  // Convert STAGGER ms to seconds
        : isDesktop
            ? ((index + 1) % 3) * STAGGER / 1000  // Column-based delay on desktop
            : STAGGER / 1000;  // Fixed delay for mobile

    return (
        <BlogEntry ref={entryRef} className="blog-card-wrapper" isLast={isLast}>
            <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                custom={{ delay, distance: TIMING.primaryUnit.distance }}
                variants={fadeInUpVariants}
            >
                {children}
            </motion.div>
        </BlogEntry>
    );
};


export const Blog = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [initialBatchCount, setInitialBatchCount] = useState(0);

    useLayoutEffect(() => {
        const cards = containerRef.current?.querySelectorAll('.blog-card-wrapper');
        if (!cards) return;

        const viewportHeight = window.innerHeight;
        let count = 0;

        for (let i = 0; i < cards.length; i++) {
            const rect = cards[i].getBoundingClientRect();
            if (rect.top < viewportHeight) {
                count++;
            } else {
                break;
            }
        }
        setInitialBatchCount(count);
    }, []);

    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const [isSubheaderVisible, setIsSubheaderVisible] = useState(false);
    const subheaderRef = React.useRef<HTMLParagraphElement>(null);

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
            { threshold: 0.1, rootMargin: '0px' }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => observer.disconnect();
    }, [isHeaderVisible]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isSubheaderVisible) {
                        setIsSubheaderVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px' }
        );

        if (subheaderRef.current) {
            observer.observe(subheaderRef.current);
        }

        return () => observer.disconnect();
    }, [isSubheaderVisible]);


    return (
        <BlogSection>
            <Container className="">
                <Row className="g-0 justify-content-center pb-5">
                    <Col md={12} className="heading-section text-center">
                        <motion.div
                            ref={headerRef}
                            initial="hidden"
                            animate={isHeaderVisible ? "visible" : "hidden"}
                            custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                            variants={fadeInUpVariants}
                        >
                            <Heading className="mb-4 mt-5">Blog</Heading>
                        </motion.div>
                        <motion.p
                            ref={subheaderRef}
                            initial="hidden"
                            animate={isSubheaderVisible ? 'visible' : 'hidden'}
                            custom={{ delay: SECONDARY_DELAYS.default }}
                            variants={fadeInUpVariants}
                        >
                            Coding, reflecting, evolving.

                        </motion.p>
                    </Col>
                </Row>
                <div ref={containerRef}>
                    <Row>
                        {data.allMdx.nodes.map(
                            ({ id, excerpt, frontmatter, fields }, index) => (
                                <AnimatedBlogEntry
                                    key={id}
                                    index={index}
                                    initialBatchCount={initialBatchCount}
                                    isLast={index === data.allMdx.nodes.length - 1}
                                >
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
                                        <p className="excerpt">{excerpt}</p>
                                    </Link>
                                </AnimatedBlogEntry>
                            )
                        )}
                    </Row>
                </div>
            </Container>
        </BlogSection>
    );
}

