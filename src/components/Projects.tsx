import React, { lazy, useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Heading } from './style.ts'
import { Container, Row, Col } from 'reactstrap'
import { ProjectSection } from './Projects/style.ts'
import Project from './Projects/Project'
import { format, parseISO } from 'date-fns'
import { motion } from 'motion/react'
import { fadeInUpVariants } from '../animations'
import { ANIMATION_CONFIG, TIMING } from '../animations/config'

export const Projects = (props) => {
	const [isMounted, setIsMounted] = useState(false);
	const [isHeaderVisible, setIsHeaderVisible] = useState(false);
	const headerWrapperRef = React.useRef<HTMLDivElement>(null);

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

	// Mark as mounted on client side - delays animation until after hydration
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Header viewport detection - starts after mount to prevent SSR mismatch
	useEffect(() => {
		if (!isMounted) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isHeaderVisible) {
						setIsHeaderVisible(true);
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.1, rootMargin: ANIMATION_CONFIG.rootMargin }
		);

		if (headerWrapperRef.current) {
			observer.observe(headerWrapperRef.current);
		}

		return () => observer.disconnect();
	}, [isMounted, isHeaderVisible]);

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

	// Calculate delay for project cards - row by row from top-left to bottom-right
	const getProjectDelay = (index: number) => {
		const row = Math.floor(index / 3);
		const col = index % 3;
		// Row-based delay: each row starts 0.15s after the previous row
		// Within each row: left to right with 0.08s between cards
		return (row * 0.15) + (col * 0.08);
	};

	return (
		<ProjectSection name="Projects" id="projects-section">
			<Container fluid={true}>
				<Row className="g-0 justify-content-center pb-5 mt-5">
					<Col md={12} className="heading-section text-center">
						<div ref={headerWrapperRef} style={{ opacity: isMounted ? 1 : 0 }}>
							<motion.div
								initial="hidden"
								animate={isHeaderVisible ? "visible" : "hidden"}
								custom={{ delay: 0, distance: TIMING.sectionHeader.distance }}
								variants={fadeInUpVariants}
							>
								<Heading className="mt-5 mb-4">Projects</Heading>
								<p>A testmix of client work, late nights, and bold ideas.</p>
							</motion.div>
						</div>
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
							<AnimatedProjectCol key={index} index={index} delay={getProjectDelay(index)} isMounted={isMounted}>
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
							</AnimatedProjectCol>
						)
					})}
				</Row>
			</Container>
		</ProjectSection >
	);
}

// Animated column component with individual viewport detection
const AnimatedProjectCol = ({ children, index, delay, isMounted }: { children: React.ReactNode; index: number; delay: number; isMounted: boolean }) => {
	const [isVisible, setIsVisible] = useState(false);
	const colRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isMounted) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isVisible) {
						setIsVisible(true);
						observer.disconnect();
					}
				});
			},
			// Use negative bottom margin to trigger when card is properly in view
			// -100px bottom means trigger when element is 100px into viewport from bottom
			{ threshold: 0.01, rootMargin: '-100px 0px -100px 0px' }
		);

		if (colRef.current) {
			observer.observe(colRef.current);
		}

		return () => observer.disconnect();
	}, [isVisible, isMounted]);

	return (
		<Col ref={colRef} md={4} className="pb-4" style={{ opacity: isMounted ? 1 : 0 }}>
			<motion.div
				initial="hidden"
				animate={isVisible ? "visible" : "hidden"}
				custom={{ delay, distance: TIMING.primaryUnit.distance }}
				variants={fadeInUpVariants}
			>
				{children}
			</motion.div>
		</Col>
	);
};
