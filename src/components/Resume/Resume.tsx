import React from 'react'
import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';
import { Heading, PrimaryButton } from '../style'
import { ResumeSection, Page, SectionTitle, SubsectionTitle } from './style'
import ResumeFile from '../Introduction/resume.pdf'
import Entry from './Entry'
import { Skill } from './Skill'
import { AnimatedAccordionBody } from './AnimatedAccordionBody'
import { GiGraduateCap } from 'react-icons/gi'
import { AiOutlineTeam } from 'react-icons/ai'
import { TbCertificate } from 'react-icons/tb'
import { GoStar } from 'react-icons/go'
import { MdWork } from 'react-icons/md'
import { BsSave } from 'react-icons/bs'
import { experienceData } from '../../data/experience'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../../animations'
import { ANIMATION_CONFIG, TIMING, SECONDARY_DELAYS } from '../../animations/config'
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation'

function Resume(props) {
  // Use the optimized hook for header viewport detection
  const { ref: headerRef, isInView: isHeaderVisible } = useInViewAnimation({
    once: true,
  });

  const { ref: buttonRef, isInView: isButtonVisible } = useInViewAnimation({
    once: true,
  });

  const { ref: accordionRef, isInView: isAccordionVisible } = useInViewAnimation({
    once: true,
  });

  const [open, setOpen] = useState<string | null>('1');

  const handleToggle = (id: string) => {
    const openId = open;
    const isOpening = openId !== id; // Will this action open the accordion?
    setOpen(openId === id ? null : id);

    // Only scroll when opening an accordion, not when closing
    if (!isOpening) return;

    // Map accordion IDs to header IDs for scrolling
    const headerIdMap: Record<string, string> = {
      '1': 'accordion-education',
      '2': 'accordion-experience',
      '3': 'accordion-awards',
      '4': 'accordion-leadership'
    };

    // Wait for accordion animation to complete before scrolling
    // Animation duration is 500ms + stagger delays for multiple items
    // Using 700ms to ensure content is fully expanded
    setTimeout(() => {
      const headerId = headerIdMap[id];
      if (headerId) {
        const element = document.getElementById(headerId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 700);
  };

  return (
    <ResumeSection name="Resume" className="mb-4">
      <Container className="mb-4">
        <Row className="g-0 justify-content-center pb-2 pt-5">
          <Col md={12} className="heading-section text-center">
            <motion.div
              ref={headerRef}
              initial="hidden"
              animate={isHeaderVisible ? "visible" : "hidden"}
              custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
              variants={fadeInUpVariants}
            >
              <Heading className="mb-4">Resume</Heading>
              <p>Professional experience, education, and achievements.</p>
            </motion.div>
          </Col>
        </Row>
        <Row>
          <Col>
            <motion.div
              ref={buttonRef}
              initial="hidden"
              animate={isButtonVisible ? "visible" : "hidden"}
              custom={{ delay: SECONDARY_DELAYS.default, distance: TIMING.primaryUnit.distance }}
              variants={fadeInUpVariants}
              className="mb-4 mt-5"
            >
              <PrimaryButton
                href={ResumeFile}
                className="py-4"
                style={{
                  width: '100%',
                  height: 'auto',
                  minHeight: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '30px',
                  lineHeight: 1
                }}
              >
                Download<span className="ms-2"><BsSave /></span>
              </PrimaryButton>
            </motion.div>
            <style>{`
              @media (max-width: 767.98px) {
                .btn-primary, a.btn {
                  min-height: 5rem !important;
                  font-size: 30px !important;
                  font-weight: 800 !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  line-height: 1 !important;
                }
                .btn-primary svg, a.btn svg {
                  margin-left: 0.3rem !important;
                }
              }
            `}</style>
          </Col>
        </Row>
        <motion.div
          ref={accordionRef}
          initial="hidden"
          animate={isAccordionVisible ? "visible" : "hidden"}
          custom={{ delay: SECONDARY_DELAYS.long, distance: TIMING.primaryUnit.distance }}
          variants={fadeInUpVariants}
        >
          <Accordion flush open={open || ''} toggle={handleToggle}>
            <AccordionItem>
              <Page name="education">
                <AccordionHeader targetId='1' id='accordion-education'>
                  <SectionTitle>Education</SectionTitle>
                </AccordionHeader>
                <AnimatedAccordionBody accordionId='1'>
                  <Entry icon={GiGraduateCap}
                    style={{ marginTop: "10px" }}
                    title={"University of Southern California"}
                    subtitle={"Master's of Science in Computer Science"}>
                    Specializing in Artificial Intelligence
                  </Entry>
                  <Entry icon={TbCertificate}
                    title={"Certified DevOps Engineer - Professional"}
                    subtitle={"AWS Certification"}
                    date={"April 2025"}
                  >
                    Validates technical expertise in developing and maintaining applications on the AWS platform
                  </Entry>
                  <Entry icon={GiGraduateCap}
                    style={{ marginBottom: "0", paddingBottom: "0", borderBottom: "none" }}
                    title={"Colorado State University"}
                    subtitle={"Bachelor's of Science in Computer Science"}
                    date={"May 2021"}>
                    Minor in Entrepreneurship and Innovation
                  </Entry>
                </AnimatedAccordionBody>
              </Page>
            </AccordionItem>

            <AccordionItem>
              <Page name="experience">
                <AccordionHeader targetId='2' id='accordion-experience'>
                  <SectionTitle>Experience</SectionTitle>
                </AccordionHeader>
                <AnimatedAccordionBody accordionId='2'>
                  {experienceData.map((entry, index) => (
                    <Entry
                      key={index}
                      icon={MdWork}
                      date={entry.year}
                      title={entry.company}
                      subtitle={entry.title}
                      style={
                        index === 0
                          ? { marginTop: "10px" }
                          : index === experienceData.length - 1
                          ? { marginBottom: "0", paddingBottom: "0", borderBottom: "none" }
                          : undefined
                      }
                    >
                      <ul>
                        {entry.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex}>{bullet}</li>
                        ))}
                      </ul>
                    </Entry>
                  ))}
                </AnimatedAccordionBody>
              </Page>
            </AccordionItem>

            <AccordionItem>
              <Page name="awards">
                <AccordionHeader targetId='3' id='accordion-awards'>
                  <SectionTitle>Awards</SectionTitle>
                </AccordionHeader>
                <AnimatedAccordionBody accordionId='3'>
                  <Entry icon={GoStar}
                    style={{ marginTop: "10px" }}
                    date={"July 2022"}
                    title={"Phoenix Award"}
                    subtitle={"Capital One"}>
                    <ul>
                      <li>A monthly award given by the Capital One FS Data Team.</li>
                      <li>The award is given to selected individuals/team after nomination and careful committee consideration.</li>
                      <li>This award was given as part of Data Catalog Chrome Extension Development.</li>
                    </ul>
                  </Entry>
                  <Entry icon={GoStar}
                    date={"Fall 2020"}
                    title={"Social Impact Award"}
                    subtitle={"HackCU 007"}>
                    <ul>
                      <li>Lead development of a Missing and Murdered Indigenous Women reporting system</li>
                      <li>Deployed database and web application for viewing and modifying reports</li>
                      <li>Built IoT device for filing reports via GSM cellular signal for rural areas</li>
                      <li>Created Alexa skill for filing reports via Alexa voice recognition</li>
                    </ul>
                  </Entry>
                  <Entry icon={GoStar}
                    date={"Fall 2018 - Fall 2021"}
                    title={"Dean's List"}
                    subtitle={"College of Natural Science"}>
                    <ul>
                      <li>Recognized as a high-achieving student for earning over a 3.75 GPA while working part-time.</li>
                    </ul>
                  </Entry>
                  <Entry icon={GoStar}
                    date={"September 2019"}
                    title={"SingularDTV Challenge"}
                    subtitle={"WyoHackathon"}
                  >
                    <ul>
                      <li>Spearheaded a trip to San Francisco by developing a token-curated music billboard.</li>
                    </ul>
                  </Entry>
                  <Entry icon={GoStar}
                    style={{ marginBottom: "0", paddingBottom: "0", borderBottom: "none" }}
                    date={"October 2017"}
                    title={"Best Artistry Award"}
                    subtitle={"RamHack at Colorado State University"}
                  >
                    <ul>
                      <li>Led the development of a VR solarsystem classroom within 48 hours.</li>
                    </ul>
                  </Entry>
                </AnimatedAccordionBody>
              </Page>
            </AccordionItem>

            <AccordionItem>
              <Page name="leadership" className="mb-0">
                <AccordionHeader targetId='4' id='accordion-leadership'>
                  <SectionTitle>Leadership</SectionTitle>
                </AccordionHeader>
                <AnimatedAccordionBody accordionId='4'>
                  <Entry icon={AiOutlineTeam}
                    style={{ marginTop: "10px" }}
                    date={"September 2020 - May 2021"}
                    title={"President"}
                    subtitle={"CSU's American Indian Science and Engineering Society"}
                  >
                    <ul>
                      <li>Doubled membership through campus recruiting and online outreach</li>
                      <li>Organized meetings and volunteer efforts throughout the year</li>
                    </ul>
                  </Entry>
                  <Entry icon={AiOutlineTeam}
                    style={{ marginBottom: "0", paddingBottom: "0", borderBottom: "none" }}
                    date={"August 2020 - May 2020"}
                    title={"Treasurer"}
                    subtitle={"AISES and Hashdump"}
                  >
                    <ul>
                      <li>Manage a budget of over $40,000</li>
                      <li>Write budget proposals for education, outreach, and professional development</li>
                    </ul>
                  </Entry>
                </AnimatedAccordionBody>
              </Page>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </Container>
    </ResumeSection>
  );
}

export { Resume };
