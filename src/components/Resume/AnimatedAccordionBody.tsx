import React from 'react'
import { AccordionBody as RSAccordionBody } from 'reactstrap'
import { motion, AnimatePresence } from 'motion/react'
import { ANIMATION_CONFIG } from '../../animations/config'

interface AnimatedAccordionBodyProps {
  accordionId: string
  children: React.ReactNode
}

export function AnimatedAccordionBody({ accordionId, children }: AnimatedAccordionBodyProps) {
  // Check if mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
  };

  return (
    <RSAccordionBody accordionId={accordionId}>
      <motion.div
        initial={{ y: 10, x: isMobile() ? 0 : 5, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.1,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      >
        {children}
      </motion.div>
    </RSAccordionBody>
  )
}
