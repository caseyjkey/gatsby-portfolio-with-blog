import React from 'react'
import { GlobalStyles } from './style.ts'
import './Layout/style.scss'

const Layout = ({ children }) => (
  <div>
    <GlobalStyles />
    {children}
  </div>
);

export default Layout;