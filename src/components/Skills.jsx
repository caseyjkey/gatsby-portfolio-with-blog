import React from 'react'
import { Container, Row, Col } from 'reactstrap'

export function Skills() {
    return (
        <Container>
            <Row>
                <Col xs={12} lg={4} className="animate-box">
                <SubsectionTitle className={"text-center"}>Languages</SubsectionTitle>
                <Row xs={3} className={'justify-content-center'}>
                    <Skill skill="Python" icon="FaPython" />
                    <Skill skill="C++" />
                    <Skill skill="Javascript" />
                </Row>
                <Row xs={3} className={'justify-content-center'}>
                    <Skill skill="Java" />
                    <Skill skill="Ruby" />
                    <Skill skill="Solidity" />
                </Row>
                <Row xs={3} className={'justify-content-center'}>
                    <Skill skill="SQL" style={{width: '100%'}}/>
                </Row>
                </Col>
                <Col id="middleSection">
                    <SubsectionTitle className={"text-center"}>Technology</SubsectionTitle>
                    <Row xs={3} className={'justify-content-center'}>
                    <Skill skill="MacOS" />
                    <Skill skill="Linux" />
                    <Skill skill=".NET" />
                    </Row> 
                    <Row xs={3} className={'justify-content-center'}>
                    <Skill skill="React" />
                    <Skill skill="AWS" />
                    <Skill skill="Oracle Cloud" />
                    </Row>
                    <Row xs={3} className={'justify-content-center'}>
                    <Skill skill="IoT" />
                    <Skill skill="Flutter" /> 
                    <Skill skill="Ethereum" />
                    </Row>
                </Col>
                <Col>
                <SubsectionTitle className={'text-center'}>Tools</SubsectionTitle>
                <Row xs={3} className={'justify-content-center'}>
                    <Skill skill="Git" />
                    <Skill skill="GitHub" />
                    <Skill skill="Jenkins" />
                </Row>
                <Row xs={3} className={'justify-content-center'}>
                    <Skill skill="Gatsby" Icon="RiGatsbyLine" />
                    <Skill skill="npm" />
                    <Skill skill="yarn" />
                </Row>
                <Row xs={3} className={'justify-content-center'}>
                    <Skill skill="Jira" />
                    <Skill skill="Slack" />
                </Row>
                </Col>
            </Row>
        </Container>
    );
}