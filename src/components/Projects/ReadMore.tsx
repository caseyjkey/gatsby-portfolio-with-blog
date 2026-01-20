import React, { useState, useEffect } from 'react'

interface ReadMoreProps {
  children: string
  charLimit?: number
  readMoreText?: string
  readLessText?: string
  readMoreClassname?: string
  readLessClassname?: string
}

export default function ReadMore({
  children,
  charLimit = 200,
  readMoreText = "Read More ▼",
  readLessText = "Read Less ▲",
  readMoreClassname = "",
  readLessClassname = "",
}: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // During SSR, render full content to avoid hydration mismatch
  if (!isClient) {
    return <span dangerouslySetInnerHTML={{ __html: children }} />
  }

  const shouldTruncate = children.length > charLimit

  if (!shouldTruncate) {
    return <span dangerouslySetInnerHTML={{ __html: children }} />
  }

  return (
    <span>
      <span
        dangerouslySetInnerHTML={{
          __html: isExpanded ? children : children.slice(0, charLimit) + '...',
        }}
      />
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`read-more-toggle ${isExpanded ? readLessClassname : readMoreClassname}`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginLeft: '4px',
          textDecoration: 'underline',
        }}
      >
        {isExpanded ? readLessText : readMoreText}
      </button>
    </span>
  )
}
