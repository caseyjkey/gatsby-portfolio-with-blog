
module.exports = {
  siteMetadata: {
    title: 'Casey Key',
    description: 'Casey Key is a software engineer with a focus on education, finance, and security.',
    author: 'Casey Key',
    canonical: 'https://caseyjkey.com',
  },
  plugins: [
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
      resolve: `gatsby-plugin-netlify-cms-paths`,
      options: {
        cmsConfig: `/static/admin/config.yml`
      }
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      }
    },
    {
      resolve:`gatsby-transformer-json`,
      options: {
        typeName: ({ node, object, isArray }) =>
          object.project ? `Project` : object.section,
      }
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-netlify-cms`,
    `gatsby-plugin-react-helmet`
  ],
}
