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
import { Heading, Button } from '../style.ts'
import { ResumeSection, Page, SectionTitle, SubsectionTitle } from './style.ts'
import ResumeFile from '../Introduction/resume.pdf'
import Entry from './Entry'
import { Skill } from './Skill'
import { GiGraduateCap } from 'react-icons/gi'
import { AiOutlineTeam } from 'react-icons/ai'
import { TbCertificate } from 'react-icons/tb'
import { GoStar } from 'react-icons/go'
import { MdWork } from 'react-icons/md'
import { BsSave } from 'react-icons/bs'
import { experienceData } from '../../data/experience'

function Resume(props) {
  const [open, setOpen] = useState<string | null>('1');
  const toggle = (id: string) => {
    if (open === id) {
      setOpen(null);
    } else {
      setOpen(id);
    }
  };

  return (
    <ResumeSection name="Resume" className="mb-4">
      <Container className="mb-4">
        <Heading className="mb-4">Resume <span id="save"><Button color="primary" href={ResumeFile}>Download <BsSave /></Button></span></Heading>
        <Accordion flush open={open} toggle={toggle}>
          <Row>
            <Col>
              <AccordionItem>
                <Page name="education">
                  <AccordionHeader targetId='1'>
                    <SectionTitle>Education</SectionTitle>
                  </AccordionHeader>
                  <AccordionBody accordionId='1'>
                    <Entry icon={GiGraduateCap}
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
                  </AccordionBody>
                </Page>
              </AccordionItem>

              <AccordionItem>
                <Page name="experience">
                  <AccordionHeader targetId='2'>
                    <SectionTitle>Experience</SectionTitle>
                  </AccordionHeader>
                  <AccordionBody accordionId='2'>
                    {experienceData.map((entry, index) => (
                      <Entry
                        key={index}
                        icon={MdWork}
                        date={entry.year}
                        title={entry.title}
                        subtitle={entry.company}
                        style={index === experienceData.length - 1 ? { marginBottom: "0", paddingBottom: "0", borderBottom: "none" } : undefined}
                      >
                        <ul>
                          {entry.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      </Entry>
                    ))}
                  </AccordionBody>
                </Page>
              </AccordionItem>

              <AccordionItem>
                <Page name="awards">
                  <AccordionHeader targetId='3'>
                    <SectionTitle>Awards</SectionTitle>
                  </AccordionHeader>
                  <AccordionBody accordionId='3'>
                    <Entry icon={GoStar}
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
                  </AccordionBody>
                </Page>
              </AccordionItem>

              <AccordionItem>
                <Page name="leadership" className="mb-0">
                  <AccordionHeader targetId='4'>
                    <SectionTitle>Leadership</SectionTitle>
                  </AccordionHeader>
                  <AccordionBody accordionId='4'>
                    <Entry icon={AiOutlineTeam}
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
                  </AccordionBody>
                </Page>
              </AccordionItem>
            </Col>
          </Row>
        </Accordion>
      </Container>
    </ResumeSection>
  );
}

export { Resume };