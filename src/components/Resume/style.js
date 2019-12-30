import styled from 'styled-components'
import { Section, NoPaddingBottom } from '../style.js' // Global styles
import { default as PlainPage } from './Page'

export const ResumeSection = styled.section`
  ${Section}
  ${NoPaddingBottom}
`;

export const Page = styled(PlainPage)`
  width: 100%;
  margin-bottom: 7em;
  &.four {
    margin-bottom: 0;
  }
  .heading {
    font-weight: 800;
    font-size: 30px;
    margin-bottom: 30px;
    color: ${(props) => props.theme.primaryColor};
  }
`;