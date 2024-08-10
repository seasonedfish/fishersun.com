---
title: "Using a built-in binding that's shadowed"
pubDate: 2024-08-10T02:12:48.075Z
description: ""
author: "Fisher Sun"
tags: ["javascript", "til"]
---

The other day, I was getting TypeScript errors when I tried to use a built-in Map in some legacy code.
It turns out, the module had imported the Immutable.js Map,
so trying to create a built-in Map with `new Map()` would create an Immutable.js Map instead.

How could I keep the existing usages of the Immutable.js Map and use the built-in Map at the same time?

## Approach 1: using an alias
My first thought was to use an alias like this:

```typescript
import { List, Map as ImmutableMap, Set } from 'immutable';
```

This would require changing all the existing usages of `Map` to `ImmutableMap`,
so I wanted to think of other ways.

## Approach 2: assignment before import
I then wondered if I could assign `Map` to another name before the import:

```typescript
const BuiltinMap = Map;
import { List, Map, Set } from 'immutable';

const map = new BuiltInMap([['key', 'value']]);
```

But, this doesn't work:
it still creates an Immutable.js Map instead of a built-in Map.

I remembered reading about hoisting in JavaScript and suspected that hoisting was the cause of this.
Sure enough, after a quick search, I learned that [imports are hoisted in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#hoisting).
So, in this code, `Map` is already shadowed when I try to assign it to `BuiltinMap`.

## Approach 3: globalThis
Then, I thought back to Python and how there's a [builtins module](https://docs.python.org/3/library/builtins.html)
that allows you to access built-in bindings when they have been shadowed.

Googling for the JavaScript equivalent of `builtins` didn't get me anywhere,
so I resorted to asking an LLM.

It pointed me to using [globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis).

With `globalThis`, I could leave everything as-is and use the built-in Map this way:

```typescript
const map = new globalThis.Map([['key', 'value']]);
```

But, how does this work?
How is it that both the built-in Map and the Immutable.js Map are available at the top level,
but `globalThis.Map` refers to the built-in Map?

This [Stack Overflow answer](https://stackoverflow.com/a/50470191/14106506) helped clear things up for me.
It turns out, while the Map from Immutable.js gets imported to the *module scope*,
the built-in Map remains untouched at the *global scope*.

Since `globalThis` accesses the global scope, it gets the built-in Map.

<hr>

Between this and the other working approach (using an alias),
I like this approach better.

Strangely enough, I couldn't find any writing that describes using `globalThis` in this way.
While the Python docs for `builtins` talks about accessing shadowed bindings as its primary use case,
the MDN docs for `globalThis` makes no mention of it.
Is `globalThis` the best way to access a shadowed binding?
Let me know your thoughts!
