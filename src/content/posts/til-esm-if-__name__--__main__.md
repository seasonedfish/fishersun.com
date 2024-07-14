---
title: 'TIL: ESM equivalent of if __name__ == "__main__"'
pubDate: 2024-02-06T05:01:15.485Z
description: "With ESM, how do you accomplish Python's if __name__ == \"__main__\"?"
author: "Fisher Sun"
tags: [til, web, javascript]
---
While developing this website, I wanted to write a little script to automate creating blog post files and generating frontmatter blocks.
I thought it could be a good way to get some practice using JavaScript for scripting--to learn how to do all the stuff I usually do with Python.

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

But, what about the trusty `if __name__ == "__main__"` that's so common in Python?
(Of course, it's not very useful in this context. But, I'm used to writing it in Python, so I wanted to learn what the JavaScript version was.)

The first thing my search brought me to was [a Stack Overflow answer](https://stackoverflow.com/a/6090287/14106506) that recommended the following:
```js
if (require.main === module) {
    process.exitCode = main(process.argv.slice(2));
}
```

This looked clean, but running it with node gave me an error:
```
ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and '/home/fisher/repos/blog-astro/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
```

Since this approach used a CJS `require`, it wasn't compatible with ESM, which my project used by default.

Renaming the file to use a `.cjs` extension and changing my `import`s to `require`s worked, but it didn't seem ideal.
I wondered, what was the ESM way?

With some more searching, I found a book, [Shell Scripting with Node.js](https://exploringjs.com/nodejs-shell-scripting/ch_nodejs-path.html#detecting-if-module-is-main), that got me this:
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

And, since there's an import (which would bother me at the bottom of the file),
it wouldn't be ideal to use a snippet to generate it.
So if I started using this in scripts, it would quickly get annoying.

I'm fairly new to Node, so I'm wondering what I'm missing.
The pattern of `if __name__ == "__main__"` is common in Python, so why is there no simple way of doing it with ESM?
Maybe ESM is not as commonly used with Node as I thought.
Or maybe people do use ESM, but switch to CJS for this kind of thing.
Or, maybe this Python pattern just isn't commonly used in Node.

Please let me know your thoughts!
