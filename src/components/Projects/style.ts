import styled from 'styled-components'
import { Section, Image } from '../style.ts'

export const ProjectSection = styled.section`
  margin-top: 6em;
  ${Section}
`;

export const ProjectWrapper = styled.div`
  width: 100%;
  height: 350px;
  margin-bottom: 0;
  position: relative;
  z-index: 0;
  ${Image}


	

	// Put lightbox on top of project modal
	ReactModal__Overlay {
		ReactModal__Overlay--after-open {
			z-index: 1100;
		}
	}

	.gatsby-image-wrapper {
		position: static;
	}
	.overlay{
		background-color: ${props => props.theme.primaryColor};
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		content: '';
		opacity: 0.7;
    z-index: 0;
    -moz-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    transition: all 0.3s ease;
		@media (max-width: 576px) {
			opacity: 1;
		}
	}
	.text{
		max-width: 80%;
		z-index: 1;
		opacity: 0.8;
    -moz-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    transition: all 0.3s ease;
		h3{
      color: ${props => props.theme.black};
      font-size: 24px;
      font-weight: 700;
		}
		span{
			color: rgba(255,255,255,1);
			text-transform: uppercase;
			letter-spacing: 2px;
			font-size: 12px;
			font-weight: 600;
		}
		@media (max-width: 576px) {
			opacity: 1;
			span{
				color: rgba(255,255,255,.8);
			}
		}
	}
	&:hover, &:focus{
		.overlay{
			opacity: .9;
		}
		.text{
			opacity: 1;
		}
	}
`;

export const ReadMoreColor = styled.div`
	.react-read-more-read-less {
		color: ${props => props.theme.primaryColor};
	}
`;