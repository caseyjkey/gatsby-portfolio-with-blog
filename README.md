## Getting Started

To make this website your own, follow these steps:

### Changing your Website's Metadata
In the root directory, you will find `gatsby-config.js`. 
Inside this file you will notice `siteMetadata`, a group of key-value pairs.
Change the values of `title`, `description`, and `author` to acurately represent your brand. 
Change `canonical`'s value to be your current website url. 

### Customizing the Content of your Website

#### The Introduction
The introduction is your landing page. 
Let's add your name, customize the content of the typewriter, and choose a greeting.
Navigate to and open `/src/data/introduction.json`.
Here we can see all the key-value pairs displayed in the introduction.
You are free to change the values as you would like!
Make sure all values are surrounded in double quotes.

#### About Section
Likewise, the About section has data from it's corresponding file.
This file is found at `/src/data/about.json`.
For your `bio`, make sure to remove all line-breaks, I recommend [this](http://removelinebreaks.net/) tool. Replace line-breaks with `<br />`.
`<br />` will render to a line break in the browser. 

### Previewing
From this directory run `yarn install --ignore-engines`, then run `yarn gatsby develop`.

### Building
You can build via `yarn gatsby build`. If you encounter a TypeComposer error, follow [this solution](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v4-to-v5/#multiple-versions-of-graphql) in docs, making sure to use `yarn install`. 

### Deploying
Run `yarn run deploy`. If you encounter `"length" is outside of buffer bounds`
then you will have to switch from Node v. 23.x to 22.9.0.