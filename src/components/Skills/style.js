import styled from 'styled-components'
import { theme, Section } from '../style.js'
import { lighten } from 'polished'

export const SkillsSection = styled.div`
  ${Section}
  #middleSection {
    background-color: ${(props) => lighten(0.31, props.theme.primaryColor)};
    span {
      color: ${(props) => props.theme.black};
      background-color: ${(props) => props.theme.white};
    }
  }
`;

export const SkillContainer = styled.div`
  width: 25%;
  margin: 0 0.5rem 1.5rem 0.5rem;
  display: block;
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
  font-weight: 700;
  margin-bottom: 0px;
  color: ${(props) => props.theme.black};
  @media (max-width: 767.98px) {
    clear: both;
  }
`;
