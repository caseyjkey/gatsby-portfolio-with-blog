import styled from 'styled-components'
import { Section, Image } from '../style.ts'

export const BlogSection = styled.section`
  margin-top: 6em;
`;

export const BlogEntry = styled.div<{ isLast?: boolean }>`
    padding-bottom: ${props => props.isLast ? '1.5rem' : '2em'};

    img {
        width: 100%;
    }
    p.excerpt {
      color: ${(props) => props.theme.black};
    }
    a, p {
      text-decoration: none;
    }
    ${props => props.isLast && `
        p {
            margin-bottom: 0;
        }
    `}
`;
