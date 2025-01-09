import React, { Fragment, Suspense } from 'react'

export default function Activity({Icon, description}) {
    const isSSR = typeof window === "undefined"
    
    return (
        <Fragment>
            {!isSSR && (
                <Suspense fallback={<p>Loading...</p>}>
                    <Icon />
                    <span dangerouslySetInnerHTML={{ __html: description}} />
                </Suspense>
            )}
        </Fragment>
    );
}
