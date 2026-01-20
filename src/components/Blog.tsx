import { useStaticQuery, graphql, Link } from 'gatsby'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Heading } from './style'
import { Container, Row, Col } from 'reactstrap'
import { BlogSection, BlogEntry } from './Blog/style'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { TIMING, STAGGER, SECONDARY_DELAYS } from '../animations/config'
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation'

// Animated blog entry component using enhanced hook
const AnimatedBlogEntry = ({
    children,
    index,
    isInitialBatch,
    shouldDelayForHeader,
    isCalculated,
    isLast
}: {
    children: React.ReactNode;
    index: number;
    isInitialBatch: boolean;
    shouldDelayForHeader: boolean;
    isCalculated: boolean;
    isLast?: boolean;
}) => {
    const entryRef = useRef<HTMLDivElement>(null);

    // Use enhanced hook with position detection
    const { ref: hookRef, isInView, position } = useInViewAnimation({
        skipAboveViewport: true,
    });

    // Combine refs
    const combinedRef = useCallback((node: HTMLDivElement | null) => {
        entryRef.current = node;
        hookRef(node);
    }, [hookRef]);

    // Default delay is 0 for items that are scrolled into view later.
    let delay = 0;

    // For the initial batch of items visible on load, calculate a staggered delay.
    if (isInitialBatch) {
        // Start with a base delay to allow the header/subheader to animate first.
        const baseDelay = shouldDelayForHeader ? 0.5 : 0;
        // Add a stagger based on the item's index.
        const staggerDelay = index * (STAGGER / 1000);
        delay = baseDelay + staggerDelay;
    }

    // Prevent animation from starting until the initial batch calculation is complete.
    const animateState = isCalculated && isInView ? "visible" : "hidden";

    return (
        <BlogEntry ref={combinedRef} className="blog-card-wrapper" isLast={isLast}>
            <motion.div
                initial={position === 'above' ? false : 'hidden'}
                animate={animateState}
                custom={{
                    delay,
                    distance: TIMING.primaryUnit.distance
                }}
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
    const [isCalculated, setIsCalculated] = useState(false);
    const [shouldDelayForHeader, setShouldDelayForHeader] = useState(false);

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
                            preview
                        }
                    }
                }
            }
        `
    );

    // Use the optimized hook for header viewport detection
    const { ref: headerRef, isInView: isHeaderVisible } = useInViewAnimation({
        once: true,
    });

    // Use the optimized hook for subheader viewport detection
    const { ref: subheaderRef, isInView: isSubheaderVisible } = useInViewAnimation({
        once: true,
    });

    // Calculate initial batch count after DOM is rendered
    useEffect(() => {
        setShouldDelayForHeader(typeof window !== 'undefined' ? window.scrollY < 10 : false);

        const timer = setTimeout(() => {
            const cards = containerRef.current?.querySelectorAll('.blog-card-wrapper');
            if (!cards || cards.length === 0) {
                setIsCalculated(true);
                return;
            }

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
            setIsCalculated(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

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
                    <Row className="g-0 justify-content-center">
                        {data.allMdx.nodes.map(
                            ({ id, excerpt, frontmatter, fields }, index) => (
                                <Col key={id} xs={12} className="pb-4">
                                    <AnimatedBlogEntry
                                        index={index}
                                        isInitialBatch={isCalculated && index < initialBatchCount}
                                        shouldDelayForHeader={shouldDelayForHeader}
                                        isCalculated={isCalculated}
                                        isLast={index === data.allMdx.nodes.length - 1}
                                    >
                                        <Link to={fields.slug}>
                                            <h1>{frontmatter.title}</h1>
                                            <p>{frontmatter.date}</p>
                                            <p className="excerpt">{excerpt?.trim() || fields?.preview}</p>
                                        </Link>
                                    </AnimatedBlogEntry>
                                </Col>
                            )
                        )}
                    </Row>
                </div>
            </Container>
        </BlogSection>
    );
}
