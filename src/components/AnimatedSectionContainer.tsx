import React, { useState, useEffect, useRef } from 'react';
import { AnimationContext } from './AnimationContext';

const AnimatedSectionContainer = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [initialBatchCount, setInitialBatchCount] = useState(0);
    const [isCalculated, setIsCalculated] = useState(false);
    const [shouldDelayForHeader, setShouldDelayForHeader] = useState(false);

    useEffect(() => {
        setShouldDelayForHeader(typeof window !== 'undefined' ? window.scrollY < 10 : false);

        const timer = setTimeout(() => {
            if (!containerRef.current) {
                setIsCalculated(true);
                return;
            }
            
            const sections = containerRef.current.querySelectorAll('.animated-section');
            if (sections.length === 0) {
                setIsCalculated(true);
                return;
            }

            const viewportHeight = window.innerHeight;
            let count = 0;
            for (let i = 0; i < sections.length; i++) {
                const rect = sections[i].getBoundingClientRect();
                if (rect.top < viewportHeight) {
                    count++;
                } else {
                    break;
                }
            }
            setInitialBatchCount(count);
            setIsCalculated(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);
    
    const contextValue = {
        isCalculated,
        shouldDelayForHeader,
        initialBatchCount,
    };

    return (
        <AnimationContext.Provider value={contextValue}>
            <div ref={containerRef}>{children}</div>
        </AnimationContext.Provider>
    );
};

export default AnimatedSectionContainer;