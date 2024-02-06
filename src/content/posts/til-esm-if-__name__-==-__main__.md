---
title: 'TIL: ESM equivalent of if __name__ == "__main__"'
pubDate: 2024-02-06T05:01:15.485Z
description: ""
author: "Fisher Sun"
tags: [til, javascript, node]
---
While developing this website, I wanted to write a little script to automate creating blog post files and generating frontmatter blocks.
This would not be that useful, but I thought it would be good to get some practice using JavaScript for scripting--
to learn how to do all the stuff I usually do with Python.

Translating how I normally code in Python, my code ran from the `main` function, which returned the program's exit code.
I called it at the bottom of the module.
```js
/**
 * @param {string[]} args command-line arguments passed to the script
 * @returns {number} the exit code
 */
function main(args) {
    // function body omitted for brevity
}

process.exitCode = main(process.argv.slice(2));
```

But, what about the trusty `if __name__ == "__main__"` that's so common in Python? (Of course, it's not very useful in this context. But, I think it's a good habit to have, so I wanted to learn what the JavaScript version was.)

The first thing my search brought me to was [a Stack Overflow answer](https://stackoverflow.com/a/6090287/14106506) that recommended the following:
```js
if (require.main === module) {
    process.exitCode = main(process.argv.slice(2));
}
```

This looked clean, but running it with node gives me an error:
```
ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and '/home/fisher/repos/blog-astro/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
```

Since this approach uses a CJS `require`, it's not compatible with ESM, which my project uses by default.

Renaming the file to use a `.cjs` extension and changing my `import`s to `require`s worked, but didn't seem ideal.
I wondered, what was the ESM way?

With some more searching, I found a book, Shell Scripting with Node.js, that got me this:
```js
import * as url from 'node:url';

if (import.meta.url.startsWith('file:')) {
    const modulePath = url.fileURLToPath(import.meta.url);
    if (process.argv[1] === modulePath) {
        process.exitCode = main(process.argv.slice(2));
    }
}
```

I couldn't believe how complex this was.

And, since there's an import, which would bother me at the bottom of the file,
I couldn't simply create a snippet to paste it.
So if I started using this in scripts, it would quickly get annoying.

I'm fairly new to Node, so I'm wondering what I'm missing.
The pattern of `if __name__ == "__main__"` is commonly seen in Python, so why is there no simple way of doing it with ESM?
Is ESM not as commonly adopted with Node as I thought? Or do people use ESM, but just switch to CJS for this kind of thing?
Or maybe this Python pattern isn't commonly used in Node?
Please let me know your thoughts!
