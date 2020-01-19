
module.exports = {
  siteMetadata: {
    title: 'Casey Key',
    description: 'Casey Key is a software engineer with a focus on education, finance, and entertainment.',
    author: 'Casey Key',
  },
  plugins: [
    //plugins go here
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images/projects`,
        name: 'projectImages'
      },
    }, 
    `gatsby-transformer-json`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-netlify-cms`
  ],
}