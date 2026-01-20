import React, { useState, useRef, useMemo } from 'react'
import { SkillContainer } from './style'
import { TOOLTIP } from '../../animations/config'

interface SkillProps {
  skill: string;
  Icon: React.ComponentType<{ size?: string | number; style?: React.CSSProperties }>;
  [key: string]: any;
}

// Client-only tooltip component to avoid SSR issues
function ClientTooltip({ target, content }: { target: string; content: string }) {
  const [Tooltip, setTooltip] = useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    // Only import tooltip on client side
    import('reactstrap').then(module => {
      setTooltip(() => module.UncontrolledTooltip);
    });
  }, []);

  if (!Tooltip) return null;

  return (
    <Tooltip
      placement="top"
      target={target}
      delay={{ show: TOOLTIP.show, hide: TOOLTIP.hide }}
    >
      {content}
    </Tooltip>
  );
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
      <span id={id} ref={targetRef} {...props} style={{ cursor: 'pointer' }}>
        <Icon size={'1.5rem'} />
      </span>
      {isMounted && targetRef.current && (
        <ClientTooltip target={id} content={skill} />
      )}
    </SkillContainer>
  );
}
