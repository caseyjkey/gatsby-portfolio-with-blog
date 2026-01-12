import React, { useState, Suspense } from 'react'
import { Tooltip } from 'reactstrap'
import { SkillContainer } from './style'

export function Skill({ skill, Icon, ...props }) {
  const isSSR = typeof window === "undefined"
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const id = skill.replace(/[^a-z0-9]/gi, '') + 'Tooltip';

  return (
    <SkillContainer>
      {!isSSR && (
        <Suspense fallback={null}>
          <span id={id} {...props}>
            <Icon size={'2rem'} style={{textAlign: 'center'}}/>
          </span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target={id}
            toggle={() => setTooltipOpen(!tooltipOpen)}
            fade={true}
          >
            {skill}
          </Tooltip>
        </Suspense>
      )}
    </SkillContainer>
  );
}
