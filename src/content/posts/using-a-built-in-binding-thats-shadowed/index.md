---
title: "Using a built-in binding that's shadowed"
pubDate: 2024-08-10T02:12:48.075Z
description: ""
author: "Fisher Sun"
tags: ["javascript", "til"]
---

The other day, I was getting TypeScript errors when I tried to use a built-in Map in some legacy code.
It turns out, the module had imported the Immutable.js Map, shadowing the built-in one.

How could I keep the existing usages of the Immutable.js Map and use the built-in Map at the same time?

## Approach 1: using an alias
My first thought was to use an alias like this:

```typescript
import { List, Map as ImmutableMap, Set } from 'immutable';
```

Then, I could use both Maps:
```typescript
const immutableMap = ImmutableMap();
const builtinMap = new Map(); 
```

This was simple, but I thought of a number of downsides.
- It would require changing all the module's existing usages of `Map` to `ImmutableMap`.
- If I wanted to be consistent, I would have to change `List` to `ImmutableList` and `Set` to `ImmutableSet` as well.
- Developers working in the legacy code would be used to `Map` referring to the Immutable.js Map--they would not expect `Map` to refer to the built-in Map here.

## Approach 2: assignment before import
I then wondered if I could assign `Map` to another name before the import:

```typescript
const BuiltinMap = Map;
import { List, Map, Set } from 'immutable';
```

This would allow me to keep the Immutable.js Map as Map:
```typescript
const immutableMap = Map();
const builtinMap = new BuiltInMap();
```

But, this doesn't work:
`BuiltInMap` ends up referring to the Immutable.js Map.

I remembered reading about hoisting in JavaScript and suspected that it was at play here.

Sure enough, after a quick search, I learned that [imports are hoisted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#hoisting).
So, in this code, `Map` is already shadowed when I try to assign it to `BuiltinMap`.

## Approach 3: globalThis
Then, I thought back to Python and how there's a [builtins module](https://docs.python.org/3/library/builtins.html)
that allows you to access built-in bindings when they have been shadowed.

Googling for the JavaScript equivalent of `builtins` didn't get me anywhere,
so I resorted to asking an LLM.

It pointed me to using [globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis).

With `globalThis`, I could leave the imports as-is and use both Maps like this:

```typescript
const immutableMap = Map();
const builtinMap = new globalThis.Map();
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
While the Python docs for `builtins` talk about accessing shadowed bindings as its primary use case,
the MDN docs for `globalThis` make no mention of it.
Is `globalThis` the best way to access a shadowed binding?
Let me know your thoughts!
