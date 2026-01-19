/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import { wrapRootElement as wrap } from './root-wrapper'
require('typeface-poppins');
import './src/components/global.css';

export const wrapRootElement = wrap;