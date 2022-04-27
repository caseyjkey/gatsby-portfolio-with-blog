module.exports = {
  siteMetadata: {
    title: 'Casey Key Software Engineer Portfolio',
    description: 'Casey Key Software Engineer Portfolio. Casey Key is a Wyoming software engineer with a focus on education, finance, and security with expertise in cloud-native architecture and full-stack development.',
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
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
        ]
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
    `gatsby-plugin-netlify-cms`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`
  ],
}
