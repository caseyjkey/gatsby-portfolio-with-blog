import React, { Fragment, Suspense } from 'react'
import { ActivityIconWrapper } from './style'

export default function Activity({Icon, description}) {
    const isSSR = typeof window === "undefined"
    
    return (
        <Fragment>
            {!isSSR && (
                <Suspense fallback={<p>Loading...</p>}>
                    <ActivityIconWrapper>
                        <Icon />
                    </ActivityIconWrapper>
                    <span dangerouslySetInnerHTML={{ __html: description}} />
                </Suspense>
            )}
        </Fragment>
    );
}
