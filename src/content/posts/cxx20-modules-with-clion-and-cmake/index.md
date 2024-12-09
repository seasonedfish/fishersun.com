---
title: "C++20 Modules with CLion and CMake"
pubDate: 2024-12-08T20:41:05.686Z
description: ""
author: "Fisher Sun"
tags: [cxx]
---
I've been working through [Crafting Interpreters](https://craftinginterpreters.com/) in C++20, so I tried out using the new modules.
There were a couple of unintuitive things with using modules with CLion and CMake, so I'll document them here so that it may help future me (and maybe other people too).

[Skip to finished CMakeLists.txt](#finished-cmakeliststxt)

## Creating a module
Create a CLion C++ Executable project with language standard C++ 20.

Create a new module by selecting New -> C++ Module Interface Unit.
Give it a name, and leave "Add to targets" checked.

Then, fill out your module:
```c++
// carrot.ixx
export module carrot;

export class Carrot {
public:
    static constexpr int VITAMIN_D = 10'191;
};
```
Import your module from `main.cpp` and use it:
```c++
// main.cpp
#include <iostream>

import carrot;

int main() {
    std::cout << Carrot::VITAMIN_D << std::endl;
    return 0;
}
```
When you run the executable, you'll see that the build errors! You'll get a message like:
```
CMake Error: Output CMakeFiles/demo.dir/carrot.ixx.o provides the `carrot` module but it is not found in a `FILE_SET` of type `CXX_MODULES`
```
Even though we had CLion add our file to the CMake build target, CMake isn't satisfied.
Because we created a module interface unit (a file that exports a module), we'll need to add it to a [special file set](https://stackoverflow.com/a/61244367).

## A modules file set
Here is what our project's CMakeLists.txt has by default:
```cmake
cmake_minimum_required(VERSION 3.30)
project(demo)

set(CMAKE_CXX_STANDARD 20)

add_executable(demo main.cpp
        carrot.ixx)
```
Underneath that, add a file set of type `CXX_MODULES` and add the module interface unit (`carrot.ixx`) to it:
```cmake
target_sources(demo
        PUBLIC
        FILE_SET modules TYPE CXX_MODULES FILES
        carrot.ixx)
```
Run the executable again, and the build should succeed.

## Creating a file glob for module interface units
This configuration allowed us to add one module interface unit to our build,
but each time we create a new one, we'll need to manually add it, which would get annoying.

To resolve this, we can create a file glob for module interface units:
```cmake
file(GLOB_RECURSE MODULE_INTERFACE_UNITS "*.ixx")
```
With this, we can replace the hard-coded list of files with the file glob:
```cmake
target_sources(demo
        PUBLIC
        FILE_SET modules TYPE CXX_MODULES FILES
        ${MODULE_INTERFACE_UNITS})
```

## Finished CMakeLists.txt
Here is what my finished CMakeLists.txt looks like (I've added an `apple.ixx` module to verify that it works):
```cmake
cmake_minimum_required(VERSION 3.30)
project(demo)

set(CMAKE_CXX_STANDARD 20)

add_executable(demo main.cpp
        carrot.ixx
        apple.ixx)

file(GLOB_RECURSE MODULE_INTERFACE_UNITS "*.ixx")
target_sources(demo
        PUBLIC
        FILE_SET modules TYPE CXX_MODULES FILES
        ${MODULE_INTERFACE_UNITS})
```
