"use strict";(self.webpackChunkportfolio_app=self.webpackChunkportfolio_app||[]).push([[4364],{801:function(e,n,t){t.r(n),t.d(n,{BlogPost:function(){return f},default:function(){return g}});var r=t(8453),l=t(6540);function a(e){const n=Object.assign({p:"p",code:"code",pre:"pre"},(0,r.R)(),e.components);return l.createElement(l.Fragment,null,l.createElement(n.p,null,"I completed the LeetCode 150! Since then, I haven't stopped practicing.\r\nI want to master common algorithms and feel confident for future interviews."),"\n",l.createElement(n.p,null,"For this problem, I started with this greedy solution. We always flip a zero if\r\nwe haven't done so ",l.createElement(n.code,null,"k")," times. Each step, we check if our count is a new maximum.\r\nIf we reach a zero and used all our flips, we reset our count and flips.\r\nWe start counting again from this position."),"\n",l.createElement(n.pre,null,l.createElement(n.code,{className:"language-python"},"class Solution:\r\n    def longestOnes(self, nums: List[int], k: int) -> int:\r\n        largest = float('-inf')\r\n        count = 0\r\n        flipped = 0\r\n        for num in nums:\r\n            if num == 1:\r\n                count += 1\r\n            if num == 0 and flipped < k:\r\n                count += 1\r\n                flipped += 1\r\n            elif num == 0 and flipped == k:\r\n                largest = max(largest, count)\r\n                count, flipped = 1, 1\r\n        \r\n        return largest\n")),"\n",l.createElement(n.p,null,'This works for the first example:\r\n"""\r\nInput: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2\r\nOutput: 6 (correct!)\r\n"""\r\nHowever, for the second example, it  fails to connect the first\r\ntwo strings of ones.\r\n"""\r\nInput: nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3\r\nOutput: 9 (incorrect, expected 10.)\r\n"""\r\nTo fix this, we will have to alter our algorithm to\r\nconditionally flip a zero. My idea is to apply our previous algorithm at each step.'),"\n",l.createElement(n.pre,null,l.createElement(n.code,{className:"language-python"},"class Solution:\r\n    def longestOnes(self, nums: List[int], k: int) -> int:\r\n        largest = float('-inf')\r\n\r\n        def countOnes(start):\r\n            count = 0\r\n            flipped = 0\r\n            for i in range(start, len(nums)):\r\n                num = nums[i]\r\n                if num == 1:\r\n                    count += 1\r\n                if num == 0 and flipped < k:\r\n                    choice = i \r\n                    count += 1\r\n                    flipped += 1\r\n                elif num == 0 and flipped == k:\r\n                    return count\r\n            return count\r\n        \r\n        for i in range(len(nums)):\r\n            largest = max(largest, countOnes(i))\r\n        \r\n        return largest\n")),"\n",l.createElement(n.p,null,"Unfortunately, this is inefficient, but it works. It has a quadratic time complexity of\r\nO(n) = (N^2 + n) / 2, also known as the nth triangle number."),"\n",l.createElement(n.p,null,"Rather we should make this algorithm into a sliding-window algorithm.\r\nWhen we reach the end of a series of ones, we want to slide our window by moving our start to the\r\nsecond flip we made by removing our first flip along with any tail attached to it.\r\nTo do this, we create a queue and add our tail each time we flip and set the new tail to 0."),"\n",l.createElement(n.pre,null,l.createElement(n.code,{className:"language-python"},"from collections import deque\r\nclass Solution:\r\n    def longestOnes(self, nums: List[int], k: int) -> int:\r\n        largest = float('-inf')\r\n        count, tail = 0, 0\r\n        tails = deque([])\r\n        for i, num in enumerate(nums):\r\n            count += 1\r\n            tail += 1\r\n            if num == 0:\r\n                if tails and len(tails) == k:\r\n                    count -= tails.popleft()\r\n                elif not k:\r\n                    count = 0\r\n                tails.append(tail)\r\n                tail = 0\r\n            largest = max(largest, count)\r\n        return largest\n")),"\n",l.createElement(n.p,null,"This has a time complexity of O(n) = n at the tradeoff of space complexity being\r\nO(n) = n compared to O(n) = 1 for previous solutions."))}var o=function(e){void 0===e&&(e={});const{wrapper:n}=Object.assign({},(0,r.R)(),e.components);return n?l.createElement(n,e,l.createElement(a,e)):a(e)},i=t(4810),s=t(4399),u=t(3614),c=t(1510),m=t(6409),p=t(572);const f=c.default.div.withConfig({displayName:"blogPostTemplate__BlogPost",componentId:"sc-6bdelx-0"})(["margin:0 auto;margin-top:6em;max-width:800px;padding:20px;"]);function d(e){let{data:n,pageContext:t,children:r}=e;const{frontmatter:a}=n.mdx,{previous:o,next:d,post:g}=t;return l.createElement(s.A,null,l.createElement(c.ThemeProvider,{theme:u.w4},l.createElement(u.nB,null,l.createElement(m.A,null),l.createElement(f,null,l.createElement(u.DZ,{className:"text-center"},a.title),l.createElement("p",{className:"text-center"},g.frontmatter.date),r,o&&l.createElement(l.Fragment,null,o&&l.createElement(i.N_,{to:o.fields.slug},l.createElement("p",null,o.frontmatter.title))),d&&l.createElement(l.Fragment,null,d&&l.createElement(i.N_,{to:d.fields.slug},l.createElement("p",null,d.frontmatter.title)))),l.createElement(p.A,null))))}function g(e){return l.createElement(d,e,l.createElement(o,e))}}}]);
//# sourceMappingURL=component---src-templates-blog-post-template-tsx-content-file-path-posts-2025-2025-2-15-leetcode-1004-index-mdx-d4f4027cc9fa48457ced.js.map