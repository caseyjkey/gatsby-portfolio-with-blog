import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { ThemeProvider } from 'styled-components'
import { theme } from '../style.js'
import { ResumeSection, Page } from './style.js'
import { Nav, Link } from './Nav'
import Entry from './Entry'
import { GiGraduateCap, GiDiploma } from 'react-icons/gi'
import { MdWork } from 'react-icons/md'
import { Waypoint } from 'react-waypoint'

 export default class Resume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: null,
      visible: {
        education: [false, false],
        experience: [false, false],

      }
    }

    this.onEnter = this.onEnter.bind(this);
    this.activatePage = this.activatePage.bind(this);
    this.countEntries = this.countEntries.bind(this); 
  }

  onEnter(section, subsection) {
    let visibleCopy = this.state.visible;
    visibleCopy[section][subsection] = true;

    this.setState({visible: visibleCopy});
  }

  activatePage(section) {
    let stateCopy = this.state;
    stateCopy["currentPage"] = section;

    this.setState(stateCopy);
  }

  countEntries(section, children) {
    let count = children.filter(child => child.type === Entry).length;
    let stateCopy = this.state;
    stateCopy["visible"][section] = Array(count);

    this.setState(stateCopy);
  }

  render() {
    let currentPage = this.state.currentPage;
    let education = this.state.visible.education;
    let experience = this.state.visible.experience;

    return (
      <ThemeProvider theme={theme}>
        <ResumeSection className="goto-here">
          <Container>
            <Row>
              <Col md={3}>
                <Nav>
                  <Link page="education" current={currentPage}>Education</Link>
                  <Link page="experience" current={currentPage}>Experience</Link>
                  <Link page="skills" current={currentPage}>Skills</Link>
                  <Link page="awards" current={currentPage}>Awards</Link>
                  <Link page="leadership" current={currentPage}>Leadership</Link>
                </Nav>
              </Col>

              <Col md={9}>
                <Waypoint onEnter={() => this.activatePage("education")}
                          onLeave={() => this.activatePage("experience")}>
                  <Page id="education" count={this.countEntries}>
                    <h2 className="heading">Education</h2>

                    <Waypoint onEnter={() => this.onEnter("education", 0)}></Waypoint>
                    <Entry visible={education[0]} 
                          icon={GiGraduateCap} 
                          date={"Expected: May 2021"}
                          title={"Computer Science"}
                          subtitle={"Colorado State University"}
                          gpa={"3.53"}>
                      Bachelor's of Science degree in Computer Science with a concentration in Computer Science.
                    </Entry>

                    <Waypoint onEnter={() => this.activatePage("education", 1)}></Waypoint>
                    <Entry visible={education[1]}
                          icon={GiDiploma}
                          date={"Expected: May 2021"}
                          title={"Entrepreneurship and Innovation"}
                          subtitle={"Colorado State University"}
                          gpa={"4.0"}>
                      A certificate to help develop an entrepreneurial mindset.
                    </Entry>
                  </Page>
                </Waypoint>

                <Waypoint onLeave={() => this.activatePage("skills")}>
                  <Page id="experience" count={this.countEntries}>
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
                    
                    <Waypoint onEnter={() => this.activatePage("experience", 1)}></Waypoint>
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
                  </Page>
                </Waypoint>
                
                <Page id="skills" count={this.countEntries}>
                  <h2 className="heading">Skills</h2>
                  <div className="row progress-circle mb-5">
                    <div className="col-lg-4 mb-4">
                      <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="h5 font-weight-bold text-center mb-4">CSS</h2>

                        {/* Progress bar 1 8*/}
                        <div className="progress mx-auto" data-value='90'>
                          <span className="progress-left">
                            <span className="progress-bar border-primary"></span>
                          </span>
                          <span className="progress-right">
                            <span className="progress-bar border-primary"></span>
                          </span>
                          <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                            <div className="h2 font-weight-bold">90<sup className="small">%</sup></div>
                          </div>
                        </div>
                        {/* END */}

                        {/* Demo info */}
                        <div className="row text-center mt-4">
                          <div className="col-6 border-right">
                            <div className="h4 font-weight-bold mb-0">28%</div><span className="small text-gray">Last week</span>
                          </div>
                          <div className="col-6">
                            <div className="h4 font-weight-bold mb-0">60%</div><span className="small text-gray">Last month</span>
                          </div>
                        </div>
                        {/* END */}
                      </div>
                    </div>

                    <div className="col-lg-4 mb-4">
                      <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="h5 font-weight-bold text-center mb-4">HTML</h2>

                        {/* Progress bar 1 */}
                        <div className="progress mx-auto" data-value='80'>
                          <span className="progress-left">
                            <span className="progress-bar border-primary"></span>
                          </span>
                          <span className="progress-right">
                            <span className="progress-bar border-primary"></span>
                          </span>
                          <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                            <div className="h2 font-weight-bold">80<sup className="small">%</sup></div>
                          </div>
                        </div>
                        {/* END */}

                        {/* Demo info */}
                        <div className="row text-center mt-4">
                          <div className="col-6 border-right">
                            <div className="h4 font-weight-bold mb-0">28%</div><span className="small text-gray">Last week</span>
                          </div>
                          <div className="col-6">
                            <div className="h4 font-weight-bold mb-0">60%</div><span className="small text-gray">Last month</span>
                          </div>
                        </div>
                        {/* END */}
                      </div>
                    </div>

                    <div className="col-lg-4 mb-4">
                      <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="h5 font-weight-bold text-center mb-4">jQuery</h2>

                        {/* Progress bar 1 */}
                        <div className="progress mx-auto" data-value='75'>
                          <span className="progress-left">
                            <span className="progress-bar border-primary"></span>
                          </span>
                          <span className="progress-right">
                            <span className="progress-bar border-primary"></span>
                          </span>
                          <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                            <div className="h2 font-weight-bold">75<sup className="small">%</sup></div>
                          </div>
                        </div>
                        {/* END */}

                        {/* Demo info */}
                        <div className="row text-center mt-4">
                          <div className="col-6 border-right">
                            <div className="h4 font-weight-bold mb-0">28%</div><span className="small text-gray">Last week</span>
                          </div>
                          <div className="col-6">
                            <div className="h4 font-weight-bold mb-0">60%</div><span className="small text-gray">Last month</span>
                          </div>
                        </div>
                        {/* END */}
                      </div>
                    </div>
                  </div>
                  <Row>
                    <Col md={6} className="animate-box">
                      <div className="progress-wrap ftco-animate">
                        <h3>Photoshop</h3>
                        <div className="progress">
                          <div className="progress-bar color-1" role="progressbar" aria-valuenow="90"
                            aria-valuemin="0" aria-valuemax="100" style={{width: "90%"}}>
                            <span>90%</span>
                            </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6} className="animate-box">
                      <div className="progress-wrap ftco-animate">
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
                      <div className="progress-wrap ftco-animate">
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
                      <div className="progress-wrap ftco-animate">
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
                      <div className="progress-wrap ftco-animate">
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
                      <div className="progress-wrap ftco-animate">
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

                <Page id="awards" count={this.countEntries}>
                  <h2 className="heading">Awards</h2>
                  <div className="resume-wrap d-flex ftco-animate">
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
                  <div className="resume-wrap d-flex ftco-animate">
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
                  <div className="resume-wrap d-flex ftco-animate">
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
                  <div className="resume-wrap d-flex ftco-animate">
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