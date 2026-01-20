/**
 * Remark plugin to split MDX content at thematicBreak nodes (horizontal rules)
 * and wrap each section in an AnimatedSection component for individual animation.
 *
 * Note: Does NOT wrap in AnimatedSectionContainer - that's handled by page templates
 * to ensure AnimationContext is always available.
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
      // Explicitly create and add an <hr /> JSX element.
      newChildren.push({
        type: 'mdxJsxFlowElement',
        name: 'hr',
        attributes: [],
        children: [],
      });
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

    // Return sections directly - no AnimatedSectionContainer wrapper
    // Page templates are responsible for wrapping with the container
    tree.children = newChildren;

    return tree;
  };
};