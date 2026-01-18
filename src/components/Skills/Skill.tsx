import React, { Suspense, useState, useRef, useMemo } from 'react'
import { UncontrolledTooltip } from 'reactstrap'
import { SkillContainer } from './style'
import { TOOLTIP } from '../../animations/config'

interface SkillProps {
  skill: string;
  Icon: React.ComponentType<{ size?: string | number; style?: React.CSSProperties }>;
  [key: string]: any;
}

export function Skill({ skill, Icon, ...props }: SkillProps) {
  const [isMounted, setIsMounted] = useState(false);
  const targetRef = useRef<HTMLSpanElement>(null);

  // Stable ID that doesn't change during animations
  const id = useMemo(() =>
    `skill-${skill.replace(/[^a-z0-9]/gi, '')}`,
    [skill]);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <SkillContainer>
      <Suspense fallback={<span style={{ fontSize: '2rem' }}>⏳</span>}>
        <span id={id} ref={targetRef} {...props} style={{ cursor: 'pointer' }}>
          <Icon size={'1.5rem'} />
        </span>
        {isMounted && targetRef.current && (
          <UncontrolledTooltip
            placement="top"
            target={id}
            delay={{ show: TOOLTIP.show, hide: TOOLTIP.hide }}
          >
            {skill}
          </UncontrolledTooltip>
        )}
      </Suspense>
    </SkillContainer>
  );
}
