import styled from 'styled-components'
import { Section, Image } from '../style.js'

export const BlogSection = styled.section`
  margin-top: 6em;
  ${Section}
`;

export const BlogEntry = styled.div`
    margin: 0 auto;
    padding-bottom: 2em;
    width: 75%;
    img {
        width: 100%;
    }
`;