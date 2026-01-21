import React from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from './style'
import { SkillsSection, MediumHeading, TopIllustrationCol, BottomIllustrationCol, SkillList } from './Skills/style'
import { Skill } from './Skills/Skill'
import { FullStackIllustration } from './Skills/FullStackIllustration'
import { AiSystemsIllustration } from './Skills/AiSystemsIllustration'
import { InfrastructureIllustration } from './Skills/InfrastructureIllustration'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { useInViewAnimation } from '../animations/hooks/useInViewAnimation'
import { ANIMATION_CONFIG, TIMING, SECONDARY_DELAYS, PROGRESSIVE_STAGGER } from '../animations/config'

const TightRowMobile = styled(Row)`
    @media (max-width: 767.98px) {
        margin-top: -3rem !important;
    }
`;
// Direct react-icons imports
import {
    SiTypescript,
    SiReact,
    SiNodedotjs,
    SiPython,
    SiGit,
    SiSwift,
    SiDjango,
    SiPytorch,
    SiScikitlearn,
    SiTensorflow,
    SiFastapi,
    SiAmazonaws,
    SiGooglecloud,
    SiGithubactions,
    SiGnubash,
    SiDocker,
    SiKubernetes,
} from 'react-icons/si'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ size?: string | number }>> = {
    SiTypescript,
    SiReact,
    SiNodedotjs,
    SiPython,
    SiGit,
    SiSwift,
    SiDjango,
    SiPytorch,
    SiScikitlearn,
    SiTensorflow,
    SiFastapi,
    SiAmazonaws,
    SiGooglecloud,
    SiGithubactions,
    SiGnubash,
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

                {/* Full Stack Engineering Section - Illustration on LEFT */}
                <div>
                    <Row xs={1} md={2} className='align-items-lg-start'>
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
                                    <MediumHeading className="mb-4">Full Stack Engineering</MediumHeading>
                                </motion.div>
                                <div style={{ marginLeft: '-0.45rem' }}>
                                {[
                                    { skill: 'TypeScript', icon: 'SiTypescript', idx: 0 },
                                    { skill: 'React', icon: 'SiReact', idx: 1 },
                                    { skill: 'Node.js', icon: 'SiNodedotjs', idx: 2 },
                                    { skill: 'Python', icon: 'SiPython', idx: 3 },
                                    { skill: 'Git', icon: 'SiGit', idx: 4 },
                                    { skill: 'Swift', icon: 'SiSwift', idx: 5 },
                                    { skill: 'Django', icon: 'SiDjango', idx: 6 },
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
                            <SkillList
                                as={motion.ul}
                                initial="hidden"
                                animate={isCoreStackVisible ? "visible" : "hidden"}
                            >
                            {[
                                'Build modern web applications with TypeScript and React',
                                'Design scalable RESTful APIs and GraphQL services with Node.js',
                                'Develop production backends with Django and Python',
                                'Build native iOS applications with Swift',
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
                            </SkillList>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Machine Learning Engineering Section - Illustration on RIGHT */}
                <div>
                    <Row xs={1} md={2} className="pt-2 align-items-lg-start">
                        <Col lg={6} className="animate-box">
                            <div>
                                <motion.div
                                    ref={aiDataRef}
                                    initial="hidden"
                                    animate={isAiDataVisible ? "visible" : "hidden"}
                                    custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
                                    variants={fadeInUpVariants}
                                >
                                    <MediumHeading className="mb-4">Machine Learning Engineering</MediumHeading>
                                </motion.div>
                                <div style={{ marginLeft: '-0.45rem' }}>
                                {[
                                    { skill: 'PyTorch', icon: 'SiPytorch', idx: 0 },
                                    { skill: 'TensorFlow', icon: 'SiTensorflow', idx: 1 },
                                    { skill: 'scikit-learn', icon: 'SiScikitlearn', idx: 2 },
                                    { skill: 'FastAPI', icon: 'SiFastapi', idx: 3 },
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
                            <SkillList
                                as={motion.ul}
                                initial="hidden"
                                animate={isAiDataVisible ? "visible" : "hidden"}
                            >
                            {[
                                'Build and train production ML models with PyTorch and TensorFlow',
                                'Implement end-to-end ML pipelines with scikit-learn',
                                'Deploy ML services with FastAPI and Docker',
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
                            </SkillList>
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

                {/* Cloud & DevOps Section - Illustration on LEFT (alternating pattern) */}
                <div>
                    <TightRowMobile xs={1} md={2} className="pt-2 pt-md-4 align-items-lg-start">
                        <TopIllustrationCol className='order-lg-1 order-md-1 order-2'>
                            <span ref={infrastructurePersonRef} style={{ position: 'absolute', top: '0' }}></span>
                            <span ref={infrastructureNotebookRef} style={{ position: 'absolute', top: '30%' }}></span>
                            <AiSystemsIllustration
                                personVisible={isInfrastructurePersonVisible}
                                codeBlocksVisible={isInfrastructureNotebookVisible}
                                awsLogoVisible={true}
                                dockerLogoVisible={true}
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
                                    <MediumHeading className="mb-4">Cloud & DevOps</MediumHeading>
                                </motion.div>
                                <div style={{ marginLeft: '-0.45rem' }}>
                                {[
                                    { skill: 'AWS', icon: 'SiAmazonaws', idx: 0 },
                                    { skill: 'Google Cloud', icon: 'SiGooglecloud', idx: 1 },
                                    { skill: 'GitHub Actions', icon: 'SiGithubactions', idx: 2 },
                                    { skill: 'Bash', icon: 'SiGnubash', idx: 3 },
                                    { skill: 'Docker', icon: 'SiDocker', idx: 4 },
                                    { skill: 'Kubernetes', icon: 'SiKubernetes', idx: 5 },
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
                            <SkillList
                                as={motion.ul}
                                initial="hidden"
                                animate={isInfrastructureVisible ? "visible" : "hidden"}
                            >
                            {[
                                'Architect cloud-native infrastructure on AWS and GCP',
                                'Build CI/CD pipelines with GitHub Actions',
                                'Containerize and orchestrate applications with Docker and Kubernetes',
                                'Automate infrastructure and systems with Bash scripting',
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
                            </SkillList>
                            </div>
                        </Col>
                    </TightRowMobile>
                </div>

            </Container>
        </SkillsSection>
    );
}
