import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';

const PolaroidStack = lazy(() => import('./PolaroidStack'));

export default function DeferredPolaroidStack() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '0px' }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`polaroid-stack-loader${shouldLoad ? ' polaroid-stack-loader--loaded' : ''}`}
    >
      {shouldLoad && (
        <Suspense fallback={null}>
          <PolaroidStack />
        </Suspense>
      )}
    </div>
  );
}
