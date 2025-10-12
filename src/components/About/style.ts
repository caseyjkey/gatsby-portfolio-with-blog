import styled from 'styled-components'
import { Section, Image, NoPaddingTop, NoPaddingBottom } from '../style.ts' // Global styles

export const AboutSection = styled.section`
	margin-top: 6em;
	${Image}
	${Section}
	${NoPaddingTop}
	${NoPaddingBottom}
	flex: 1 0 auto;

	ul.about-info {
		display: inline-block;
		margin: 0;
		word-break: break-word;
		li {
			list-style: none;
			margin-bottom: 10px;
			color: ${props => props.theme.black};
			svg {
					font-weight: 600;
					font-size: 25px;
					margin-right: 0.7rem;
				}
		}	
`;

export const Description = styled.p`
	@media (max-width: 375px) {
		padding-left: 0.5rem !important;
	}
	color: ${props => props.theme.black};
`;

export const AboutImage = styled.div`
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

	@media (max-width: 375px) {
		padding-left: 0.5rem !important;
	}
`;