import styled from 'styled-components'
import { theme, Section } from '../style.ts'
import { lighten } from 'polished'

export const ServicesSection = styled.section`
  ${Section}

`;

export const ServiceContainer = styled.div`
	margin-bottom: 40px;
	padding: 2em;
	background: ${lighten(0.1, theme.white)};
	width: 100%;
	.icon{
		margin-bottom: 30px;
    font-size: 60px;
    line-height: 1.0;
    color: ${(props) => props.theme.primaryColor};
	}
	.desc{
		h3{
			line-height: 1.3;
			font-size: 13px;
			font-weight: 500;
			letter-spacing: 3px;
			text-transform: uppercase;
			position: relative;
			color: ${(props) => props.theme.black};
			&:after{
				position: absolute;
				bottom: -15px;
				left: 0; 
				right: 0;
				content: '';
				width: 30px;
				height: 1px;
				background: ${(props) => props.theme.primaryColor};
				margin: 0 auto;
			}
			a{
				color: ${(props) => props.theme.white};
			}
		}
		h4{
			font-size: 20px;
			font-weight: 300;
			margin-bottom: 18px;
		}
		span{
			display: block;
			text-transform: uppercase;
			font-size: 12px;
			margin-bottom: 10px;
			color: ${(props) => props.theme.primaryColor};
		}
		p{
			color: ${lighten(0.7, theme.black)};
		}
	}
}
`;