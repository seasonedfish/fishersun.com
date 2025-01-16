---
title: "TIL: Python's double slash is not integer division"
pubDate: 2025-01-16T22:03:30.482Z
description: ""
author: "Fisher Sun"
tags: [til, python]
---

I was working on LeetCode 150. Evaluate Reverse Polish Notation, which specifies:

> The division between two integers always truncates toward zero.

"Ah, this is trivial. If I were using Java, I would just use `/`, but since I'm using Python, I'll use the equivalent, `//`."

So I had the following code in my division case:
```python
divisor = nums.pop()
dividend = nums.pop()
nums.append(dividend // divisor)
```

And I didn't think much of it.

However, I was failing one of the tests, and I could not figure out what was wrong with my code.
I fired up a REPL and tried evaluating the operations step by step.

```
>>> 9 + 3
12
>>> _ * -11
-132
>>> 6 / _
-0.045454545454545456
```
Oh oops, I meant to do `//`, not `/`.
```
>>> 6 // -132
-1
```
Wait, -1? If the original answer was -0.045, then `//` if it were integer division should return 0, not -1.

It turns out, Python's `//` is not integer division like Java's `/`, but rather *floor* division.
They behave the same for positive quotients, but since floor division always rounds down
while integer division rounds towards zero, floor division yields a different result for negative quotients.

For integer division, I needed to do `int(dividend / divisor)`.

I feel like I should have learned this much earlier. It's embarrassing how long they were the same in my head.
Oh well, at least it was better to have learned this while LeetCoding than shipping real code.
