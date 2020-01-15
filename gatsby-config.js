
module.exports = {
  siteMetadata: {
    title: 'Casey Key',
    description: 'Casey Key is a software engineer with a focus on education, finance, and entertainment.',
    author: 'Casey Key',
  },
  plugins: [
    //plugins go here
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data`,
      },
    }
  ],
}