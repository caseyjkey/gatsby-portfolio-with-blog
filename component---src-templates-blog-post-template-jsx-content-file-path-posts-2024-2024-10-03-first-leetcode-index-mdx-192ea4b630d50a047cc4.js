"use strict";(self.webpackChunkportfolio_app=self.webpackChunkportfolio_app||[]).push([[673],{3417:function(e,n,t){t.r(n),t.d(n,{BlogPost:function(){return p},default:function(){return g}});var l=t(8453),r=t(6540);function a(e){const n=Object.assign({h1:"h1",p:"p",h2:"h2",strong:"strong",ul:"ul",li:"li",pre:"pre",code:"code"},(0,l.R)(),e.components);return r.createElement(r.Fragment,null,r.createElement(n.h1,null,"My First LeetCode Blog Post"),"\n",r.createElement(n.p,null,"I have already been working on LeetCode's top interview problems. I started a couple months ago\r\nin preparation for my interviews with Google. Although that has passed, more opportunities are becoming available.\r\nSo, we are back on the grind."),"\n",r.createElement(n.h2,null,"The Problem"),"\n",r.createElement(n.p,null,"Today we are working on ",r.createElement(n.strong,null,"35. Search Insert Position"),". The problem is as follows:\r\nGiven a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order."),"\n",r.createElement(n.p,null,"You must write an algorithm with O(log n) runtime complexity."),"\n",r.createElement(n.p,null,"Example 1:"),"\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"Input: nums = [1,3,5,6], target = 5"),"\n",r.createElement(n.li,null,"Output: 2"),"\n"),"\n",r.createElement(n.p,null,"Example 2:"),"\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"Input: nums = [1,3,5,6], target = 2"),"\n",r.createElement(n.li,null,"Output: 1"),"\n"),"\n",r.createElement(n.p,null,"Example 3:"),"\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"Input: nums = [1,3,5,6], target = 7"),"\n",r.createElement(n.li,null,"Output: 4"),"\n"),"\n",r.createElement(n.h2,null,"The Solution"),"\n",r.createElement(n.p,null,"I like to format my answers using the UMPIRE method:"),"\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"Understand","\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"We are given a sorted array, and we are searching for an expected value."),"\n"),"\n"),"\n",r.createElement(n.li,null,"Match","\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"We can match this problem to a binary search problem, given the O(log N) complexity."),"\n"),"\n"),"\n",r.createElement(n.li,null,"Plan","\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"We will want a function that takes in an array and returns an integer."),"\n"),"\n"),"\n",r.createElement(n.li,null,"Implement"),"\n"),"\n",r.createElement(n.pre,null,r.createElement(n.code,{className:"language-python"},"    def searchInsert(self, nums: List[int], target: int) -> int:\r\n        left = 0\r\n        right = len(nums) - 1\r\n        while left <= right:\r\n            mid = left + (right - left) // 2\r\n            if nums[mid] == target:\r\n                return mid\r\n            elif nums[mid] < target:\r\n                left = mid + 1\r\n            else:\r\n                right = mid - 1\r\n        \r\n        return mid\n")),"\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"Review","\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"The code is clean and concise. We used descriptive variable names. We have implemented a binary search."),"\n",r.createElement(n.li,null,"We can test our code using the examples provided."),"\n",r.createElement(n.li,null,"nums = [1,3,5,6], target = 5","\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"left = 0, right = 3, mid = 1"),"\n",r.createElement(n.li,null,"nums[1] = 3 < 5, left = 2"),"\n",r.createElement(n.li,null,"nums[2] = 5 == 5, return 2"),"\n"),"\n"),"\n",r.createElement(n.li,null,"Now let's test an edge case where the element is not in the array."),"\n",r.createElement(n.li,null,"nums = [1,3,5,6], target = 2","\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"left = 0, right = 3, mid = 1"),"\n",r.createElement(n.li,null,"nums[1] = 3 > 2, right = 0"),"\n",r.createElement(n.li,null,"nums[0] = 1 < 2, left = 1"),"\n",r.createElement(n.li,null,"return 0"),"\n"),"\n"),"\n",r.createElement(n.li,null,"We see we are not getting the expected output. We need to rework to support this edge case."),"\n"),"\n"),"\n",r.createElement(n.li,null,"Evaluate","\n",r.createElement(n.ul,null,"\n",r.createElement(n.li,null,"We are getting the expected runtime complexity. We are not getting expected result for missing elements."),"\n",r.createElement(n.li,null,"Refactor"),"\n",r.createElement(n.li,null,"We need to return the ",r.createElement(n.code,null,"left")," pointer, not the ",r.createElement(n.code,null,"mid")," pointer."),"\n"),"\n"),"\n"))}var i=function(e){void 0===e&&(e={});const{wrapper:n}=Object.assign({},(0,l.R)(),e.components);return n?r.createElement(n,e,r.createElement(a,e)):a(e)},u=t(4810),m=t(4733),c=t(40),o=(t(5147),t(1686)),s=t(9389),E=t(9654);const p=o.default.div.withConfig({displayName:"blogPostTemplate__BlogPost",componentId:"sc-1p2ssye-0"})(["margin:0 auto;margin-top:6em;max-width:800px;padding:20px;"]);function d(e){let{data:n,pageContext:t,children:l}=e;const{frontmatter:a}=n.mdx,{previous:i,next:d,post:g}=t;return r.createElement(m.A,null,r.createElement(o.ThemeProvider,{theme:c.w4},r.createElement(c.nB,null,r.createElement(s.A),r.createElement(p,null,r.createElement(c.DZ,{className:"text-center"},a.title),r.createElement("p",{className:"text-center"},g.frontmatter.date),l,i&&r.createElement(r.Fragment,null,i&&r.createElement(u.N_,{to:i.fields.slug},r.createElement("p",null,i.frontmatter.title))),d&&r.createElement(r.Fragment,null,d&&r.createElement(u.N_,{to:d.fields.slug},r.createElement("p",null,d.frontmatter.title)))),r.createElement(E.A))))}function g(e){return r.createElement(d,e,r.createElement(i,e))}},5147:function(e,n,t){t(6540)}}]);
//# sourceMappingURL=component---src-templates-blog-post-template-jsx-content-file-path-posts-2024-2024-10-03-first-leetcode-index-mdx-192ea4b630d50a047cc4.js.map