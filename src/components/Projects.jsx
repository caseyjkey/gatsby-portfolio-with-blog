import React, {useState} from 'react'
import { Heading } from './style.js' // Global styled-components
import { Container, Row, Col, Button, Card, CardHeader, CardBody, CardText, CardTitle, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ProjectSection, Body, Title, Header } from './Projects/style.js'
import Project from './Projects/Project'
import { FaReact, FaNpm, FaGit, FaSass,FaGithub, FaRaspberryPi, FaPython, FaMicrochip, FaSlack, FaJava, FaDatabase, FaServer, FaTwitter, FaNewspaper, FaApple } from 'react-icons/fa'
import { IoMdAnalytics } from 'react-icons/io'

export const Projects = (props) => {
	const [modal, setModal] = useState(false);

	const toggleModal = () => setModal(!modal);

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
								<h3><a href="#">Python Curriculum &amp; Blog</a></h3>
								<span className="mb-4">Web Development</span>
								<p className="text-white">I developed a curriculum and hosted it as a blog for my position as a student instructor at the 2017 Northrop Grumman STEM camp.</p>
							</div>
						</div>
					</Col>
					<Col md={4} className="pb-4">
						<div className="shadow project img  d-flex justify-content-center align-items-center" style={{backgroundImage: 'url(images/demo-02.png)'}}>
							<div className="overlay" onClick={toggleModal}/>
							<div className="text text-center p-4">
								<h3><a href="#">Blockchain &amp; Music Billboard</a></h3>
								<span>Web App Development</span>
							</div>
						</div>
						<Modal isOpen={modal} toggle={toggleModal}>
							<ModalHeader toggle={toggleModal}>
								Top 100 Musician Billboard
							</ModalHeader>
							<ModalBody>
								This online music billboard is a curated list of high-quality musicians.
								It works like a game where token holders control which musicians are listed.
								Applying to be on the top musician list requires a deposit to prevent trolls and spam submissions.
								The token holders are incentivized to maintain the quality of the list by challenging applications.
								If a challenge is successful, the voters are rewarded with the applicant's deposit.
								Challenging applications creates a high quality list and a successful challenge rewards the voters with the applicant's deposit.
							</ModalBody>
							<ModalFooter>
								<Button color="primary" href={"https://etherradio.herokuapp.com/#!/landing"} target={"_blank"}>View project</Button>
							</ModalFooter>
						</Modal>
					</Col>
				</Row>
			</Container>
		</ProjectSection>
	);
}