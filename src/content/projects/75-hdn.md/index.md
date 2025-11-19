---
name: "HDN (home.nix utility)"
repo: https://github.com/seasonedfish/hdn
---
![The command-line output of HDN. There is a diff of the home.nix file and the output of a home-manager invocation.](image.png)

I was using Home Manager to install my packages, but I found its workflow of manually editing the `home.nix` file (and manually reverting it if something went wrong) tedious. So, I used Rust to create HDN: a tool that takes care of `home.nix` just like how Cargo takes care of `Cargo.toml` or how npm takes care of `package.json`.

With HDN, users can install packages and update their `home.nix` files with a simple `hdn add <package>`.
HDN will automatically roll back changes to `home.nix` if an installation fails.

I've found HDN very useful for my own use case. I've replaced nearly all of my invocations of `home-manager` with invocations of `hdn`.
