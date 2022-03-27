import styled from 'styled-components'
import { Section, NoPaddingBottom } from '../style.js' // Global styles
import { default as PlainPage } from './Page'

export const ResumeSection = styled.section`
  ${Section}
  ${NoPaddingBottom}
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

export const Page = styled(PlainPage)`
  width: 100%;
  &.four {
    margin-bottom: 0;
  }
`;

