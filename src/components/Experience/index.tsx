import React from 'react'
import styled from 'styled-components'
import { Container, Row, Col } from 'reactstrap'
import { Heading } from '../style.ts'
import { experienceData } from '../../data/experience'
import { lighten } from 'polished'

const ExperienceSection = styled.section`
  position: relative;
  @media (max-width: 767.98px) {
    padding: 6em 0;
  }
  padding: 6em 0;
  background-color: ${(props) => props.theme.white};
`

const TimelineContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
`

const VerticalLine = styled.div`
  position: absolute;
  left: 78px;
  top: 1px;
  bottom: 0;
  width: 2px;
  background-color: ${(props) => props.theme.black};
  z-index: 0;

  @media (max-width: 767.98px) {
    left: 59px;
  }
`

const TimelineRow = styled.div<{ $isLast?: boolean }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.$isLast ? '0' : '3rem'};
  position: relative;

  ${props => props.$isLast && `
    &::after {
      content: '';
      position: absolute;
      left: 78px;
      top: calc(2.5rem / 2);
      bottom: 0;
      width: 4px;
      background-color: ${props.theme.white};
      z-index: 1;

      @media (max-width: 767.98px) {
        left: 58px;
        top: 1rem;
      }
    }
  `}
`

const Year = styled.div`
  min-width: 60px;
  text-align: right;
  padding-right: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.black};
  font-size: 1.1rem;

  @media (max-width: 767.98px) {
    min-width: 50px;
    padding-right: 1.5rem;
    font-size: 1rem;
  }
`

const TimelineDot = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.primaryColor};
  position: absolute;
  left: 79px;
  transform: translateX(-50%);
  z-index: 2;
  flex-shrink: 0;

  @media (max-width: 767.98px) {
    left: 59px;
    width: 2rem;
    height: 2rem;
  }
`

const Content = styled.div`
  flex: 1;
  padding-left: 3rem;
  min-width: 0;

  @media (max-width: 767.98px) {
    padding-left: 2.5rem;
  }
`

const Company = styled.h3`
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0;
  margin-right: 0.75rem;
  color: ${(props) => props.theme.black};
  display: inline;

  @media (max-width: 767.98px) {
    font-size: 1.25rem;
  }
`

const Location = styled.span`
  font-weight: 400;
  font-size: 1.1rem;
  color: ${(props) => lighten(0.3, props.theme.black)};
  display: inline;

  @media (max-width: 767.98px) {
    font-size: 1rem;
  }
`

const CompanyHeader = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 0.5rem;
`

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: ${(props) => lighten(0.2, props.theme.black)};

  @media (max-width: 767.98px) {
    font-size: 1rem;
  }
`

const BulletList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    color: ${(props) => lighten(0.4, props.theme.black)};
    line-height: 1.6;

    &:before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${(props) => props.theme.primaryColor};
      font-size: 1.2rem;
      font-weight: bold;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`

export default function Experience() {
  // Extract start year from date string
  const extractStartYear = (dateString: string): string => {
    // Match patterns like "April 2024", "August 2022", etc.
    const match = dateString.match(/[A-Za-z]+ (\d{4})/);
    return match ? match[1] : dateString;
  };

  return (
    <ExperienceSection name="Experience">
      <Container>
        <Row noGutters className="justify-content-center pb-2 pt-5">
          <Col md={12} className="heading-section text-center">
            <Heading>Experience</Heading>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={12}>
            <TimelineContainer>
              <VerticalLine />
              {experienceData.map((entry, index) => (
                <TimelineRow key={index} $isLast={index === experienceData.length - 1}>
                  <Year>{extractStartYear(entry.year)}</Year>
                  <TimelineDot />
                  <Content>
                    <CompanyHeader>
                      <Company>{entry.company}</Company>
                      <Location>{entry.location}</Location>
                    </CompanyHeader>
                    <Title>{entry.title}</Title>
                    <BulletList>
                      {entry.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </BulletList>
                  </Content>
                </TimelineRow>
              ))}
            </TimelineContainer>
          </Col>
        </Row>
      </Container>
    </ExperienceSection>
  )
}
