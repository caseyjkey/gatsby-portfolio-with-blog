/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// Polyfill window for reactstrap SSR compatibility - must be before any imports
if (typeof window === 'undefined') {
  (global as any).window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    innerWidth: 1024,
    innerHeight: 768,
    scrollY: 0,
    scrollTo: () => {},
  }
}

// You can delete this file if you're not using it
import { wrapRootElement as wrap } from './root-wrapper'

export const wrapRootElement = wrap;
