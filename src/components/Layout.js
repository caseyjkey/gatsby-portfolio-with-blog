import React from 'react'
import './Layout/style.css'
import { GlobalStyles } from './style.js'

const Layout = ({ children }) => (
  <div>
    <GlobalStyles />
    {children}
  </div>
);

export default Layout;