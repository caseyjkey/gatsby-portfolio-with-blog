import { useState, useEffect } from 'react';

interface ScrollDirection {
  isScrollingDown: boolean;
  isVisible: boolean;
}

export function useScrollDirection(threshold: number = 5): ScrollDirection {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Check if scroll direction has changed beyond the threshold
      if (Math.abs(currentScrollY - lastScrollY) > threshold) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide navbar
          setIsScrollingDown(true);
          setIsVisible(false);
        } else {
          // Scrolling up - show navbar immediately
          setIsScrollingDown(false);
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, threshold]);

  return { isScrollingDown, isVisible };
}
