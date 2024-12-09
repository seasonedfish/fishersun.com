---
title: "We have println at home"
pubDate: 2024-12-08T22:07:01.799Z
description: "C++23-style print() and println() in a few lines of C++20"
author: "Fisher Sun"
tags: [cxx]
---
While working through [Crafting Interpreters](https://craftinginterpreters.com/) in C++, I wanted to explore as many modern C++ features as I could.
One of the features I was the most hyped for was `print` and `println`.

Finally, a normal way to print things! I provided `std::formatter` specializations for my TokenType and Token classes, and in my `main.cpp` I excitedly typed:
```c++
std::println
```
only for my IDE to not provide an autocompletion that would include the header file.

Indeed, I did not have the `<print>` header on my machine.

I figured my C++ toolchain was too old and didn't have support for it yet.
"Ah, no problem," I thought, "this is what I have mise for."
But trying to install a newer clang with mise resulted in mise trying to compile it from source, which I didn't want to sit around and wait for.

So I glumly stuck with using `std::cout` and `std::format` as per [this StackOverflow answer](https://stackoverflow.com/a/65185632/14106506).
```c++
std::cout << std::format("{}", token) << std::endl;
```

But this left me feeling unsatisfied.
It was so verbose.

Maybe I could just implement `print` and `println` myself.

I copied the signatures of `print` and `println` from [cppreference](https://en.cppreference.com/w/cpp/io/print)
and implemented them like so:

```c++
#include <format>
#include <iostream>
#include <iterator>

template<class... Args>
void print(std::format_string<Args...> fmt, Args &&... args) {
    static std::ostream_iterator<char> out(std::cout); // (1)
    std::format_to(out, fmt, args...);
}

template<class... Args>
void println(std::format_string<Args...> fmt, Args &&... args) {
    print(fmt, args...);
    std::cout << std::endl; // (2)
}
```
1. Based on this [other StackOverflow answer](https://stackoverflow.com/a/73357333/14106506).
2. Flush `cout` on every new line, [just like Java](https://stackoverflow.com/a/7166357/14106506). 

This worked! In my `main.cpp`, I could now do
```c++
println("{}", token);
```

My implementation is far less complete than [LLVM's](https://github.com/llvm/llvm-project/blob/eff0d8103c5e0db938550dd6e18230ea8ed9ff4b/libcxx/include/print), but it does the job for my simple tree walk interpreter,
and I'm happy with it.
