import React, { lazy } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Heading } from './style.ts' // Global styled-components
import { Container, Row, Col } from 'reactstrap'
import { ProjectSection } from './Projects/style.ts'
import Project from './Projects/Project'
import { format, parseISO } from 'date-fns';


export const Projects = (props) => {
	const data = useStaticQuery(
		graphql`{
			allProject(sort: {start: DESC}) {
				edges {
					node {
						project
						image {
							childImageSharp {
								gatsbyImageData(width: 605, height: 350, layout: CONSTRAINED)
							}
							extension
							relativeDirectory
							relativePath
							publicURL
						}
						galleryImages {
							image {
								childImageSharp {
									gatsbyImageData(layout: FULL_WIDTH)
								}
								extension
								relativeDirectory
								relativePath
								publicURL
							}
						}
						title
						subtitle
						description
						icons {
							di
							fa
							io
							gr
							si
						}
						start
						end {
							date
							present
						}
						link
					}
				}
			}
		}`
	);

	// Get components for icons specified in projects.json
	function loadIcons(iconMap) {
		let Icons = [];
		for (let type of Object.keys(iconMap)) {
			if (iconMap[type]) {
				iconMap[type].map(Icon => {
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
					else if (type === "gr") {
						Icons.push(lazy(() =>
							import('react-icons/gr').then(module => ({ default: module[Icon] }))
						));
					}
					else if (type === "si") {
						Icons.push(lazy(() =>
							import('react-icons/si').then(module => ({ default: module[Icon] }))
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
				<Row noGutters className="justify-content-center pb-5 mt-5">
					<Col md={12} className="heading-section text-center ">
						<Heading className="mb-4">Projects</Heading>
						<p>A mix of client work, late nights, and bold ideas.</p>
					</Col>
				</Row>
				<Row>
					{data.allProject.edges.map((project, index) => {
						const formattedStart = format(parseISO(project.node.start), 'MMMM yyyy')
						const formattedEnd = project.node.end.present
							? 'Present'
							: format(parseISO(project.node.end.date), 'MMMM yyyy');

						// Generate post link based on start date and project slug
						const startDate = parseISO(project.node.start);
						const year = format(startDate, 'yyyy');
						const month = format(startDate, 'MM');
						const postLink = `/projects/${year}-${month}-${project.node.project}/`;

						return (
							<Col key={index} md={4} className="pb-4">
								<Project image={project.node.image.childImageSharp.gatsbyImageData}
									galleryImages={(project.node.galleryImages || [{ "image": project.node.image }])}
									title={project.node.title}
									subtitle={project.node.subtitle}
									icons={loadIcons(project.node.icons)}
									date={formattedStart + ' - ' + formattedEnd}
									link={project.node.link}
									postLink={postLink}
								>
									<div dangerouslySetInnerHTML={{ __html: project.node.description }} />
								</Project>
							</Col>
						)
					})}
				</Row>
			</Container>
		</ProjectSection>
	);
}