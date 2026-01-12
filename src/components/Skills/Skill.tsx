import React, { useRef, Suspense } from 'react'
import { UncontrolledTooltip } from 'reactstrap'
import { SkillContainer } from './style'

export function Skill({ skill, Icon, ...props }) {
  const isSSR = typeof window === "undefined"
  const targetRef = useRef<HTMLSpanElement>(null);
  const id = skill.replace(/[^a-z0-9]/gi, '') + 'Tooltip';

  return (
    <SkillContainer>
      {!isSSR && (
        <Suspense fallback={null}>
          <span id={id} ref={targetRef} {...props}>
            <Icon size={'2rem'} style={{textAlign: 'center'}}/>
          </span>
          <UncontrolledTooltip
            placement="top"
            target={id}
            fade={true}
          >
            {skill}
          </UncontrolledTooltip>
        </Suspense>
      )}
    </SkillContainer>
  );
}
