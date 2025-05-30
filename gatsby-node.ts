const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions
    const blogPostTemplate = path.resolve(
        'src/templates/blogPostTemplate.tsx'
    )


    return graphql(`
        {
            allMdx (
                sort: { fields: [frontmatter___date], order: DESC }
                filter: { frontmatter: { published: { eq: true } } }
            ) {
                nodes {
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        date(formatString: "MMMM D, YYYY")
                    }
                    body
                    internal {
                        contentFilePath
                    }
                }
            }
        }
    `).then(result => {
        if (result.errors) {
            throw result.errors
        }

        const posts = result.data.allMdx.nodes

        // create page for each Mdx file
        posts.forEach((post, index) => {
            const previous =
                index === posts.length - 1 ? null : posts[index + 1];
            const next = index === 0 ? null : posts[index - 1];

            createPage({
                path: post.fields.slug,
                component: `${blogPostTemplate}?__contentFilePath=${post.internal.contentFilePath}`,
                context: {
                    slug: post.fields.slug,
                    previous,
                    next,
                    post,
                },
            })
        })
    })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;
    if (node.internal.type === `Mdx`) {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value,
        })
    }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type Project implements Node {
      start: Date @dateformat
      end: EndDate
    }

    type EndDate {
      date: Date @dateformat
      present: Boolean
    }
  `);
};