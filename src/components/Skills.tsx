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
import { ANIMATION_CONFIG, TIMING, SECONDARY_DELAYS, PROGRESSIVE_STAGGER } from '../animations/config'

export default function Skills() {
    // Use the optimized hook for each section's viewport detection
    const { ref: mainHeaderRef, isInView: isVisible } = useInViewAnimation({
        once: true,
    });

    const { ref: subheaderRef, isInView: isSubheaderVisible } = useInViewAnimation({
        once: true,
    });

    // Full Stack illustration - independent element triggers
    const { ref: fullStackRef, isInView: isFullStackVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: fullStackPersonRef, isInView: isFullStackPersonVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: fullStackComputerRef, isInView: isFullStackComputerVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: fullStackBadgeRef, isInView: isFullStackBadgeVisible } = useInViewAnimation({
        once: true,
    });

    // AI Systems illustration - independent element triggers
    const { ref: aiSystemsRef, isInView: isAiSystemsVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: aiSystemsPersonRef, isInView: isAiSystemsPersonVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: aiSystemsCodeRef, isInView: isAiSystemsCodeVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: aiSystemsAwsRef, isInView: isAiSystemsAwsVisible } = useInViewAnimation({
        once: true,
    });

    // Lazyload the an icon component
    // [param] icon {String}
    // [return] Component
    function loadIcon(Icon) {
        let iconGroup = Icon.slice(0, 2);
        if (iconGroup === 'Gi') {
            return lazy(() =>
                import('react-icons/gi').then(module => {
                    if (!module[Icon]) {
                        console.warn(`Icon ${Icon} not found in react-icons/gi`);
                        return { default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> };
                    }
                    return { default: module[Icon] };
                }).catch(() => ({ default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> }))
            );
        }
        else if (iconGroup === 'Fi') {
            return lazy(() =>
                import('react-icons/fi').then(module => {
                    if (!module[Icon]) {
                        console.warn(`Icon ${Icon} not found in react-icons/fi`);
                        return { default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> };
                    }
                    return { default: module[Icon] };
                }).catch(() => ({ default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> }))
            );
        }
        else if (iconGroup === 'Fa') {
            return lazy(() =>
                import('react-icons/fa').then(module => {
                    if (!module[Icon]) {
                        console.warn(`Icon ${Icon} not found in react-icons/fa`);
                        return { default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> };
                    }
                    return { default: module[Icon] };
                }).catch(() => ({ default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> }))
            );
        }
        else if (iconGroup === 'Di') {
            return lazy(() =>
                import('react-icons/di').then(module => {
                    if (!module[Icon]) {
                        console.warn(`Icon ${Icon} not found in react-icons/di`);
                        return { default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> };
                    }
                    return { default: module[Icon] };
                }).catch(() => ({ default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> }))
            );
        }
        else if (iconGroup === 'Ri') {
            return lazy(() =>
                import('react-icons/ri').then(module => {
                    if (!module[Icon]) {
                        console.warn(`Icon ${Icon} not found in react-icons/ri`);
                        return { default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> };
                    }
                    return { default: module[Icon] };
                }).catch(() => ({ default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> }))
            );
        }
        else if (iconGroup === 'Gr') {
            return lazy(() =>
                import('react-icons/gr').then(module => {
                    if (!module[Icon]) {
                        console.warn(`Icon ${Icon} not found in react-icons/gr`);
                        return { default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> };
                    }
                    return { default: module[Icon] };
                }).catch(() => ({ default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> }))
            );
        }
        else if (iconGroup === 'Si') {
            return lazy(() =>
                import('react-icons/si').then(module => {
                    if (!module[Icon]) {
                        console.warn(`Icon ${Icon} not found in react-icons/si`);
                        return { default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> };
                    }
                    return { default: module[Icon] };
                }).catch(() => ({ default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> }))
            );
        }
        else {
            return lazy(() => Promise.resolve({ default: () => <span style={{ fontSize: '2rem' }}>⚠️</span> }));
        }
    }

    // Calculate delay for skill icons - simple sequential stagger
    const getSkillDelay = (index: number) => {
        return index * PROGRESSIVE_STAGGER.skills.staggerIncrement; // Each icon animates 100ms after the previous one
    };

    return (
        <SkillsSection name="Skills">
            <Container>
                <Row className="g-0 justify-content-center pb-2 pt-5">
                    <Col md={12} className="heading-section text-center ">
                        <motion.div
                            ref={mainHeaderRef}
                            initial="hidden"
                            className="pb-5"
                            animate={isVisible ? "visible" : "hidden"}
                            custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                            variants={fadeInUpVariants}
                        >
                            <Heading>Core Expertise</Heading>
                            <motion.p
                                ref={subheaderRef}
                                initial="hidden"
                                animate={isSubheaderVisible ? 'visible' : 'hidden'}
                                custom={{ delay: SECONDARY_DELAYS.default }}
                                variants={fadeInUpVariants}
                            >
                                Bridging the gap between complex technical architecture and scalable business solutions.
                            </motion.p>
                        </motion.div>
                    </Col>
                </Row>
                <div>
                    <Row xs={1} md={2} className='pb-4'>
                        <Col className='order-lg-1 order-md-1 order-2' style={{ position: 'relative' }}>
                            {/* Ref anchors for independent triggers */}
                            <span ref={fullStackPersonRef} style={{ position: 'absolute', top: '0' }}></span>
                            <span ref={fullStackComputerRef} style={{ position: 'absolute', top: '30%' }}></span>
                            <span ref={fullStackBadgeRef} style={{ position: 'absolute', top: '50%' }}></span>
                            <FullStackIllustration
                                personVisible={isFullStackPersonVisible}
                                computerVisible={isFullStackComputerVisible}
                                badgeVisible={isFullStackBadgeVisible}
                            />
                        </Col>
                        <Col lg={6} className="order-lg-2 order-lg-2 order-1">
                            <div align="center" ref={fullStackRef}>
                                <motion.div
                                    ref={fullStackRef}
                                    initial="hidden"
                                    animate={isFullStackVisible ? "visible" : "hidden"}
                                    custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                                    variants={fadeInUpVariants}
                                >
                                    <MediumHeading className="mb-4">Full Stack Development</MediumHeading>
                                </motion.div>
                                <div>
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
                                        custom={{ delay: 0.55 + getSkillDelay(idx) }}
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
                                    className="skillListItem"
                                    initial="hidden"
                                    animate={isFullStackVisible ? "visible" : "hidden"}
                                    custom={{ delay: PROGRESSIVE_STAGGER.skills.baseDelay + (idx * PROGRESSIVE_STAGGER.skills.staggerIncrement) }}
                                    variants={fadeInUpVariants}
                                >
                                    {text}
                                </motion.p>
                            ))}
                            </div>
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
                                <div>
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
                            <div ref={aiSystemsRef}>
                            {[
                                '⚡ Implement AI-powered DevOps workflows and automation',
                                '⚡ Explore ML techniques for performance tuning and anomaly detection',
                                '⚡ Apply data-driven solutions for scalable backend systems',
                                '⚡ Study ethical ML practices and Indigenous data sovereignty',
                            ].map((text, idx) => (
                                <motion.p
                                    key={idx}
                                    initial="hidden"
                                    className="skillListItem"
                                    animate={isAiSystemsVisible ? "visible" : "hidden"}
                                    custom={{ delay: PROGRESSIVE_STAGGER.skills.baseDelay + (idx * PROGRESSIVE_STAGGER.skills.staggerIncrement) }}
                                    variants={fadeInUpVariants}
                                >
                                    {text}
                                </motion.p>
                            ))}
                            </div>
                            </div>
                        </Col>
                        <Col style={{ position: 'relative' }}>
                            {/* Ref anchors for independent triggers */}
                            <span ref={aiSystemsPersonRef} style={{ position: 'absolute', top: '0' }}></span>
                            <span ref={aiSystemsCodeRef} style={{ position: 'absolute', top: '30%' }}></span>
                            <span ref={aiSystemsAwsRef} style={{ position: 'absolute', top: '60%' }}></span>
                            <AiSystemsIllustration
                                personVisible={isAiSystemsPersonVisible}
                                codeBlocksVisible={isAiSystemsCodeVisible}
                                awsLogoVisible={isAiSystemsAwsVisible}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        </SkillsSection>
    );
}
