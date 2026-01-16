import React, { Fragment, Suspense } from 'react'
import { ActivityIconWrapper } from './style'

export default function Activity({Icon, description, icon}) {
    const isSSR = typeof window === "undefined"

    return (
        <Fragment>
            {!isSSR && (
                <Suspense fallback={<p>Loading...</p>}>
                    <ActivityIconWrapper data-icon-name={icon?.name}>
                        <Icon />
                    </ActivityIconWrapper>
                    <span dangerouslySetInnerHTML={{ __html: description}} />
                </Suspense>
            )}
        </Fragment>
    );
}
