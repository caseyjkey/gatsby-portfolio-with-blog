import React, { Fragment, Suspense } from 'react'
import { motion } from 'motion/react'
import { ActivityIconWrapper } from './style'
import { TIMELINE, EASING } from '../../animations/config'

interface ActivityProps {
    Icon: React.ComponentType;
    description: string;
    icon?: { name?: string };
    isVisible?: boolean;
    delay?: number;
}

export default function Activity({Icon, description, icon, isVisible = false, delay = 0}: ActivityProps) {
    const isSSR = typeof window === "undefined"

    return (
        <Fragment>
            {!isSSR && (
                <Suspense fallback={<p>Loading...</p>}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: isVisible ? 1 : 0,
                            scale: isVisible ? 1 : 0,
                        }}
                        transition={{
                            duration: TIMELINE.dot.duration,
                            delay: delay,
                            ease: TIMELINE.dot.ease,
                        }}
                    >
                        <ActivityIconWrapper data-icon-name={icon?.name}>
                            <Icon />
                        </ActivityIconWrapper>
                    </motion.div>
                    <span dangerouslySetInnerHTML={{ __html: description}} />
                </Suspense>
            )}
        </Fragment>
    );
}
