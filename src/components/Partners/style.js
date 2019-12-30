import styled from 'styled-components'
import { Section } from '../style.js' // Global styles

export const PartnersSection = styled.section`
  ${Section}
  padding: 4em 0 !important;
  .partner{
    display: block;
    padding: 0 20px;
    @media (max-width: 767.98px) {
      padding: 0 70px;
      margin-bottom: 40px;
    }
  }
	
`;