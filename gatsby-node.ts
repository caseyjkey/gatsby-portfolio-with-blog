const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)
const fs = require('fs')

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

        const parent = getNode(node.parent)
        const absolutePath = parent && parent.absolutePath
        if (absolutePath && typeof absolutePath === 'string') {
            try {
                const raw = fs.readFileSync(absolutePath, 'utf8')
                const preview = extractPreview(raw, 250)
                createNodeField({
                    name: 'preview',
                    node,
                    value: preview,
                })
            } catch (e) {
                // ignore preview extraction failures
            }
        }
    }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type MdxFields {
      preview: String
    }

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

function extractPreview(rawMdx, maxLen) {
    if (!rawMdx) return ''

    const withoutFrontmatter = rawMdx.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
    const withoutCodeBlocks = withoutFrontmatter.replace(/```[\s\S]*?```/g, '')
    const withoutJsx = withoutCodeBlocks.replace(/<[^>]+>/g, ' ')

    const paragraphs = withoutJsx
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)

    const firstMeaningful =
        paragraphs.find((p) => !/^#{1,6}\s/.test(p) && !/^[-*_]{3,}$/.test(p)) ||
        ''

    const text = firstMeaningful
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()

    if (text.length <= maxLen) return text
    const clipped = text.slice(0, maxLen)
    return clipped.replace(/\s+\S*$/, '').trim() + '…'
}