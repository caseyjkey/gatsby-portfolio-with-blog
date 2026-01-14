import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import Code from './src/components/Code'
import { theme } from './src/components/style'

const components = {
  h2: ({ children }) => (
    <h2 style={{ color: theme.primaryColor }}>{children}</h2>
  ),
  'p.inlineCode': props => (
    <code style={{ backgroundColor: 'lightgray' }} {...props} />
  ),
  pre: ({ children: { props, type } }) => {
    if (type === 'code') {
                return (
            <Code 
                codeString={props.children.trim()} 
                language={
                    props.className && props.className.replace('language-', '')
                }
                {...props}
            />    
        )
    }
  },
}

export const wrapRootElement = ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
)