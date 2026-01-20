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
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { ANIMATION_CONFIG, TIMING, STAGGER, SECONDARY_DELAYS } from '../animations/config'
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation'
import AnimatedSectionContainer from '../components/AnimatedSectionContainer'


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
    const { frontmatter } = data.mdx;
    const { previous, next, post } = pageContext;

    // Header animations
    const { ref: headerRef, isInView: isHeaderVisible } = useInViewAnimation({ once: true });
    const { ref: subheaderRef, isInView: isSubheaderVisible } = useInViewAnimation({ once: true });

    // Navigation links animation
    const { ref: navLinksRef, isInView: isNavLinksVisible } = useInViewAnimation({ once: true });

    return (
        <Layout>
            <ThemeProvider theme={theme}>
                <Body>
                    <Navigation />
                    <Container className="mt-5">
                        <BlogPost>
                            {/* Header with animation */}
                            <motion.div
                                ref={headerRef}
                                initial="hidden"
                                animate={isHeaderVisible ? "visible" : "hidden"}
                                custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                                variants={fadeInUpVariants}
                                className="mb-5"
                            >
                                <Heading className="text-center mb-4">
                                    {frontmatter.title}
                                </Heading>
                            </motion.div>
                            <motion.p
                                ref={subheaderRef}
                                initial="hidden"
                                animate={isSubheaderVisible ? 'visible' : 'hidden'}
                                custom={{ delay: SECONDARY_DELAYS.default }}
                                variants={fadeInUpVariants}
                                className="text-center subheading"
                            >
                                {post.frontmatter.date}
                            </motion.p>

                            {/* Content - sections are created by remark plugin, wrapped in provider for context */}
                            <AnimatedSectionContainer>
                                {children}
                            </AnimatedSectionContainer>

                            {/* Navigation links - animate when scrolled into view */}
                            <motion.div
                                ref={navLinksRef}
                                initial="hidden"
                                animate={isNavLinksVisible ? "visible" : "hidden"}
                                custom={{ delay: 0, distance: TIMING.primaryUnit.distance }}
                                variants={fadeInUpVariants}
                                className="mt-5"
                            >
                                {previous && (
                                    <Link to={previous.fields.slug}>
                                        <p>← {previous.frontmatter.title}</p>
                                    </Link>
                                )}
                                {next && (
                                    <Link to={next.fields.slug}>
                                        <p>{next.frontmatter.title} →</p>
                                    </Link>
                                )}
                            </motion.div>
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
