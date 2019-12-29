import styled from 'styled-components'
import { Section, Image, NoPaddingTop, NoPaddingBottom } from '../style.js' // Global styles
import Headshot from './images/about.jpg'

export const AboutSection = styled.section`
	${Image}
	${Section}
	${NoPaddingTop}
	${NoPaddingBottom}
	
	ul.about-info {
		display: inline-block;
		padding: 0;
		margin: 0;
		width: 100%;
		li {
			list-style: none;
			margin-bottom: 10px;
			span {
				width: calc(100% - 130px);
				&:first-child {
					font-weight: 600;
					color: ${(props) => props.theme.black};
					width: 130px;
				}
			}
		}
`;

export const AboutImage = styled.div`
  height: 735px;
	width: 100%;
	z-index: 0;
	position: relative;
	${Image}

	@media (max-width: 767.98px) {
		display: none;
	}
}
`;

export const Counter = styled.div`
	font-size: 20px;
	span {
		font-weight: 400;
		color: ${(props) => props.theme.black};
	}
	span.number {
		color: ${(props) => props.theme.primaryColor};
		font-weight: 600;
	}
	
`;