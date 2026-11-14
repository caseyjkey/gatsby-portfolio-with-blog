import { useEffect, useState } from 'react';
import { isKonamiModeActive, KONAMI_MODE_EVENT } from '../lib/konamiMode';

export function useKonamiMode() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isKonamiModeActive());

    const handleChange = (event: Event) => {
      setActive((event as CustomEvent<boolean>).detail);
    };

    window.addEventListener(KONAMI_MODE_EVENT, handleChange);
    return () => window.removeEventListener(KONAMI_MODE_EVENT, handleChange);
  }, []);

  return active;
}
