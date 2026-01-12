import React, { useEffect, useState, useRef } from 'react'
import { AccordionBody as RSAccordionBody } from 'reactstrap'
import { motion, AnimatePresence } from 'motion/react'
import { ANIMATION_CONFIG } from '../../animations/config'

interface AnimatedAccordionBodyProps {
  accordionId: string
  children: React.ReactNode
}

export function AnimatedAccordionBody({ accordionId, children }: AnimatedAccordionBodyProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  // Check if mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
  };

  // Detect if this accordion body is open by checking its display
  useEffect(() => {
    const checkOpen = () => {
      if (containerRef.current) {
        const computedStyle = window.getComputedStyle(containerRef.current)
        const isCurrentlyOpen = computedStyle.display !== 'none'

        if (isCurrentlyOpen && !isOpen) {
          // Just opened
          setIsOpen(true)
          setShouldAnimate(true)
          // Measure height after a brief delay to ensure content is rendered
          setTimeout(() => {
            if (containerRef.current) {
              setHeight(containerRef.current.scrollHeight)
            }
          }, 10)
        } else if (!isCurrentlyOpen && isOpen) {
          // Just closed
          setIsOpen(false)
          setShouldAnimate(true)
          setHeight(0)
        }
      }
    }

    // Initial check
    checkOpen()

    // Watch for changes
    const observer = new MutationObserver(() => {
      checkOpen()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current, { attributes: true, attributeFilter: ['style', 'class'] })
    }

    // Also check on interval as backup (Reactstrap may not trigger mutation observer)
    const interval = setInterval(checkOpen, 100)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [isOpen])

  return (
    <>
      <div ref={containerRef} style={{ display: 'none' }}>
        <RSAccordionBody accordionId={accordionId}>
          {children}
        </RSAccordionBody>
      </div>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: height || 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.3,
                ease: [0.2, 0.8, 0.2, 1],
              },
              opacity: {
                duration: 0.2,
              },
            }}
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              initial={{ y: 10, x: isMobile() ? 0 : 5 }}
              animate={{ y: 0, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <RSAccordionBody accordionId={accordionId}>
                {children}
              </RSAccordionBody>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
