/**
 * Creates a new blog post
 */

import fs from "node:fs"

function main(args) {
    const POSTS_DIRECTORY = "./src/content/posts"
    if (!fs.existsSync(POSTS_DIRECTORY)) {
        console.log("Could not find posts directory. Must run script in project root");
        return;
    }

    const title = args[0]
    if (!title) {
        console.log("Must pass name of post as cli argument");
        return;
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const contents = `---
title: "${title}"
pubDate: ${(new Date()).toISOString()}
description: ""
author: "Fisher Sun"
tags: []
---
`
    fs.writeFileSync(`${POSTS_DIRECTORY}/${slug}.md`, contents);
}

main(process.argv.slice(2));
