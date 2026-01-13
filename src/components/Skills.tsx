import React, { lazy, useRef } from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from './style'
import { SkillsSection, SubsectionTitle, MediumHeading, SectionSubheader } from './Skills/style'
import { Skill } from './Skills/Skill'
import { FullStackIllustration } from './Skills/FullStackIllustration'
import { AiSystemsIllustration } from './Skills/AiSystemsIllustration'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation'
import { ANIMATION_CONFIG, TIMING } from '../animations/config'

export default function Skills() {
    console.log('[Skills.tsx] WORKTREE VERSION - Component rendered');

    // Use the optimized hook for each section's viewport detection
    const { ref: mainHeaderRef, isInView: isVisible } = useInViewAnimation({
        once: true,
        rootMargin: ANIMATION_CONFIG.rootMargin,
    });

    const { ref: fullStackRef, isInView: isFullStackVisible } = useInViewAnimation({
        once: true,
        rootMargin: ANIMATION_CONFIG.rootMargin,
    });

    const { ref: aiSystemsRef, isInView: isAiSystemsVisible } = useInViewAnimation({
        once: true,
        rootMargin: ANIMATION_CONFIG.rootMargin,
    });

    // Lazyload the an icon component
    // [param] icon {String}
    // [return] Component
    function loadIcon(Icon) {
        let iconGroup = Icon.slice(0, 2);
        if (iconGroup === 'Gi') {
            return lazy(() =>
                import('react-icons/gi').then(module =>
                    ({ default: module[Icon] })
                )
            );
        }
        else if (iconGroup === 'Fi') {
            return lazy(() =>
                import('react-icons/fi').then(module =>
                    ({ default: module[Icon] })
                )
            );
        }
        else if (iconGroup === 'Fa') {
            return lazy(() =>
                import('react-icons/fa').then(module =>
                    ({ default: module[Icon] })
                )
            );
        }
        else if (iconGroup === 'Di') {
            return lazy(() =>
                import('react-icons/di').then(module =>
                    ({ default: module[Icon] })
                )
            );
        }
        else if (iconGroup === 'Ri') {
            return lazy(() =>
                import('react-icons/ri').then(module =>
                    ({ default: module[Icon] })
                )
            );
        }
        else if (iconGroup === 'Gr') {
            return lazy(() =>
                import('react-icons/gr').then(module =>
                    ({ default: module[Icon] })
                )
            );
        }
        else if (iconGroup === 'Si') {
            return lazy(() =>
                import('react-icons/si').then(module =>
                    ({ default: module[Icon] })
                )
            );
        }
        else {
            return (<p>Not found.</p>);
        }
    }

    // Calculate delay for skill icons - simple sequential stagger
    const getSkillDelay = (index: number) => {
        return index * 0.08; // Each icon animates 80ms after the previous one
    };

    return (
        <SkillsSection name="Skills">
            <Container>
                <Row noGutters className="justify-content-center pb-2 pt-5">
                    <Col md={12} className="heading-section text-center ">
                        <motion.div
                            ref={mainHeaderRef}
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                            variants={fadeInUpVariants}
                        >
                            <Heading>Core Expertise</Heading>
                            <SectionSubheader>Bridging the gap between complex technical architecture and scalable business solutions.</SectionSubheader>
                        </motion.div>
                    </Col>
                </Row>
                <div>
                    <Row xs={1} md={2} className='pt-4 pb-4'>
                        <Col className='order-lg-1 order-md-1 order-2'>
                            <FullStackIllustration isVisible={isFullStackVisible} />
                        </Col>
                        <Col lg={6} className="animate-box order-lg-2 order-lg-2 order-1">
                            <div align="center">
                                <motion.div
                                    ref={fullStackRef}
                                    initial="hidden"
                                    animate={isFullStackVisible ? "visible" : "hidden"}
                                    custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                                    variants={fadeInUpVariants}
                                >
                                    <MediumHeading className="mb-4">Full Stack Development</MediumHeading>
                                </motion.div>
                                {[
                                    { skill: 'Python', icon: 'FaPython', idx: 0 },
                                    { skill: 'Swift', icon: 'GrSwift', idx: 1 },
                                    { skill: 'C/C++', icon: 'FaCuttlefish', idx: 2 },
                                    { skill: 'Javascript', icon: 'DiJavascript1', idx: 3 },
                                    { skill: 'Java', icon: 'DiJava', idx: 4 },
                                    { skill: 'Ruby', icon: 'DiRuby', idx: 5 },
                                    { skill: 'Bash', icon: 'DiTerminal', idx: 6 },
                                    { skill: 'SQL', icon: 'FaDatabase', idx: 7 },
                                    { skill: 'Dart', icon: 'DiDart', idx: 8 },
                                    { skill: 'React', icon: 'FaReact', idx: 9 },
                                    { skill: 'AWS', icon: 'FaAws', idx: 10 },
                                    { skill: 'Google Cloud', icon: 'SiGooglecloud', idx: 11 },
                                    { skill: 'Node.js', icon: 'DiNodejsSmall', idx: 12 },
                                    { skill: 'Ethereum', icon: 'FaEthereum', idx: 13 },
                                    { skill: 'Git', icon: 'DiGit', idx: 14 },
                                    { skill: 'Jenkins', icon: 'DiJenkins', idx: 15 },
                                    { skill: 'Gatsby', icon: 'GrGatsbyjs', idx: 16 },
                                ].map(({ skill, icon, idx }) => (
                                    <motion.div
                                        key={idx}
                                        initial="hidden"
                                        animate={isFullStackVisible ? "visible" : "hidden"}
                                        custom={{ delay: getSkillDelay(idx) }}
                                        variants={fadeInUpVariants}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Skill skill={skill} Icon={loadIcon(icon)} />
                                    </motion.div>
                                ))}
                            </div>
                            {[
                                '⚡ Deploy applications with Docker and orchestrate services using Kubernetes',
                                '⚡ Build accessible, responsive UIs with modern JavaScript frameworks',
                                '⚡ Design robust APIs in Python, integrating SQL and NoSQL databases',
                                '⚡ Architect real-time, event-driven systems using Kafka and queues',
                                '⚡ Optimize system availability, performance, and operational efficiency',
                            ].map((text, idx) => (
                                <motion.p
                                    key={idx}
                                    initial="hidden"
                                    animate={isFullStackVisible ? "visible" : "hidden"}
                                    custom={{ delay: 0.15 + (idx * 0.1) }}
                                    variants={fadeInUpVariants}
                                >
                                    {text}
                                </motion.p>
                            ))}
                        </Col>
                    </Row>
                </div>
                <div>
                    <Row xs={1} md={2} className="pt-4">
                        <Col lg={6} className="animate-box">
                            <div align="center">
                                <motion.div
                                    ref={aiSystemsRef}
                                    initial="hidden"
                                    animate={isAiSystemsVisible ? "visible" : "hidden"}
                                    custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                                    variants={fadeInUpVariants}
                                >
                                    <MediumHeading className="mb-4">AI & Systems Engineering</MediumHeading>
                                </motion.div>
                                {[
                                    { skill: 'Python', icon: 'FaPython', idx: 0 },
                                    { skill: 'PyTorch', icon: 'SiPytorch', idx: 1 },
                                    { skill: 'Jupyter Notebook', icon: 'SiJupyter', idx: 2 },
                                    { skill: 'SQL', icon: 'FaDatabase', idx: 3 },
                                    { skill: 'React', icon: 'FaReact', idx: 4 },
                                    { skill: 'AWS', icon: 'FaAws', idx: 5 },
                                    { skill: 'Git', icon: 'DiGit', idx: 6 },
                                ].map(({ skill, icon, idx }) => (
                                    <motion.div
                                        key={idx}
                                        initial="hidden"
                                        animate={isAiSystemsVisible ? "visible" : "hidden"}
                                        custom={{ delay: getSkillDelay(idx) }}
                                        variants={fadeInUpVariants}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Skill skill={skill} Icon={loadIcon(icon)} />
                                    </motion.div>
                                ))}
                            </div>
                            {[
                                '⚡ Implement AI-powered DevOps workflows and automation',
                                '⚡ Explore ML techniques for performance tuning and anomaly detection',
                                '⚡ Apply data-driven solutions for scalable backend systems',
                                '⚡ Study ethical ML practices and Indigenous data sovereignty',
                            ].map((text, idx) => (
                                <motion.p
                                    key={idx}
                                    initial="hidden"
                                    animate={isAiSystemsVisible ? "visible" : "hidden"}
                                    custom={{ delay: 0.15 + (idx * 0.1) }}
                                    variants={fadeInUpVariants}
                                >
                                    {text}
                                </motion.p>
                            ))}
                        </Col>
                        <Col>
                            <AiSystemsIllustration isVisible={isAiSystemsVisible} />
                        </Col>
                    </Row>
                </div>
            </Container>
        </SkillsSection>
    );
}
