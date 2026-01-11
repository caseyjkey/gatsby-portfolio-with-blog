import styled from 'styled-components'
import { Section, Image } from '../style.ts'

export const ProjectSection = styled.section`
  margin-top: 6em;
  ${Section}
  flex: 1 0 auto;
`;

export const ProjectWrapper = styled.div`
  width: 100%;
  margin-bottom: 0;
  background-color: ${props => props.theme.white};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover,
  &:focus {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

  // Put lightbox on top of project modal
  ReactModal__Overlay {
    ReactModal__Overlay--after-open {
      z-index: 1100;
    }
  }
`;

export const GalleryFrame = styled.div`
  background-color: #f8fafc;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  .gatsby-image-wrapper,
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
`;

export const ProjectInfo = styled.div`
  padding: 1.5rem;
  background-color: ${props => props.theme.white};

  h3 {
    color: ${props => props.theme.black};
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  span {
    color: ${props => props.theme.primaryColor};
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 11px;
    font-weight: 600;
  }
`;

export const ReadMoreColor = styled.div`
	.react-read-more-read-less {
		color: ${props => props.theme.primaryColor};
	}
`;