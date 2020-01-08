import styled from 'styled-components'
import { theme, Section, Image } from '../style.js'
import { Card, CardBody, CardHeader, CardTitle, CardSubtitle, CardText } from 'reactstrap'

export const ProjectSection = styled.section`
  ${Section}

`;

export const ProjectWrapper = styled.div`
  width: 100%;
  height: 350px;
  margin-bottom: 0;
  position: relative;
  z-index: 0;
  ${Image}
  background-image: url(${props => props.image});

	.overlay{

		background-color: ${props => props.theme.primaryColor};
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		content: '';
		opacity: 0;
    z-index: -1;
    -moz-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    transition: all 0.3s ease;
		@media (max-width: 576px) {
			opacity: .8;
		}
	}
	.text{
		max-width: 80%;
		z-index: 1;
		opacity: 0;
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