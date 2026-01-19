module.exports = {
  siteMetadata: {
    title: 'Casey Key',
    description: 'Casey Key is a software engineer in California with a focus on education, finance, and security with expertise in cloud-native architecture and full-stack development.',
    author: 'Casey Key',
    canonical: 'https://keycasey.com',
    siteUrl: 'https://keycasey.com',
    image: '/homepage.png'
  },
  plugins: [
    `gatsby-plugin-styled-components`,
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
        mdxOptions: {
          remarkPlugins: [
            require('./src/utils/remark-split-sections'),
          ],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
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
