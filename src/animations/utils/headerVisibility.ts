/**
 * Check if section header or subheader is visible in viewport
 * Used by first content elements to determine if they should wait for header animation
 *
 * @param sectionId - ID of the section (e.g., "about-section", "Experience")
 * @returns true if header OR subheader is visible in viewport
 */
export function isSectionHeaderVisible(sectionId: string): boolean {
  // Look for section by ID
  const section = document.getElementById(sectionId);
  if (!section) return false;

  // Find header and subheader within section
  const header = section.querySelector('h1, h2, [class*="Heading"]');
  const subheader = section.querySelector('p:first-of-type'); // Usually first <p> after header

  // Check if either is in viewport
  const checkInViewport = (el: Element | null): boolean => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  return checkInViewport(header) || checkInViewport(subheader);
}
