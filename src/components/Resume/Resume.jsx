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
          <Col md={9}>
            {/* TODO: https://reactstrap.github.io/?path=/docs/components-accordion--accordion */}
            <Page name="education">
              <SectionTitle>Education</SectionTitle>
              <Entry icon={GiGraduateCap} 
                      title={"Computer Science"}
                      subtitle={"Colorado State University"}
                      gpa={"3.53"}>
                Bachelor's of Science in Computer Science
              </Entry>
            </Page>

            <Page name="experience">
              <SectionTitle>Experience</SectionTitle>
               
              <Entry icon={MdWork}
                      date={"August 2021 – Present"}
                      title={"Assocaite Software Engineer"}
                      subtitle={"Capital One"}
              >
                <ul>
                  <li>Evaluated real-time data pipeline perfomance using Python with parallelism</li>
                  <li>Analyzing web application vulnerabilities using Burp Suite Pro </li>
                </ul>
              </Entry>
              
              <Entry icon={MdWork}
                      date={"August 2019 – May 2022"}
                      title={"DevOps Engineer Intern"}
                      subtitle={"Bongo"}
              >
                <ul>
                  <li>Built custom monitors to fortify web application's live audio infrastructure</li>
                  <li>Automated 73 end to end tests with Ruby, Capybara, and Jenkins for continous integration</li>
                </ul>
              </Entry>
              
              <Entry icon={MdWork}
                      date={"May 2020 – August 2020"}
                      title={"Associate Cloud Consultant Intern"}
                      subtitle={"Amazon Web Services"}
              >
                <ul>
                  <li>Architected self-service WorkSpace solution to reduce end-user’s procurement time by 85%</li>
                  <li>Satisfied customer requests for highly available RESTful services after project demos</li>
                </ul>
              </Entry>
              
              <Entry icon={MdWork}
                      date={"May 2019 – August 2019"}
                      title={"Cloud Solutions Engineer Intern"}
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
                      date={"Fall 2018 - Present"}
                      title={"Dean's List (x4)"}
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
                      date={"August 2019 - Present"}
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