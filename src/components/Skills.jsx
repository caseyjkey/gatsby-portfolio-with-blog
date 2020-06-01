import React, { lazy } from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from './style'
import { SkillsSection, SubsectionTitle } from './Skills/style'
import { Skill } from './Skills/Skill'

export default function Skills() {

    // Lazyload the an icon component
    // [param] icon {String}
    // [return] Component
    function loadIcon(Icon) {
        let iconGroup = Icon.slice(0, 2);
        if (iconGroup === 'Gi') {
        return lazy(() => 
            import('react-icons/gi').then(module => 
            ({default: module[Icon]})
            )
        );
        }
        else if (iconGroup === 'Fi') {
        return lazy(() => 
            import('react-icons/fi').then(module => 
            ({default: module[Icon]})
            )
        );
        }
        else if (iconGroup === 'Fa') {
        return lazy(() => 
            import('react-icons/fa').then(module => 
            ({default: module[Icon]})
            )
        );
        }
        else if (iconGroup === 'Di') {
        return lazy(() => 
            import('react-icons/di').then(module => 
            ({default: module[Icon]})
            )
        );
        }
        else if (iconGroup === 'Ri') {
        return lazy(() => 
            import('react-icons/ri').then(module =>
            ({default: module[Icon]})   
            )
        );
        }
    }

    return (
        <SkillsSection>
            <Container>
                <Row noGutters className="justify-content-center pb-5">
					<Col md={12} className="heading-section text-center ">
						<Heading className="mb-4">Skills</Heading>
						<p>Discover my current stack of tools, tech, and languages.</p>
					</Col>
				</Row>
                <Row> {/* 
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
                </Col> */}
                    <Col xs={12} lg={4} id="middleSection">
                        <SubsectionTitle className={"text-center"}>Technology</SubsectionTitle>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="MacOS" Icon={loadIcon('DiApple')} />
                            <Skill skill="GNU/Linux" Icon={loadIcon('DiGnu')} />
                            <Skill skill=".NET" Icon={loadIcon('FaWindows')} />
                        </Row> 
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="React" Icon={loadIcon('FaReact')} />
                            <Skill skill="AWS" Icon={loadIcon('FaAws')} />
                            <Skill skill="Node.js" Icon={loadIcon('DiNodejsSmall')} />
                        </Row>
                        <Row xs={3} className={'justify-content-center'}>
                            <Skill skill="Flutter" Icon={loadIcon('RiFlutterLine')} /> 
                            <Skill skill="Ethereum" Icon={loadIcon('FaEthereum')} />
                        </Row>
                    </Col> {/* 
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
                    */}
                </Row>
            </Container>
        </SkillsSection>
    );
}

