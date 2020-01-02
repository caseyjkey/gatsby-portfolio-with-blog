import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'
import { ResumeSection, Page, Subtitle } from './style.js'
import { Nav, Link } from './Nav'
import Entry from './Entry'
import { SkillCircle, Skillbar } from './Skill'
import { GiGraduateCap, GiDiploma } from 'react-icons/gi'
import { MdWork } from 'react-icons/md'
import { Waypoint } from 'react-waypoint'

 export default class Resume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: {
        education: [false, false],
        experience: [false, false],
        skills : []
      }
    }

    this.onEnter = this.onEnter.bind(this);
    this.countEntries = this.countEntries.bind(this); 
    this.countSkills = this.countSkills.bind(this);
  }

  onEnter(section, subsection) {
    let visibleCopy = this.state.visible;
    visibleCopy[section][subsection] = true;

    this.setState({visible: visibleCopy});
  }

  countEntries(section, children) {
    let count = children.filter(child => child.type === Entry).length;
    let stateCopy = this.state;
    stateCopy["visible"][section] = Array(count);

    this.setState(stateCopy);
  }

  countSkills(section, children) {
    let count = children.filter(child => child.type === SkillCircle || child.type == Skillbar).length;

    let stateCopy = this.state;
    stateCopy["visible"][section] = Array(count);

    this.setState(stateCopy);
  }

  render() {
    let education = this.state.visible.education;
    let experience = this.state.visible.experience;

    return (
      <ThemeProvider theme={theme}>
        <ResumeSection className="goto-here">
          <Container>
            <Row>
              <Col md={3}>
                <Nav>
                  <Link to="education" activeClass="current" spy={true} smooth={true}>Education</Link>
                  <Link to="experience" activeClass="current" spy={true} smooth={true}>Experience</Link>
                  <Link to="skills" activeClass="current" spy={true} smooth={true}>Skills</Link>
                  <Link to="awards" activeClass="current" spy={true} smooth={true}>Awards</Link>
                  <Link to="leadership" activeClass="current" spy={true} smooth={true}>Leadership</Link>
                </Nav>
              </Col>

              <Col md={9}>

                <Page name="education" count={this.countEntries}>
                  <h2 className="heading">Education</h2>

                  <Waypoint onEnter={() => this.onEnter("education", 0)}></Waypoint>
                  <Entry visible={education[0]} 
                        icon={GiGraduateCap} 
                        date={"Expected: May 2021"}
                        title={"Computer Science"}
                        subtitle={"Colorado State University"}
                        gpa={"3.53"}>
                    Bachelor's of Science in Computer Science with a concentration in Computer Science.
                  </Entry>

                  <Waypoint onEnter={() => this.onEnter("education", 1)}></Waypoint>
                  <Entry visible={education[1]}
                        icon={GiDiploma}
                        date={"Expected: May 2021"}
                        title={"Entrepreneurship and Innovation"}
                        subtitle={"Colorado State University"}
                        gpa={"4.0"}>
                    A certificate to help develop an entrepreneurial mindset.
                  </Entry>
                </Page>

                <Page name="experience" count={this.countEntries}>
                  <h2 className="heading">Experience</h2>
                  <Waypoint onEnter={() => this.onEnter("experience", 0)}></Waypoint>
                  <Entry visible={experience[0]}
                          icon={MdWork}
                          date={"August 2019 – Present"}
                          title={"DevOps Intern"}
                          subtitle={"Bongo"}>
                    <ul>
                      <li>Automating quality assurance with Ruby and Jenkins for the Bongo web app</li>
                      <li>Analyzing web application vulnerabilities using Burp Suite Pro </li>
                    </ul>
                  </Entry>
                  
                  <Waypoint onEnter={() => this.onEnter("experience", 1)}></Waypoint>
                  <Entry visible={experience[0]}
                          icon={MdWork}
                          date={"May 2019 – August 2019"}
                          title={"Cloud Solutions Engineer Intern"}
                          subtitle={"Oracle"}>
                    <ul>
                      <li>Demonstrated Oracle Cloud data analytics by building dashboard for improving business KPIs</li>
                      <li>Analyzed Tweets via API and scraped news articles for real-time sentiment analysis using Python</li>
                      <li>Automated application deployment to Oracle Cloud’s Infrastructure-as-a-Service</li>
                    </ul>
                  </Entry>
                </Page>
                
                <Page name="skills" count={this.countSkills}>
                  <h2 className="heading">Skills</h2>
                  <Subtitle>Github Metrics</Subtitle>
                  <Row className="progress-circle mb-5">
                    <Col lg={4} mb={4}>
                      <SkillCircle skill="JavaScript"
                                   percentTotal="33.51"
                      />
                    </Col>
                    <Col lg={4} mb={4}>
                      <SkillCircle skill="Java"
                             percentTotal="29.10"
                      />
                    </Col>
                    <Col lg={4} mb={4}>
                      <SkillCircle skill="Python"
                             percentTotal="15.32"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="animate-box">
                      <Skillbar skill="Python" skillLevel={3} />
                    </Col>
                    <Col md={6} className="animate-box">
                      <div className="progress-wrap ">
                        <h3>jQuery</h3>
                        <div className="progress">
                          <div className="progress-bar color-2" role="progressbar" aria-valuenow="85"
                            aria-valuemin="0" aria-valuemax="100" style={{width: "85%"}}>
                            <span>85%</span>
                            </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6} className="animate-box">
                      <div className="progress-wrap ">
                        <h3>HTML5</h3>
                        <div className="progress">
                          <div className="progress-bar color-3" role="progressbar" aria-valuenow="95"
                            aria-valuemin="0" aria-valuemax="100" style={{width: "95%"}}>
                            <span>95%</span>
                            </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6} className="animate-box">
                      <div className="progress-wrap ">
                        <h3>CSS3</h3>
                        <div className="progress">
                          <div className="progress-bar color-4" role="progressbar" aria-valuenow="90"
                            aria-valuemin="0" aria-valuemax="100" style={{width: "90%"}}>
                            <span>90%</span>
                            </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6} className="animate-box">
                      <div className="progress-wrap ">
                        <h3>WordPress</h3>
                        <div className="progress">
                          <div className="progress-bar color-5" role="progressbar" aria-valuenow="70"
                            aria-valuemin="0" aria-valuemax="100" style={{width: "70%"}}>
                            <span>70%</span>
                            </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6} className="animate-box">
                      <div className="progress-wrap ">
                        <h3>SEO</h3>
                        <div className="progress">
                          <div className="progress-bar color-6" role="progressbar" aria-valuenow="80"
                            aria-valuemin="0" aria-valuemax="100" style={{width: "80%"}}>
                            <span>80%</span>
                            </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Page>

                <Page name="awards" count={this.countEntries}>
                  <h2 className="heading">Awards</h2>
                  <div className="resume-wrap d-flex ">
                    <div className="icon d-flex align-items-center justify-content-center">
                      <span className="flaticon-ideas"></span>
                    </div>
                    <div className="text pl-3">
                      <span className="date">2014-2015</span>
                      <h2>Top 10 Web Developer</h2>
                      <span className="position">Cambridge University</span>
                      <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                    </div>
                  </div>
                  <div className="resume-wrap d-flex ">
                    <div className="icon d-flex align-items-center justify-content-center">
                      <span className="flaticon-ideas"></span>
                    </div>
                    <div className="text pl-3">
                      <span className="date">2014-2015</span>
                      <h2>Top 5 LeaderShip Exellence Winner</h2>
                      <span className="position">Cambridge University</span>
                      <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                    </div>
                  </div>
                  <div className="resume-wrap d-flex ">
                    <div className="icon d-flex align-items-center justify-content-center">
                      <span className="flaticon-ideas"></span>
                    </div>
                    <div className="text pl-3">
                      <span className="date">2014-2015</span>
                      <h2>Top 4 Web Tester</h2>
                      <span className="position">Cambridge University</span>
                      <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                    </div>
                  </div>
                  <div className="resume-wrap d-flex ">
                    <div className="icon d-flex align-items-center justify-content-center">
                      <span className="flaticon-ideas"></span>
                    </div>
                    <div className="text pl-3">
                      <span className="date">2014-2015</span>
                      <h2>Art &amp; Creative Director</h2>
                      <span className="position">Cambridge University</span>
                      <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                    </div>
                  </div>
                </Page>
              </Col>
            </Row>
          </Container>
        </ResumeSection>
      </ThemeProvider>
    );
  }
 }