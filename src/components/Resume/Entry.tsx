import React from 'react'
import styled from 'styled-components'

const ResumeWrap = styled.div`
  width: 100%;
	margin-bottom: 30px;
	border-bottom: 1px solid rgba(0,0,0,.1);
	padding-bottom: 10px;

	// Use CSS Grid for precise layout control
	display: grid;
	grid-template-columns: 50px 2em 1fr auto;
	grid-template-rows: auto auto auto auto;
	column-gap: 0;
	row-gap: 0;

  .icon {
		width: 50px;
		height: 50px;
		background: ${(props) => props.theme.primaryColor};
		border-radius: 50%;
		// Icon always in row 2 (h2 row), centered vertically
		grid-column: 1;
		grid-row: 2;
		align-self: center;

		span {
			color: ${(props) => props.theme.white};
			font-size: 28px;
			margin-bottom: 4px;
		}
	}

	.date {
		font-weight: 700;
		font-size: 16px;
    color: ${(props) => props.theme.primaryColor};

    // Mobile: date in its own row above h2, spans columns 3-4, allow wrapping
    @media (max-width: 767.98px) {
      grid-column: 3 / 5;
      grid-row: 1;
      margin-bottom: 0.25rem;
      white-space: normal;
    }

    // Desktop: date in column 4, same row as h2, no wrapping
    @media (min-width: 768px) {
      grid-column: 4;
      grid-row: 2;
      align-self: center;
      margin-left: 1rem;
      white-space: nowrap;
    }
  }

	h2 {
    color: ${(props) => props.theme.black};
		font-size: 24px;
    font-weight: 700;
    margin-bottom: 0px;
    line-height: 1.2;
    grid-column: 3;
    grid-row: 2;
    align-self: center;
  }

  .gpa {
    font-weight: 700;
    font-size: 18px;
		color: ${(props) => props.theme.black};
    grid-column: 3 / 5;
    grid-row: 3;
    text-align: right;
    margin-top: 0.5rem;

    @media (max-width: 767.98px) {
        font-size: 16px;
    }
  }

	.subtitle {
		font-size: 18px;
    font-weight: 700;
    color: ${(props) => props.theme.black};
    grid-column: 3 / 5;
    grid-row: 3;
    margin-top: 0.5rem;
	}

	.description {
	  grid-column: 3 / 5;
	  grid-row: 4;
	  margin-top: 0.5rem;
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
  let Icon = icon;

  // Split date by ", " to keep date ranges together on mobile
  const dateParts = date ? date.split(', ') : [];

  return (
    <ResumeWrap style={style}>
      <div className="icon d-flex align-items-center justify-content-center">
        <span><Icon /></span>
      </div>
      {date && (
        <span className="date">
          {dateParts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && <>, </>}
              <span style={{ display: 'inline-block' }}>{part}</span>
            </React.Fragment>
          ))}
        </span>
      )}
      <h2>{title}</h2>
      {graduationDate && <span className="gpa">{graduationDate}</span>}
      <span className="subtitle">{subtitle}</span>
      <Description className="description">{children}</Description>
    </ResumeWrap>
  );
}
