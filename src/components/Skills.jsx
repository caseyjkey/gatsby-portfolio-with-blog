import React from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from './style'
import { SkillsSection, SubsectionTitle } from './Skills/style'
import { Skill } from './Skills/Skill'

export default function Skills() {
    return (
        <SkillsSection>
            <Container>
                <Row noGutters className="justify-content-center pb-5">
					<Col md={12} className="heading-section text-center ">
						<Heading className="mb-4">Skills</Heading>
						<p>Discover my current stack of tools, tech, and languages.</p>
					</Col>
				</Row>
                <Row>
                    <Col xs={12} lg={4} className="animate-box">
                        <SubsectionTitle className={"text-center"}>Languages</SubsectionTitle>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="Python" icon='FaPython' />
                            <Skill skill="C/C++" icon='FaCuttlefish' />
                            <Skill skill="Javascript" Icon='DiJavascript1'/>
                        </Row>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="Java" Icon='DiJava'/>
                            <Skill skill="Ruby" Icon='DiRuby' />
                            <Skill skill="Bash" Icon='DiTerminal' />
                        </Row>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="SQL" Icon='FaDatabase' />
                        </Row>
                    </Col>
                    <Col xs={12} lg={4} id="middleSection">
                        <SubsectionTitle className={"text-center"}>Technology</SubsectionTitle>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="MacOS" Icon='DiApple' />
                            <Skill skill="GNU/Linux" Icon='DiGnu' />
                            <Skill skill=".NET" Icon='FaWindows' />
                        </Row> 
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="React" Icon='FaReact' />
                            <Skill skill="AWS" Icon='FaAws' />
                            <Skill skill="Node.js" Icon='DiNodejsSmall' />
                        </Row>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="Flutter" Icon='RiFlutterLine' /> 
                            <Skill skill="Ethereum" Icon='FaEthereum' />
                        </Row>
                    </Col>
                    <Col xs={12} lg={4}>
                        <SubsectionTitle className={'text-center'}>Tools</SubsectionTitle>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="Git" Icon='DiGit' />
                            <Skill skill="GitHub" Icon='DiGithubBadge' />
                            <Skill skill="Jenkins" Icon='DiJenkins' />
                        </Row>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="Gatsby" Icon="RiGatsbyLine" />
                            <Skill skill="npm" Icon='DiNpm' />
                            <Skill skill="Vim" Icon='DiVim' />
                        </Row>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="Jira" Icon='FaJira' />
                            <Skill skill="Slack" Icon='FaSlack' />
                        </Row>
                    </Col>
                </Row>
            </Container>
        </SkillsSection>
    );
}

