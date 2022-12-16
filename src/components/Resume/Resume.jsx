import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from '../style.js'
import { ResumeSection, Page, SectionTitle, SubsectionTitle } from './style.js'
import Entry from './Entry'
import { Skill } from './Skill'
import { GiGraduateCap} from 'react-icons/gi'
import { AiOutlineTeam } from 'react-icons/ai'
import { GoStar } from 'react-icons/go'
import { MdWork } from 'react-icons/md'

 export default function Resume(props) {
  return (
    <ResumeSection name="Resume">
      <Container>
        <Heading className="mb-4">Resume</Heading>
        <Row>
          <Col>
            {/* TODO: https://reactstrap.github.io/?path=/docs/components-accordion--accordion */}
            <Page name="education">
              <SectionTitle>Education</SectionTitle>
              <Entry icon={GiGraduateCap} 
                      title={"University of Southern California"}
                      subtitle={"Master's of Science in Computer Science"}
                      graduationDate={"Expected May 2024"}>
                Specialization in Artificial Intelligence
              </Entry>
              <Entry icon={GiGraduateCap} 
                      title={"Colorado State University"}
                      subtitle={"Bachelor's of Science in Computer Science"}
                      graduationDate={"May 2021"}>
               Minor in Entrepreneurship and Innovation 
              </Entry>
            </Page>

            <Page name="experience">
              <SectionTitle>Experience</SectionTitle>
               
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
            </Page>
            
            <Page name="skills">
              <SectionTitle>Skills</SectionTitle>
              
            </Page>

            <Page name="awards">
              <SectionTitle>Awards</SectionTitle>
              <Entry icon={GoStar}
                      date={"Fall 2018 - Fall 2921"}
                      title={"Dean's List"}
                      subtitle={"College of Natural Science"}>
                Recognized as a high-achieving student for earning over a 3.75 GPA while working part-time.
              </Entry>
              <Entry icon={GoStar}
                      date={"September 2019"}
                      title={"SingularDTV Challenge"}
                      subtitle={"WyoHackathon"}
              >
                Spearheaded a trip to San Francisco by developing a token-curated music billboard.
              </Entry>
              <Entry icon={GoStar}
                      date={"October 2017"}
                      title={"Best Artistry Award"}
                      subtitle={"RamHack at Colorado State University"}
              >
                Led the development of a VR solarsystem classroom within 48 hours.
              </Entry>
            </Page>
            <Page name="leadership" className="mb-0">
              <SectionTitle>Leadership</SectionTitle>
              <Entry icon={AiOutlineTeam}
                      date={"August 2019 - May 2020"}
                      title={"Treasurer"}
                      subtitle={"AISES and Hashdump"}
              >
                <ul>
                  <li>Manage a budget of over $40,000</li>
                  <li>Write budget proposals for education, outreach, and professional development</li>
                </ul>
              </Entry>
            </Page>
          </Col>
        </Row>
      </Container>
    </ResumeSection>
  );
 }