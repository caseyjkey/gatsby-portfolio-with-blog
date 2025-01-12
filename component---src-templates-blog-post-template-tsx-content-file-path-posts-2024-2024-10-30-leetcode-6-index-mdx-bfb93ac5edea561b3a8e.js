"use strict";(self.webpackChunkportfolio_app=self.webpackChunkportfolio_app||[]).push([[3015],{4919:function(e,n,t){t.r(n),t.d(n,{BlogPost:function(){return p},default:function(){return g}});var r=t(8453),l=t(6540);function o(e){const n=Object.assign({p:"p",h1:"h1",pre:"pre",code:"code",h2:"h2"},(0,r.R)(),e.components);return l.createElement(l.Fragment,null,l.createElement(n.p,null,"This one took me about 15 minutes to come up with a solution. I then worked through it with this naive solution."),"\n",l.createElement(n.h1,null,"Solution"),"\n",l.createElement(n.pre,null,l.createElement(n.code,{className:"language-python"},"class Solution:\n    def convert(self, s: str, numRows: int) -> str:\n        grid = [['' for column in range(len(s))] for row in range(numRows)]\n        x, y = 0, 0\n        direction = 1\n        for char in s:\n            grid[y][x] = char\n            if y == numRows - 1:\n                direction = -1\n                x += 1\n            elif direction == -1 and y > 0:\n                x += 1\n            elif direction == -1 and y == 0:\n                direction = 1\n            y += direction if numRows > 1 else 0\n        result = \"\"\n        for row in grid:\n            for char in row:\n                if char:\n                    result += char\n        return result\n")),"\n",l.createElement(n.p,null,"O(n) = n*m or n^2"),"\n",l.createElement(n.h2,null,"Reflection"),"\n",l.createElement(n.p,null,"Looking back, I realized I didn't need to include the empty spaces as if it were illustrated. This allows me to simplify my code by using the append() method for lists. Here is my improved version:"),"\n",l.createElement(n.pre,null,l.createElement(n.code,{className:"language-python"},"class Solution:\n    def convert(self, s: str, numRows: int) -> str:\n        if numRows == 1 or numRows >= len(s):\n            return s\n\n        grid = [[] for _ in range(numRows)]\n        y = 0 \n        direction = 1\n        for char in s:\n            grid[y].append(char)\n            if y == numRows - 1:\n                direction = -1\n            elif y == 0:\n                direction = 1\n            y += direction\n        \n        for i in range(len(grid)):\n            grid[i] = ''.join(grid[i])\n        result = ''.join(grid)\n        return result\n")))}var i=function(e){void 0===e&&(e={});const{wrapper:n}=Object.assign({},(0,r.R)(),e.components);return n?l.createElement(n,e,l.createElement(o,e)):o(e)},a=t(4810),c=t(4399),s=t(3614),m=t(1510),u=t(6409),d=t(572);const p=m.default.div.withConfig({displayName:"blogPostTemplate__BlogPost",componentId:"sc-6bdelx-0"})(["margin:0 auto;margin-top:6em;max-width:800px;padding:20px;"]);function f(e){let{data:n,pageContext:t,children:r}=e;const{frontmatter:o}=n.mdx,{previous:i,next:f,post:g}=t;return l.createElement(c.A,null,l.createElement(m.ThemeProvider,{theme:s.w4},l.createElement(s.nB,null,l.createElement(u.A,null),l.createElement(p,null,l.createElement(s.DZ,{className:"text-center"},o.title),l.createElement("p",{className:"text-center"},g.frontmatter.date),r,i&&l.createElement(l.Fragment,null,i&&l.createElement(a.N_,{to:i.fields.slug},l.createElement("p",null,i.frontmatter.title))),f&&l.createElement(l.Fragment,null,f&&l.createElement(a.N_,{to:f.fields.slug},l.createElement("p",null,f.frontmatter.title)))),l.createElement(d.A,null))))}function g(e){return l.createElement(f,e,l.createElement(i,e))}}}]);
//# sourceMappingURL=component---src-templates-blog-post-template-tsx-content-file-path-posts-2024-2024-10-30-leetcode-6-index-mdx-bfb93ac5edea561b3a8e.js.map