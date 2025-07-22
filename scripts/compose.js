/**
 * Creates a new blog post
 */

import fs from "node:fs";
import * as url from "node:url";

const AUTHOR_NAME = "Fisher Sun";

/**
 * @param {string[]} args command-line arguments passed to the script
 * @returns {number} the exit code
 */
function main(args) {
    const postsDirectory = "./src/content/posts";
    if (!fs.existsSync(postsDirectory)) {
        console.error("Could not find posts directory. Must run script in project root");
        return 1;
    }

    const title = args[0];
    if (!title) {
        console.error("Must pass name of post as cli argument");
        return 2;
    }

    const slug = title.toLowerCase().replace(/[^\w]+/g, '-');

    const directoryName = `${postsDirectory}/${slug}`;
    fs.mkdirSync(directoryName);

    const contents = `---
title: "${title}"
pubDate: ${(new Date()).toISOString()}
description: ""
author: "${AUTHOR_NAME}"
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
