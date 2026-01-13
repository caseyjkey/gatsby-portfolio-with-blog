import React, { useRef, Suspense, useEffect, useState } from 'react'
import { UncontrolledTooltip } from 'reactstrap'
import { SkillContainer } from './style'

interface SkillProps {
  skill: string;
  Icon: React.ComponentType<{ size?: string | number; style?: React.CSSProperties }>;
  [key: string]: any;
}

export function Skill({ skill, Icon, ...props }: SkillProps) {
  const targetRef = useRef<HTMLSpanElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const id = `skill-${skill.replace(/[^a-z0-9]/gi, '')}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <SkillContainer>
      {isMounted && (
        <Suspense fallback={null}>
          <span id={id} ref={targetRef} {...props}>
            <Icon size={'2rem'} style={{ textAlign: 'center' }} />
          </span>
          <UncontrolledTooltip
            placement="top"
            target={targetRef.current || id}
            fade={true}
            delay={{ show: 0, hide: 0 }}
          >
            {skill}
          </UncontrolledTooltip>
        </Suspense>
      )}
    </SkillContainer>
  );
}
