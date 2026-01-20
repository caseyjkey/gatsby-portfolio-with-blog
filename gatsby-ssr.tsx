/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import { wrapRootElement as wrap } from './root-wrapper'

export const wrapRootElement = wrap;

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([])
}
