import { useState, useEffect, useRef } from 'react';

interface ScrollDirection {
  isScrollingDown: boolean;
  isVisible: boolean;
}

export function useScrollDirection(threshold: number = 5): ScrollDirection {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      // Always show navbar at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollYRef.current = currentScrollY;
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
        lastScrollYRef.current = currentScrollY;
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return { isScrollingDown, isVisible };
}
