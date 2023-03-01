module.exports = {
  siteMetadata: {
    title: 'Casey Key',
    description: 'Casey Key Software Engineer Portfolio. Casey Key is the California full stack programmer focusing on AI, security, and finance.',
    author: 'Casey Key',
    canonical: 'https://caseyjgkey.xyz',
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve:`gatsby-transformer-json`,
      options: {
        typeName: ({ node, object, isArray }) =>
          object.project ? `Project` : object.section,
      }
    },
    {
	    resolve: `gatsby-plugin-mdx`,
	    options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          }
        ],
	    },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/posts`,
        name: `posts`,
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sass`
  ],
}
