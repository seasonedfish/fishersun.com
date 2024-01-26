---
name: "HDN (home.nix utility)"
technologies: ["Rust", "Cargo", "Nix", "Home Manager"]
---
I was using Home Manager to install my packages, but I found its workflow of manually editing the home.nix file (and manually reverting it if something went wrong) tedious. So, I used Rust to create [hdn](https://github.com/seasonedfish/hdn): a utility that handles adding packages, removing packages, and rolling back the home.nix file when Home Manager fails.
