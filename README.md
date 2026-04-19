## Getting Started

To make this website your own, follow these steps:

### Changing your Website's Metadata
Site-level metadata and navigation defaults live in `src/config/site.ts`.
Update `title`, `description`, social links, and canonical URL there.

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
From this directory run `bun install`, then run `bun run dev`.

### Building
You can build via `bun run build`.

### Deploying
Run `bun run deploy`. If you encounter `"length" is outside of buffer bounds`
then you will have to switch from Node v. 23.x to 22.9.0.
