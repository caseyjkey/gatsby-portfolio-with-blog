import React from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from './style'
import { SkillsSection, MediumHeading, TopIllustrationCol, BottomIllustrationCol } from './Skills/style'
import { Skill } from './Skills/Skill'
import { FullStackIllustration } from './Skills/FullStackIllustration'
import { AiSystemsIllustration } from './Skills/AiSystemsIllustration'
import { InfrastructureIllustration } from './Skills/InfrastructureIllustration'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation'
import { ANIMATION_CONFIG, TIMING, SECONDARY_DELAYS, PROGRESSIVE_STAGGER } from '../animations/config'
// Direct react-icons imports
import {
    SiTypescript,
    SiReact,
    SiNodedotjs,
    SiPython,
    SiMysql,
    SiGit,
    SiPytorch,
    SiJupyter,
    SiRedis,
    SiPostgresql,
    SiAmazonaws,
    SiGooglecloud,
    SiGithubactions,
    SiGnubash,
    SiHeroku,
    SiOracle,
    SiDocker,
    SiKubernetes,
} from 'react-icons/si'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ size?: string | number }>> = {
    SiTypescript,
    SiReact,
    SiNodedotjs,
    SiPython,
    SiMysql,
    SiGit,
    SiPytorch,
    SiJupyter,
    SiRedis,
    SiPostgresql,
    SiAmazonaws,
    SiGooglecloud,
    SiGithubactions,
    SiGnubash,
    SiHeroku,
    SiOracle,
    SiDocker,
    SiKubernetes,
};

