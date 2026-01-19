/**
 * Remark plugin to split MDX content at thematicBreak nodes (horizontal rules)
 * and wrap each section in an AnimatedSection component for individual animation.
 */
module.exports = function remarkSplitSections() {
  return function transformer(tree) {
    const hrIndices = [];
    tree.children.forEach((node, index) => {
      if (node.type === 'thematicBreak') {
        hrIndices.push(index);
      }
    });

    if (hrIndices.length === 0) {
      // If no <hr />, wrap the entire content in a single AnimatedSection
      const children = tree.children;
      tree.children = [
        {
          type: 'mdxJsxFlowElement',
          name: 'AnimatedSection',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'index',
              value: 0,
            },
          ],
          children: children,
        },
      ];
      return tree;
    }

    const newChildren = [];
    let startIndex = 0;
    let sectionIndex = 0;

    hrIndices.forEach((hrIndex) => {
      if (startIndex < hrIndex) {
        const sectionChildren = tree.children.slice(startIndex, hrIndex);
        newChildren.push({
          type: 'mdxJsxFlowElement',
          name: 'AnimatedSection',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'index',
              value: sectionIndex,
            },
          ],
          children: sectionChildren,
        });
        sectionIndex++;
      }
      // Add the thematicBreak (<hr>) element back into the tree
      newChildren.push(tree.children[hrIndex]);
      startIndex = hrIndex + 1;
    });

    if (startIndex < tree.children.length) {
      const lastSectionChildren = tree.children.slice(startIndex);
      newChildren.push({
        type: 'mdxJsxFlowElement',
        name: 'AnimatedSection',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'index',
            value: sectionIndex,
          },
        ],
        children: lastSectionChildren,
      });
    }

    tree.children = [
      {
        type: 'mdxJsxFlowElement',
        name: 'AnimatedSectionContainer',
        attributes: [],
        children: newChildren,
      },
    ];

    return tree;
  };
};