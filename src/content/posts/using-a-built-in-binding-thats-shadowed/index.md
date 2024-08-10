---
title: "Using a built-in binding that's shadowed"
pubDate: 2024-08-10T02:12:48.075Z
description: ""
author: "Fisher Sun"
tags: ["javascript", "til"]
---

How do you use the built-in JavaScript Map in a module that already imports another Map?
I had this question today and didn't find a clear source on it, so I'll write about my findings.

I was working in legacy code where we used Immutable.js.
The module imported the Immutable.js Map like this:

```typescript
import { List, Map, Set } from 'immutable';
```

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

Strangely enough, I couldn't find any posts describing this technique.
Is `globalThis` the best way to access a shadowed binding?
Let me know your thoughts!