export default function Skills() {
    // Use the optimized hook for each section's viewport detection
    const { ref: mainHeaderRef, isInView: isVisible } = useInViewAnimation({
        once: true,
    });

    const { ref: subheaderRef, isInView: isSubheaderVisible } = useInViewAnimation({
        once: true,
    });

    // Core Stack section - independent element triggers
    const { ref: coreStackRef, isInView: isCoreStackVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: coreStackPersonRef, isInView: isCoreStackPersonVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: coreStackComputerRef, isInView: isCoreStackComputerVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: coreStackBadgeRef, isInView: isCoreStackBadgeVisible } = useInViewAnimation({
        once: true,
    });

    // AI & Data section - independent element triggers
    const { ref: aiDataRef, isInView: isAiDataVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: aiDataPersonRef, isInView: isAiDataPersonVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: aiDataCodeRef, isInView: isAiDataCodeVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: aiDataAwsRef, isInView: isAiDataAwsVisible } = useInViewAnimation({
        once: true,
    });

    // Infrastructure section - independent element triggers
    const { ref: infrastructureRef, isInView: isInfrastructureVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: infrastructurePersonRef, isInView: isInfrastructurePersonVisible } = useInViewAnimation({
        once: true,
    });
    const { ref: infrastructureNotebookRef, isInView: isInfrastructureNotebookVisible } = useInViewAnimation({
        once: true,
    });

    // Calculate delay for skill icons - simple sequential stagger
    const getSkillDelay = (index: number) => {
        return index * PROGRESSIVE_STAGGER.skills.staggerIncrement;
    };

    // Create an icon component wrapper
    const createIconComponent = (iconName: string) => {
        const IconComponent = iconMap[iconName];
        if (!IconComponent) {
            return () => <span style={{ fontSize: '1.5rem' }}>⚠️</span>;
        }
        return IconComponent;
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

                {/* Core Stack Section - Illustration on LEFT */}
                <div>
                    <Row xs={1} md={2} className='pb-4'>
                        <TopIllustrationCol className='order-lg-1 order-md-1 order-2'>
                            <span ref={coreStackPersonRef} style={{ position: 'absolute', top: '0' }}></span>
                            <span ref={coreStackComputerRef} style={{ position: 'absolute', top: '30%' }}></span>
                            <span ref={coreStackBadgeRef} style={{ position: 'absolute', top: '50%' }}></span>
                            <FullStackIllustration
                                personVisible={isCoreStackPersonVisible}
                                computerVisible={isCoreStackComputerVisible}
                                badgeVisible={isCoreStackBadgeVisible}
                            />
                        </TopIllustrationCol>
                        <Col lg={6} className="order-lg-2 order-lg-2 order-1">
                            <div ref={coreStackRef}>
                                <motion.div
                                    ref={coreStackRef}
                                    initial="hidden"
                                    animate={isCoreStackVisible ? "visible" : "hidden"}
                                    custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                                    variants={fadeInUpVariants}
                                >
                                    <MediumHeading className="mb-4">Core Stack</MediumHeading>
                                </motion.div>
                                <div style={{ marginLeft: '-0.45rem' }}>
                                {[
                                    { skill: 'TypeScript', icon: 'SiTypescript', idx: 0 },
                                    { skill: 'React', icon: 'SiReact', idx: 1 },
                                    { skill: 'Node.js', icon: 'SiNodedotjs', idx: 2 },
                                    { skill: 'Python', icon: 'SiPython', idx: 3 },
                                    { skill: 'SQL', icon: 'SiMysql', idx: 4 },
                                    { skill: 'Git', icon: 'SiGit', idx: 5 },
                                ].map(({ skill, icon, idx }) => (
                                    <motion.div
                                        key={idx}
                                        initial="hidden"
                                        animate={isCoreStackVisible ? "visible" : "hidden"}
                                        custom={{ delay: getSkillDelay(idx) }}
                                        variants={fadeInUpVariants}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Skill skill={skill} Icon={createIconComponent(icon)} />
                                    </motion.div>
                                ))}
                            </div>
                            <motion.ul
                                initial="hidden"
                                animate={isCoreStackVisible ? "visible" : "hidden"}
                                style={{ listStyle: 'none', padding: 0, marginLeft: '-1.4rem' }}
                            >
                            {[
                                'Build modern web applications with TypeScript and React',
                                'Design scalable RESTful APIs and GraphQL services with Node.js',
                                'Develop data-driven solutions with Python and SQL databases',
                                'Implement version control and collaborative workflows with Git',
                            ].map((text, idx) => (
                                <motion.li
                                    key={idx}
                                    className="skillListItem"
                                    initial="hidden"
                                    animate={isCoreStackVisible ? "visible" : "hidden"}
                                    custom={{ delay: PROGRESSIVE_STAGGER.skills.baseDelay + (idx * PROGRESSIVE_STAGGER.skills.staggerIncrement) }}
                                    variants={fadeInUpVariants}
                                >
                                    {text}
                                </motion.li>
                            ))}
                            </motion.ul>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* AI & Data Section - Illustration on RIGHT */}
                <div>
                    <Row xs={1} md={2} className="pt-4">
                        <Col lg={6} className="animate-box">
                            <div>
                                <motion.div
                                    ref={aiDataRef}
                                    initial="hidden"
                                    animate={isAiDataVisible ? "visible" : "hidden"}
                                    custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                                    variants={fadeInUpVariants}
                                >
                                    <MediumHeading className="mb-4">AI & Data</MediumHeading>
                                </motion.div>
                                <div style={{ marginLeft: '-0.45rem' }}>
                                {[
                                    { skill: 'PyTorch', icon: 'SiPytorch', idx: 0 },
                                    { skill: 'Jupyter', icon: 'SiJupyter', idx: 1 },
                                    { skill: 'Redis', icon: 'SiRedis', idx: 2 },
                                    { skill: 'PostgreSQL', icon: 'SiPostgresql', idx: 3 },
                                ].map(({ skill, icon, idx }) => (
                                    <motion.div
                                        key={idx}
                                        initial="hidden"
                                        animate={isAiDataVisible ? "visible" : "hidden"}
                                        custom={{ delay: getSkillDelay(idx) }}
                                        variants={fadeInUpVariants}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Skill skill={skill} Icon={createIconComponent(icon)} />
                                    </motion.div>
                                ))}
                            </div>
                            <motion.ul
                                initial="hidden"
                                animate={isAiDataVisible ? "visible" : "hidden"}
                                style={{ listStyle: 'none', padding: 0, marginLeft: '-1.4rem' }}
                            >
                            {[
                                'Build and train machine learning models with PyTorch',
                                'Perform data analysis and visualization in Jupyter notebooks',
                                'Implement high-performance caching with Redis',
                                'Design and manage relational databases with PostgreSQL',
                            ].map((text, idx) => (
                                <motion.li
                                    key={idx}
                                    className="skillListItem"
                                    initial="hidden"
                                    animate={isAiDataVisible ? "visible" : "hidden"}
                                    custom={{ delay: PROGRESSIVE_STAGGER.skills.baseDelay + (idx * PROGRESSIVE_STAGGER.skills.staggerIncrement) }}
                                    variants={fadeInUpVariants}
                                >
                                    {text}
                                </motion.li>
                            )) }
                            </motion.ul>
                            </div>
                        </Col>
                        <BottomIllustrationCol>
                            <span ref={aiDataPersonRef} style={{ position: 'absolute', top: '0' }}></span>
                            <span ref={aiDataCodeRef} style={{ position: 'absolute', top: '30%' }}></span>
                            <span ref={aiDataAwsRef} style={{ position: 'absolute', top: '60%' }}></span>
                            <InfrastructureIllustration
                                personVisible={isAiDataPersonVisible}
                                notebookVisible={isAiDataCodeVisible}
                            />
                        </BottomIllustrationCol>
                    </Row>
                </div>

                {/* Infrastructure Section - Illustration on LEFT (alternating pattern) */}
                <div>
                    <Row xs={1} md={2} className="pt-4">
                        <TopIllustrationCol className='order-lg-1 order-md-1 order-2'>
                            <span ref={infrastructurePersonRef} style={{ position: 'absolute', top: '0' }}></span>
                            <span ref={infrastructureNotebookRef} style={{ position: 'absolute', top: '30%' }}></span>
                            <AiSystemsIllustration
                                personVisible={isInfrastructurePersonVisible}
                                codeBlocksVisible={isInfrastructureNotebookVisible}
                                awsLogoVisible={false}
                            />
                        </TopIllustrationCol>
                        <Col lg={6} className="order-lg-2 order-1">
                            <div>
                                <motion.div
                                    ref={infrastructureRef}
                                    initial="hidden"
                                    animate={isInfrastructureVisible ? "visible" : "hidden"}
                                    custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                                    variants={fadeInUpVariants}
                                >
                                    <MediumHeading className="mb-4">Infrastructure</MediumHeading>
                                </motion.div>
                                <div style={{ marginLeft: '-0.45rem' }}>
                                {[
                                    { skill: 'AWS', icon: 'SiAmazonaws', idx: 0 },
                                    { skill: 'Google Cloud', icon: 'SiGooglecloud', idx: 1 },
                                    { skill: 'GitHub Actions', icon: 'SiGithubactions', idx: 2 },
                                    { skill: 'Bash', icon: 'SiGnubash', idx: 3 },
                                    { skill: 'Heroku', icon: 'SiHeroku', idx: 4 },
                                    { skill: 'Oracle', icon: 'SiOracle', idx: 5 },
                                    { skill: 'Docker', icon: 'SiDocker', idx: 6 },
                                    { skill: 'Kubernetes', icon: 'SiKubernetes', idx: 7 },
                                ].map(({ skill, icon, idx }) => (
                                    <motion.div
                                        key={idx}
                                        initial="hidden"
                                        animate={isInfrastructureVisible ? "visible" : "hidden"}
                                        custom={{ delay: getSkillDelay(idx) }}
                                        variants={fadeInUpVariants}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Skill skill={skill} Icon={createIconComponent(icon)} />
                                    </motion.div>
                                ))}
                            </div>
                            <motion.ul
                                initial="hidden"
                                animate={isInfrastructureVisible ? "visible" : "hidden"}
                                style={{ listStyle: 'none', padding: 0, marginLeft: '-1.4rem' }}
                            >
                            {[
                                'Architect and deploy scalable cloud infrastructure on AWS and GCP',
                                'Implement CI/CD pipelines with GitHub Actions for automated testing and deployment',
                                'Automate system administration tasks with Bash scripting',
                                'Deploy and manage applications on container platforms',
                                'Design and manage database systems including PostgreSQL and Oracle',
                                'Containerize applications with Docker and orchestrate with Kubernetes',
                            ].map((text, idx) => (
                                <motion.li
                                    key={idx}
                                    className="skillListItem"
                                    initial="hidden"
                                    animate={isInfrastructureVisible ? "visible" : "hidden"}
                                    custom={{ delay: PROGRESSIVE_STAGGER.skills.baseDelay + (idx * PROGRESSIVE_STAGGER.skills.staggerIncrement) }}
                                    variants={fadeInUpVariants}
                                >
                                    {text}
                                </motion.li>
                            )) }
                            </motion.ul>
                            </div>
                        </Col>
                    </Row>
                </div>

            </Container>
        </SkillsSection>
    );
}
