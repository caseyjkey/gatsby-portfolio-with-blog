import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import { fadeInUpVariants, getRootMargin, getThreshold } from '../../animations'
import { ANIMATION_CONFIG } from '../../animations/config'

export default function Info({type, info, Icon, link}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = () => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: isMobile() ? getThreshold(true) : 0,
        rootMargin: getRootMargin(isMobile()),
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={fadeInUpVariants}
    >
      <div className="align-self-stretch box text-center p-4 shadow">
        <div className="icon d-flex align-items-center justify-content-center">
          <span><Icon /></span>
        </div>
        <div>
          <h3 className="mb-4">{type}</h3>
          <p>{link && <a href={link}>{info}</a>}
             {!link && info}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
