import React from 'react'
import { GlobalStyles } from './style.js'
import './Layout/style.scss'

const Layout = ({ children }) => (
  <div>
    <GlobalStyles />
    {children}
  </div>
);

export default Layout;