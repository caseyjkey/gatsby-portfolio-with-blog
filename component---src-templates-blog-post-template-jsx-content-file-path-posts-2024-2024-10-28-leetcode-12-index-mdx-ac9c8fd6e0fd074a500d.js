"use strict";(self.webpackChunkportfolio_app=self.webpackChunkportfolio_app||[]).push([[1477],{5057:function(e,t,n){n.r(t),n.d(t,{BlogPost:function(){return s},default:function(){return p}});var i=n(8453),o=n(6540);function r(e){const t=Object.assign({p:"p",h1:"h1",pre:"pre",code:"code",h2:"h2"},(0,i.R)(),e.components);return o.createElement(o.Fragment,null,o.createElement(t.p,null,"I started feeling down about my past interview performance. Rather than continue ruminating, I decided to continue my\nLeetCode grind tonight. My goal is to complete the Top 150 Interview Questions before the end of the year."),"\n",o.createElement(t.h1,null,"Solution"),"\n",o.createElement(t.pre,null,o.createElement(t.code,{className:"language-python"},'class Solution:\n    def intToRoman(self, num: int) -> str:\n        digitCount = int((math.log10(num) + 1) // 1)\n        def getLeftmostDigit():\n            return num // (10 ** (digitCount - 1)) % 10\n        romanForm = ""\n        if digitCount == 4:\n            digit = getLeftmostDigit()\n            for i in range(digit): romanForm += "M" \n            digitCount -= 1\n        if digitCount == 3:\n            digit = getLeftmostDigit()\n            if digit in [4, 9]:\n                romanForm += "CD" if digit == 4 else "CM"\n                digit -= digit\n            elif digit >= 5:\n                romanForm += "D"\n                digit -= 5\n            for i in range(digit): romanForm += "C" \n            digitCount -= 1\n        if digitCount == 2:\n            digit = getLeftmostDigit()\n            if digit in [4, 9]:\n                romanForm += "XL" if digit == 4 else "XC"\n                digit -= digit\n            elif digit >= 5:\n                romanForm += "L"\n                digit -= 5\n            for i in range(digit): romanForm += "X"\n            digitCount -= 1\n        if digitCount == 1:\n            digit = getLeftmostDigit()\n            if digit in [4, 9]:\n                romanForm += "IV" if digit == 4 else "IX"\n                digit -= digit\n            elif digit >= 5:\n                romanForm += "V"\n                digit -= 5\n            for i in range(digit): romanForm += "I" \n\n        return romanForm\n')),"\n",o.createElement(t.p,null,"O(n) = 1"),"\n",o.createElement(t.h2,null,"Reflection"),"\n",o.createElement(t.p,null,"Next time, I would like to reduce the code complexity by abstracting the strings into a dictionary.\nWith the dictionary, I could loop for ",o.createElement(t.code,null,"digitCount")," iterations and select the appropriate value from the dictionary.\nThis would remove the repeated code, thereby making it easier to read and maintain."))}var a=function(e){void 0===e&&(e={});const{wrapper:t}=Object.assign({},(0,i.R)(),e.components);return t?o.createElement(t,e,o.createElement(r,e)):r(e)},l=n(4810),m=n(4733),d=n(40),g=(n(5147),n(1686)),c=n(9389),u=n(9654);const s=g.default.div.withConfig({displayName:"blogPostTemplate__BlogPost",componentId:"sc-1p2ssye-0"})(["margin:0 auto;margin-top:6em;max-width:800px;padding:20px;"]);function f(e){let{data:t,pageContext:n,children:i}=e;const{frontmatter:r}=t.mdx,{previous:a,next:f,post:p}=n;return o.createElement(m.A,null,o.createElement(g.ThemeProvider,{theme:d.w4},o.createElement(d.nB,null,o.createElement(c.A),o.createElement(s,null,o.createElement(d.DZ,{className:"text-center"},r.title),o.createElement("p",{className:"text-center"},p.frontmatter.date),i,a&&o.createElement(o.Fragment,null,a&&o.createElement(l.N_,{to:a.fields.slug},o.createElement("p",null,a.frontmatter.title))),f&&o.createElement(o.Fragment,null,f&&o.createElement(l.N_,{to:f.fields.slug},o.createElement("p",null,f.frontmatter.title)))),o.createElement(u.A))))}function p(e){return o.createElement(f,e,o.createElement(a,e))}},5147:function(e,t,n){n(6540)}}]);
//# sourceMappingURL=component---src-templates-blog-post-template-jsx-content-file-path-posts-2024-2024-10-28-leetcode-12-index-mdx-ac9c8fd6e0fd074a500d.js.map