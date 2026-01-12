import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'motion/react'

const ResumeWrap = styled.div`
  width: 100%;
	margin-bottom: 30px;
	border-bottom: 1px solid rgba(0,0,0,.1);
	padding-bottom: 10px;
	.icon{
    margin-right: 2em;
		width: 50px;
		height: 50px;
		background: ${(props) => props.theme.primaryColor};
		border-radius: 50%;	
		span{
			color: ${(props) => props.theme.white};
			font-size: 28px;
		}
	}
	.text{
    width: calc(100% - 50px);
    p {
      margin-top: 0.5rem;
      @media (max-width: 767.98px) {
        clear: both;
      }
    }
    @media (max-width: 767.98px) {
      position: relative;
    }
    
	}
	.date{
		font-weight: 700;
		font-size: 16px;
    color: rgba(0,0,0,.6);
    float: right;
    color: ${(props) => props.theme.primaryColor};
    @media (max-width: 767.98px) {
      float: left;
    }
  }
  .gpa {
    font-weight: 700;
    font-size: 18px;
		color: ${(props) => props.theme.black};
    float: right;
    @media (max-width: 767.98px) {
        font-size: 16px;
        clear: both;
        position: absolute;
        top: 0px;
        right: 0px;
    }
  }
	h2{
    color: ${(props) => props.theme.black};
		font-size: 24px;
    font-weight: 700;
    margin-bottom: 0px;
    @media (max-width: 767.98px) {
      clear: both;
    }
	}
	.subtitle{
		font-size: 18px;
    font-weight: 700;
		// letter-spacing: 3px;
    // text-transform: uppercase;
		color: ${(props) => props.theme.black};
	}
`;

const Description = styled.div`
  color: ${(props) => props.theme.black};
  ul {
    padding-left: 0px;
  }
  @media (max-width: 375px) {
    word-wrap: break-word;
  }
`;

export default function Entry({ icon, date, title, subtitle, graduationDate, children, style }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Make visible when component mounts
    setVisible(true);
  }, []);

  let Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
      transition={{
        duration: 0.8,
        ease: [0.2, 0.8, 0.2, 1],
      }}
    >
      <ResumeWrap className="d-flex" style={style}>
        <div className="icon d-flex align-items-center justify-content-center">
          <span><Icon /></span>
        </div>
        <div className="text pl-3">
          {date && <span className="date">{date}</span>}
          {graduationDate && <span className="gpa">{graduationDate}</span>}
          <h2>{title}</h2>
          <span className="subtitle">{subtitle}</span>
          <Description>{children}</Description>
        </div>
      </ResumeWrap>
    </motion.div>
  );
}
