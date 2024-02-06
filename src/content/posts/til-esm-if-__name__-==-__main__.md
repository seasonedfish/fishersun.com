---
title: 'TIL: ESM equivalent of if __name__ == "__main__"'
pubDate: 2024-01-29T00:57:55.663Z
description: ""
author: "Fisher Sun"
tags: [til, javascript, node]
---
I had imagined that the first post I would write for this website would be introducing the technology behind it,
but while I was working on it, I came across something that suprised me so much that I had to write a post on it,
inspired by Simon Willison’s TILs.

My static site generator allows me to write blog posts in Markdown;
it converts it to HTML that browsers can display.

In each post's file is a YAML block that contains the post's metadata, called the *frontmatter*.
For example, here's the frontmatter of the post you're reading right now:
```yaml
---
title: 'TIL: ESM equivalent of if __name__ == "__main__"'
pubDate: 2024-01-29T00:57:55.663Z
description: ""
author: "Fisher Sun"
tags: []
---
```

This would be a bother to type each time I create a post.
So, in classic software engineering fashion, I decided to write a program to do it for me.
I thought it would be good to get some more practice with JavaScript anyway.

---

Things were going well.
Translating how I normally code in Python, I had a `main` function for all my code, which returned the program's exit code.
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

The first thing my search brought me to was [a Stack Overflow answer](https://stackoverflow.com/a/6090287/14106506) that recommended the following:
```js
function myMain() {
    // main code
}

if (require.main === module) {
    myMain();
}
```

This looked clean, but running it with node gives me an error:
```
ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and '/home/fisher/repos/blog-astro/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
```

Since this approach uses a CJS `require`, it's not compatible with ESM, which my project uses by default.

Renaming the file to use a `.cjs` extension and changing my `import`s to `require`s worked, but didn't seem ideal.
I wondered, what is the ESM way?

With some more searching, I found a book, Shell Scripting with Node.js, that provided the following:
```js
import * as url from 'node:url';

if (import.meta.url.startsWith('file:')) { // (A)
    const modulePath = url.fileURLToPath(import.meta.url);
    if (process.argv[1] === modulePath) { // (B)
        process.exitCode = main(process.argv.slice(2));
    }
}
```

There's no way.

If it had been just a single block of code, I could create some kind of snippet to quickly paste it.
But, there's also an import, which should be moved to the top of the file.
So if I start using this in scripts, it would quickly get annoying.

I'm fairly new to Node, so I'm wondering what I'm missing.
The pattern of `if __name__ == "__main__"` is commonly seen in Python, so why is there no simple way of doing it with ESM?
Is ESM not as commonly adopted with Node as I thought? Or do people use ESM, but just switch to CJS for this kind of thing?
Or maybe this Python pattern isn't commonly used in Node?
