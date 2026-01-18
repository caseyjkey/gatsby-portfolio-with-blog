import styled from 'styled-components'
import { Col } from 'reactstrap'
import { theme, Section } from '../style.ts'
import { lighten } from 'polished'

export const SkillsSection = styled.ul`
  padding-left: 0;
  padding-bottom: 6em;
  ${Section}
  ul {
    list-style: none;
  }
  #middleSection {
    background-color: ${(props) => lighten(0.31, props.theme.primaryColor)};
    span {
      color: ${(props) => props.theme.black};
      background-color: ${(props) => props.theme.white};
    }
  }

  li.skillListItem {
    color: ${(props) => props.theme.black};
    list-style: none;
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 1rem;

    &::before {
      content: '⚡';
      position: absolute;
      left: 0;
    }
  }
`;

export const SkillContainer = styled.li`
  padding: 0 0.5rem 0 0.5rem;
  display: inline-block;
  h3 {
    color: ${(props) => props.theme.black};
    clear: none;
		font-size: 16px;
		margin-bottom: 10px;
		font-weight: 500;
  }
  svg {
    display: block;
    color: ${(props) => props.theme.primaryColor};
    margin-left: 0;
    margin-right: auto;
    margin-bottom: 1.2rem;
  }
  span {
    background-color: ${(props) => props.theme.black};
    width: 5m;
  }
`;

export const SectionTitle = styled.h2`
  font-weight: 800;
  font-size: 30px;
  margin-bottom: 30px;
  color: ${(props) => props.theme.primaryColor};
`;


export const SubsectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 0px;
  margin-top: 1.5rem;
  color: ${(props) => props.theme.black};
  @media (max-width: 767.98px) {
    clear: both;
  }
`;

export const MediumHeading = styled.h3`
  color: ${(props) => props.theme.black}
  position: relative;
  font-size: 1.5rem;
  font-weight: 700;
  span{
    font-weight: 400;
  }
  @media (max-width: 767.98px) {
    font-size: 38px;
  }
`;

export const SectionSubheader = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.darken};
  max-width: 700px;
  margin: 1rem auto 0;
  text-align: center;
  line-height: 1.6;
  @media (max-width: 767.98px) {
    font-size: 16px;
    padding: 0 1rem;
  }
`;

export const TopIllustrationCol = styled(Col)`
  position: relative;
  @media (min-width: 992px) {
    padding-right: 3rem;
  }
`;

export const BottomIllustrationCol = styled(Col)`
  position: relative;
  @media (min-width: 992px) {
    padding-right: 1rem;
  }
`;
