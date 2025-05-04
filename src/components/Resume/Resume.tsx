import React from 'react'
import { useState } from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';
import { Heading } from '../style.ts'
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
    <ResumeSection name="Resume">
      <Container>
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
                    <Entry icon={TbCertificate}
                      title={"Certified DevOps Engineer - Professional"}
                      subtitle={"AWS Certification"}
                      date={"April 2025"}
                    >
                      Validates technical expertise in developing and maintaining applications on the AWS platform
                    </Entry>
                    <Entry icon={GiGraduateCap}
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
                    <Entry icon={MdWork}
                      date={"April 2024 – Present"}
                      title={"Applications Developer"}
                      subtitle={"Oracle"}
                    >
                      <ul>
                        <li>Built and launched a scalable release management tool supporting 689 users with high reliability.</li>
                        <li>Mentored new developers, facilitating knowledge transfer and collaborative problem‑solving.</li>
                        <li>Implemented AI‑powered automation to optimize DevOps workflows and artifact management.</li>
                        <li>Led onboarding and support for users, resolving bugs, gathering feedback, and refining key features.</li>
                        <li>Efficiently ingested data sources with Python, DRF, and Celery for asynchronous data processing.</li>
                      </ul>
                    </Entry>

                    <Entry icon={MdWork}
                      date={"August 2022 – April 2024"}
                      title={"Software Development Engineer"}
                      subtitle={"Amazon"}
                    >
                      <ul>
                        <li>Developed and optimized C++ and Python‑based APIs for large‑scale data catalog systems.</li>
                        <li>Led junior developers by sharing context, reviewing code, and guiding contributions.</li>
                        <li>Delivered flexible CI/CD pipelines with approvals, tests, rollbacks, and branch deployments.</li>
                        <li>Designed efficient bulk registration features for large‑scale data ingestion pipelines.</li>
                        <li>Implemented cascading data filters and interactive UI elements for React‑based applications.</li>
                        <li>Managed infrastructure security and scalability using AWS CDK, CloudFormation, and SAM.</li>
                      </ul>
                    </Entry>

                    <Entry icon={MdWork}
                      date={"August 2021 – August 2022"}
                      title={"Senior Associate Software Engineer"}
                      subtitle={"Capital One"}
                    >
                      <ul>
                        <li>Managed infrastructure security and scalability using AWS CDK, CloudFormation, and SAM.</li>
                        <li>Developed AI‑powered metadata validation tools for data registration and classification.</li>
                        <li>Improved file transfer efficiency by designing a self‑service data streaming and processing pipeline.</li>
                        <li>Enhanced real‑time analytics by implementing multithreading for Kafka stream processing.</li>
                      </ul>
                    </Entry>

                    <Entry icon={MdWork}
                      date={"August 2019 - May 2020, August 2020 - May 2021"}
                      title={"DevOps Engineer"}
                      subtitle={"Bongo"}
                    >
                      <ul>
                        <li>Built custom monitors to fortify web application's live audio infrastructure.</li>
                        <li>Automated hundreds of end-to-end React user interface tests with Ruby, Capybara, and Jenkins.</li>
                      </ul>
                    </Entry>

                    <Entry icon={MdWork}
                      date={"May 2020 – August 2020"}
                      title={"Associate Cloud Consultant"}
                      subtitle={"Amazon Web Services"}
                    >
                      <ul>
                        <li>Architected self-service WorkSpace solution to reduce end-user’s procurement time by 85%.</li>
                        <li>Satisfied customer requests for highly available RESTful services after project demos.</li>
                      </ul>
                    </Entry>

                    <Entry icon={MdWork}
                      date={"May 2019 – August 2019"}
                      title={"Cloud Solutions Engineer"}
                      subtitle={"Oracle"}
                    >
                      <ul>
                        <li>Built business intelligence dashboards for optimizing five revenue streams</li>
                        <li>Analyzed Tweets and News outlets for live analysis using Python</li>
                        <li>Maximized application availability by automating deployment to Oracle Cloud</li>
                      </ul>
                    </Entry>

                    <Entry icon={MdWork}
                      date={"January 2019 - May 2019"}
                      title={"Teaching Assistant"}
                      subtitle={"Colorado State University"}
                    >
                      <ul>
                        <li>Lead over 100 students through the fundamentals of Python</li>
                        <li>Reviewed and revised curriculum for teaching Python to non-technical majors</li>
                      </ul>
                    </Entry>

                    <Entry icon={MdWork}
                      date={"May 2018 - July 2018"}
                      title={"Student Instructor"}
                      subtitle={"Northrop Grumman STEM Camp"}
                    >
                      <ul>
                        <li>Built a project based Python programming curriculum focused on gaming and security</li>
                        <li>Taught 10 high school students Python object-oriented programming</li>
                        <li>Released a blog covering the curriculum</li>
                      </ul>
                    </Entry>
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
                      subtitle={"HackCU 007"}>
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