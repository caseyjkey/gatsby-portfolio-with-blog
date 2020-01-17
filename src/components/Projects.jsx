import React, { lazy } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Heading } from './style.js' // Global styled-components
import { Container, Row, Col } from 'reactstrap'
import { ProjectSection } from './Projects/style.js'
import Project from './Projects/Project'


export const Projects = (props) => {
	const data = useStaticQuery( 
		graphql`
			query {
				allProjectsJson(sort: { order: DESC, fields: [date] }) {
					edges {
						node {
							id
							image {
								childImageSharp {
									fluid(maxWidth: 605, maxHeight: 350 ) {
										...GatsbyImageSharpFluid
									}
								}
							}
							title
							subtitle
							description
							icons {
								di
								fa
								io
							}
							date
							link
							project
						}
					}
				}
			}
		`
	);

	// Get components for icons specified in projects.json
	function loadIcons(iconMap) {
		let Icons = [];
		for(var type of Object.keys(iconMap)) {
			if(iconMap[type]) {
			iconMap[type].map( Icon => {
				if (type === "fa") {
					Icons.push(lazy(() => 
						import('react-icons/fa').then(module => ({ default: module[Icon] }))
					));
				}
				else if (type === "io") {
					Icons.push(lazy(() => 
						import('react-icons/io').then(module => ({ default: module[Icon] }))
					));
				}
				else if (type === "di") {
					Icons.push(lazy(() => 
						import('react-icons/di').then(module => ({ default: module[Icon] }))
					));
				}
			})
		}
		}
		return Icons;
	}

	return (
		<ProjectSection name="Projects">
			<Container fluid={true} className="">
				<Row noGutters className="justify-content-center pb-5">
					<Col md={12} className="heading-section text-center ">
						<Heading className="mb-4">My Projects</Heading>
						<p>I find the best way to learn is by practice. Here are the results of my work.</p>
					</Col>
				</Row>
				<Row>
					{data.allProjectsJson.edges.map(project =>  (
						<Col md={4} className="pb-4">
							<Project image={project.node.image.childImageSharp.fluid}
											 title={project.node.title}
											 subtitle={project.node.subtitle}
											 icons={loadIcons(project.node.icons)}
											 date={project.node.date}
											 project={project.node.project}
							>
								<div dangerouslySetInnerHTML={{ __html: project.node.description}} />
							</Project>
						</Col>
					))}
				</Row>
			</Container>
		</ProjectSection>
	);
} 