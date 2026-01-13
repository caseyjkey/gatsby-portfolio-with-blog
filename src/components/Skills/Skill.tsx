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
  const [iconError, setIconError] = useState(false);
  const id = `skill-${skill.replace(/[^a-z0-9]/gi, '')}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderIcon = () => {
    try {
      return <Icon size={'2rem'} style={{ textAlign: 'center' }} />;
    } catch (error) {
      console.error(`Error rendering icon for ${skill}:`, error);
      setIconError(true);
      return <span style={{ fontSize: '2rem', textAlign: 'center' }}>⚠️</span>;
    }
  };

  if (iconError) {
    return (
      <SkillContainer>
        <span id={id} ref={targetRef} {...props}>
          <span style={{ fontSize: '2rem', textAlign: 'center' }}>⚠️</span>
        </span>
        <UncontrolledTooltip
          placement="top"
          target={id}
          fade={true}
          delay={{ show: 100, hide: 0 }}
        >
          {skill} (icon unavailable)
        </UncontrolledTooltip>
      </SkillContainer>
    );
  }

  return (
    <SkillContainer>
      {isMounted && (
        <Suspense fallback={<span style={{ fontSize: '2rem' }}>⏳</span>}>
          <span id={id} ref={targetRef} {...props}>
            {renderIcon()}
          </span>
          <UncontrolledTooltip
            placement="top"
            target={id}
            fade={true}
            delay={{ show: 100, hide: 0 }}
          >
            {skill}
          </UncontrolledTooltip>
        </Suspense>
      )}
    </SkillContainer>
  );
}
