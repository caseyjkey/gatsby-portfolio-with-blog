import React, {Component} from 'react'
import { Heading } from './style.js' // Global styled-components
import { Container, Row, Col, Card, CardHeader, CardBody, CardText, CardTitle, CardSubtitle } from 'reactstrap'
import { ProjectSection, Body, Title, Header } from './Projects/style.js'
import Project from './Projects/Project'
import { FaReact, FaNpm, FaGit, FaSass,FaGithub, FaRaspberryPi, FaPython, FaMicrochip, FaSlack, FaJava, FaDatabase, FaServer, FaTwitter, FaNewspaper, FaApple } from 'react-icons/fa'
import { IoMdAnalytics } from 'react-icons/io'

export default class Projects extends Component {
  render() {
    return (
      <ProjectSection>
				<Container fluid={true} className="">
					<Row noGutters className="justify-content-center pb-5">
						<Col md={12} className="heading-section text-center ">
							<Heading className="mb-4">My Projects</Heading>
							<p>I find the best way to learn is by practice. Here is the result of my work.</p>
						</Col>
					</Row>
					<Row>
						<Col md={4} className="pb-4">
							<Project title={"Portfolio Website"}
											 subtitle={"Web Development"}
											 icons={[FaReact, FaNpm, FaGit, FaGithub, FaSass]}
							>
								For this year's portfolio, I focused on creating a website focusing on acquiring freelance work.
								In addition, I implemented the Gatsby framework to make updating and adding new content simple.
							</Project>
						</Col>
						<Col md={4} className="pb-4">
							<Project title={"Programming Hat"}
											 subtitle={"IoT Development"}
											 icons={[FaRaspberryPi, FaGit, FaGithub, FaPython, FaMicrochip]}
							>
								The programming hat is a motorized propeller hat triggered by Github contributions. 
								As team of three students built the hat to study the effect of positive reinforcement on Github contributions.
								From our experiments, we found that commits increased by 500% while wearing the programming hat.
								This project was voted best project by our classmates.   
							</Project>
						</Col>
						<Col md={4} className="pb-4">
							<Project title={"Trip Planner"}
											 subtitle={"Software Engineering"}
											 icons={[FaReact, FaNpm, FaGit, FaGithub, FaJava, FaSlack]}
							>
								As a team of four students, we developed of a full-stack web application like Google Maps using agile development practices. 
							</Project>
						</Col>
						<Col md={4} className="pb-4">
							<Project title={"Live Sentiment Analysis"}
											 subtitle={"Oracle Cloud Internship"}
											 icons={[FaPython, FaDatabase, FaServer, IoMdAnalytics, FaTwitter, FaNewspaper, FaApple]}
							>
								My team developed real-time business inteligence dashboards during our summer 2019 internship at Oracle in Reston, VA. 
							</Project>
						</Col>	
						<Col md={4} className="pb-4">
							<div className="shadow project img  d-flex justify-content-center align-items-center" style={{backgroundImage: 'url(images/demo-01.png)'}}>
								<div className="overlay" />
								<div className="text text-center p-4">
									<h3><a href="#">Branding &amp; Illustration Design</a></h3>
									<span>Web Design</span>
								</div>
							</div>
						</Col>
						<Col md={4} className="pb-4">
							<div className="shadow project img  d-flex justify-content-center align-items-center" style={{backgroundImage: 'url(images/demo-02.png)'}}>
								<div className="overlay" />
								<div className="text text-center p-4">
									<h3><a href="#">Branding &amp; Illustration Design</a></h3>
									<span>Web Design</span>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</ProjectSection>
    );
  }
}