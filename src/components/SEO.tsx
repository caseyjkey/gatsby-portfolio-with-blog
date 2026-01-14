import React from "react"
import { useSiteMetadata } from "../hooks/use-site-metadata"

type SEOProps = {
  title: string
  description?: string
  pathname?: string
  children?: React.ReactNode
}

export const SEO: React.FC<SEOProps> = ({ title, description, pathname, children }) => {
  const { title: defaultTitle, description: defaultDescription, image, siteUrl, twitterUsername } = useSiteMetadata()

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image}`,
    url: `${siteUrl}${pathname || ``}`,
    twitterUsername,
  }

  return (
    <>
      <title>{seo.title}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-1QQK6QY29Z"></script>
      <script>
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-1QQK6QY29Z');
            `}
      </script>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:creator" content={seo.twitterUsername} />
      <meta property='og:title' content={seo.title} />
      <meta property='og:image' content={seo.image} />
      <meta property='og:description' content={seo.description} />
      <meta property='og:url' content={seo.url} />
      <link rel="icon" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      {children}
    </>
  )
}