/**
 * Creates a new blog post
 */

import fs from "node:fs";
import * as url from "node:url";

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

    const directoryName = `${POSTS_DIRECTORY}/${slug}`;
    fs.mkdirSync(directoryName);

    const contents = `---
title: "${title}"
pubDate: ${(new Date()).toISOString()}
description: ""
author: "Fisher Sun"
tags: []
---
`;
    fs.writeFileSync(`${directoryName}/index.md`, contents);
    return 0;
}

if (import.meta.url.startsWith("file:")) { // (A)
    const modulePath = url.fileURLToPath(import.meta.url);
    if (process.argv[1] === modulePath) { // (B)
        process.exitCode = main(process.argv.slice(2));
    }
}
