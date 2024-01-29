/**
 * Creates a new blog post
 */

import fs from "node:fs";

/**
 * @param {string[]} args command-line arguments passed to the script
 * @returns {number} the exit code
 */
function main(args) {
    const POSTS_DIRECTORY = "./src/content/posts";
    if (!fs.existsSync(POSTS_DIRECTORY)) {
        console.error("Could not find posts directory. Must run script in project root");
        return 1;
    }

    const title = args[0];
    if (!title) {
        console.error("Must pass name of post as cli argument");
        return 2;
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const contents = `---
title: "${title}"
pubDate: ${(new Date()).toISOString()}
description: ""
author: "Fisher Sun"
tags: []
---
`;
    fs.writeFileSync(`${POSTS_DIRECTORY}/${slug}.md`, contents);
    return 0;
}

process.exitCode = main(process.argv.slice(2));
