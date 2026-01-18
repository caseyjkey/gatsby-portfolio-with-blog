import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'
import styled from 'styled-components'
import { copyToClipboard } from '../utils/copy-to-clipboard';
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
} from 'react-live'

export const Pre = styled.pre`
    position: relative;
    text-align: left;
    margin: 1em 0;
    padding: 0.5em;
    overflow-x: auto;
    border-radius: 3px;
    -webkit-overflow-scrolling: touch;
    font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;

    @media (max-width: 767.98px) {
        max-width: calc(100vw - 40px);
    }

    & .token-line {
        line-height: 1.5em;
        min-height: 1.5em;
    }
`;

export const LineNo = styled.span`
    display: inline-block;
    width: 2em;
    user-select: none;
    opacity: 0.6; /* Increased from 0.3 for better visibility */
    margin-right: 1em;
`;

const CopyCode = styled.button`
    position: absolute;
    right: 0.25em;
    border: 0;
    border-radius: 3px;
    margin: 0.25em;
    opacity: 0.3;
    &:hover {
        opacity: 1;
    }
`;

const Code = ({ codeString, language, ...props }) => {
        if (language === 'react-live') {
        return (
            <LiveProvider code={codeString} noInline={true} theme={themes.nightOwl}>
                <LiveEditor />
                <LiveError />
                <LivePreview />
            </LiveProvider>
        )
    }
    
    const handleClick = () => {
        copyToClipboard(codeString);
    };

    return (
        <Highlight
            code={codeString}
            language={language}
            theme={themes.nightOwl}
        >
        {({
            className,
            style,
            tokens,
            getLineProps,
            getTokenProps,
        }) => (
            <Pre className={className} style={style}>
                <CopyCode onClick={handleClick}>Copy</CopyCode>
                {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                        <LineNo>{i + 1}</LineNo>
                        {line.map((token, key) => (
                            <span {...getTokenProps({ token, key })} />
                        ))}
                    </div>
                ))}
            </Pre>
        )}
        </Highlight>
    )
}

export default Code;
