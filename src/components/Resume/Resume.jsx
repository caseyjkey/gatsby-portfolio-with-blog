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
import { Heading } from '../style.js'
import { ResumeSection, Page, SectionTitle, SubsectionTitle } from './style.js'
import ResumeFile from '../Introduction/resume.pdf'
import Entry from './Entry'
import { Skill } from './Skill'
import { GiGraduateCap} from 'react-icons/gi'
import { AiOutlineTeam } from 'react-icons/ai'
import { TbCertificate } from 'react-icons/tb'
import { GoStar } from 'react-icons/go'
import { MdWork } from 'react-icons/md'
import { BsSave } from 'react-icons/bs'

 export default function Resume(props) {
  const [open, setOpen] = useState('1');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
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
                    <Entry icon={GiGraduateCap} 
                            title={"University of Southern California"}
                            subtitle={"Master's of Science in Computer Science"}
                            date={"Expected May 2024"}>
                      Specialization in Artificial Intelligence
                    </Entry>
                    <Entry icon={TbCertificate}
                            title={"Certified Developer - Associate"}
                            subtitle={"AWS Certification"}
                            date={"February 2022"}
                    >
                      Validates technical expertise in developing and maintaining applications on the AWS platform
                    </Entry>
                    <Entry icon={GiGraduateCap} 
                            title={"Colorado State University"}
                            subtitle={"Bachelor's of Science in Computer Science"}
                            date={"May 2021"}>
                    Minor in Entrepreneurship and Innovation 
                    </Entry>
                    <Entry icon={TbCertificate}
                            title={"Certified Cloud Practitioner"}
                            subtitle={"AWS Certification"}
                            date={"July 2020"}
                    >
                      Validates cloud fluency and foundational AWS knowledge
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
                            date={"August 2022 – Present"}
                            title={"Software Development Engineer"}
                            subtitle={"Amazon"}
                    >
                      <ul>
                        <li>Migrate tens-of-thousands of users to new & improved application for world-wide financial reports</li>
                        <li>Implement new application features according to customer specifications</li>
                        <li>Achieve 100% availability during high-stress seasons</li>
                        <li>Resolve tickets for bug fixes, vulnerabilities, and updates from 20+ outstanding tickets to less than 10 with an SLA of less than 5 days</li>
                      </ul>
                    </Entry>

                    <Entry icon={MdWork}
                            date={"August 2021 – August 2022"}
                            title={"Senior Associate Software Engineer"}
                            subtitle={"Capital One"}
                    >
                      <ul>
                        <li>Evaluated real-time data pipeline perfomance using Python and parallelism</li>
                        <li>Launched a Chrome extension to improve data onboarding experience</li>
                      </ul>
                    </Entry>
                    
                    <Entry icon={MdWork}
                            date={"August 2019 - May 2020, August 2020 - May 2021"}
                            title={"DevOps Engineer"}
                            subtitle={"Bongo"}
                    >
                      <ul>
                        <li>Built custom monitors to fortify web application's live audio infrastructure</li>
                        <li>Automated 73 end to end tests with Ruby, Capybara, and Jenkins for continous integration</li>
                      </ul>
                    </Entry>
                    
                    <Entry icon={MdWork}
                            date={"May 2020 – August 2020"}
                            title={"Associate Cloud Consultant"}
                            subtitle={"Amazon Web Services"}
                    >
                      <ul>
                        <li>Architected self-service WorkSpace solution to reduce end-user’s procurement time by 85%</li>
                        <li>Satisfied customer requests for highly available RESTful services after project demos</li>
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
                            date={"Fall 2018 - Fall 2921"}
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