import styled from 'styled-components'
import { theme, Section } from '../style.ts'
import { lighten } from 'polished'

export const SkillsSection = styled.ul`
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

  p {
    color: ${(props) => props.theme.black};
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
    margin: auto;
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

export const MediumHeading = styled.h2`
  color: ${(props) => props.theme.black}
  position: relative;
  font-size: 50px;
  font-weight: 500;
  margin-top: 2rem;
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
