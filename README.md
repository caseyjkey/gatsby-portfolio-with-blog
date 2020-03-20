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

### Previewing your Website
From this directory run `npm install`, then run `gatsby develop`.


