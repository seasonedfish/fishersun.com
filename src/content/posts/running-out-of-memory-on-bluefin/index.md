---
title: "Running out of memory on Bluefin"
pubDate: 2024-11-25T21:23:00.351Z
description: ""
author: "Fisher Sun"
tags: [linux]
---

Last month, I found my laptop running [Bluefin](https://projectbluefin.io/) constantly freezing.
These freezes weren't minor one-second freezes: the entire OS would lock up, and waiting did nothing.
Every time it happened, I would have to hold the power button to trigger a force-shut down.

This should not have been happening: I had equipped my Framework laptop with 16 GB of RAM.
This was twice the amount that my Mac had.
So, I expected it to be able to handle having dozens of tabs open,
as I would often have dozens of tabs open when I worked on my Mac with no issues[^1].
(True, sometimes, the OS would prompt me to close something because it was close to running out of memory, but it would never completely freeze up.)

## Finding a killer that's not so hesitant to do its job
I remembered reading somewhere that the Linux <a href="https://wizardzines.com/comics/oom-killer/">OOM killer</a>
(the kernel mechanism that kills processes when the OS is out of memory)
doesn't like to kill processes unless it has absolutely no choice, leading to systems staying unresponsive for long periods of time.
I remembered that there existed a project called [earlyoom](https://github.com/rfjakob/earlyoom) that sought to implement a more eager OOM killer.

Ah yes, it's in the Fedora repos. I installed it with:
```
rpm-ostree install -A earlyoom
```
This uses [Local Layering](https://docs.projectbluefin.io/administration#enabling-local-layering), which as of the time of writing (2024), is enabled by default in Bluefin.
However, it is set to be disabled in the future, so I manually enabled it:
```
# /etc/rpm-ostreed.conf
# rest of file omitted for brevity
LockLayering=false
```
I then started the earlyoom service with:
```
sudo systemctl enable --now earlyoom
```

## Facing my fears

Having earlyoom improved things somewhat: my system would no longer grind to a complete halt.
However, earlyoom would kill Firefox too quickly--when I opened 20 or so tabs, or equivalently, after five minutes of browsing.
This was unacceptable. I would often have twice the number of tabs on my Mac, and remember, my Mac had half the memory.

Also, I had noticed that Firefox would often have 1-second freezes.

It was time to try installing Chrome again.

Yes, the only reason why I was using Firefox was because I had tried installing Chrome when I was first setting things up, and it didn't work.
You know the "[Linux users installing a web browser](https://www.youtube.com/watch?v=f5k3PGn6DbQ)" meme?
That's almost what it had been like. Except, instead of fingers flying across the keyboard, think of unconfident copy-and-pasting from forum posts; instead of techno music, imagine the sound of me crying.

I had read some forum posts in which users talked about the problems with installing Chrome on Silverblue/Bluefin and shared their workarounds:

> Summary: when you install chrome via the local .rpm file, it adds the Google RPM repository, but doesn’t use it for updates. So, if you uninstall the local .rpm using rpm-ostree, and then install chrome using the now installed Google RPM repository, you’ll see it installed as a layered package rather than a local package. The layered package gets updates.
> 
> --enck, [Fedora Discussion](https://discussion.fedoraproject.org/t/installing-google-chrome-on-fedora-silverblue/1436/7)

> After I did [the uninstall reinstall procedure], rpm-ostree upgrade failed... when there was a Chrome update, because it failed to install the updated RPM from the Chrome yum repo.
>
> --rrenomeron, [Universal Blue Discourse](https://universal-blue.discourse.group/t/installing-chrome-natively/529/6)

> I successfully installed google-chrome-stable by removing gpgcheck...
> I know this is not the best option, but it worked.
>
> --Malix, [Universal Blue Discourse](https://universal-blue.discourse.group/t/installing-chrome-natively/529/8)

> I don’t think there is [a way to install Chrome with a GPG check], unless you go through the trouble to make a custom image, and do all of the installation at build time. I’ve made updating work for me by manually importing the GPG keys and then doing rpm-ostree install with the yum repo enabled. If I don’t import the keys ahead of time, Chrome won’t install due to signature failures (see above).
>
> --rrenomeron, [Universal Blue Discourse](https://universal-blue.discourse.group/t/installing-chrome-natively/529/9)

Nothing I had tried had worked, and it had seemed like my options were either to disable GPG or to build my own custom image, neither of which I had wanted to do.
So, I had given up and had stuck with Firefox, since it was pre-installed.

Now though, I needed to give installing Chrome another shot. I had read some reports that Chrome had better memory usage than Firefox ([1](https://www.reddit.com/r/browsers/comments/11d0v2x/actual_ram_benchmarks_chrome_vs_brave_vs_firefox/), [2](https://www.reddit.com/r/firefox/comments/1agt6bg/why_is_firefox_consumes_much_more_memory_than/)),
and I had also read somewhere that Chrome's inactive tab unloading was better than Firefox's.

I wanted to try something different this time.
I downloaded the Chrome `.deb` and installed it in my Ubuntu Distroxbox container.

Then, to make it visible as an app in Bluefin, I ran (from inside my Ubuntu container):
```
distrobox-export --app google-chrome
```

This worked! After this, I could launch Chrome in Bluefin, and it was just like I had installed it natively.

The memory usage was indeed much better--I could have dozens of tabs open again. Plus, there were no freezes.

There was a problem though: Chrome would show up on my dock with the default icon.
Looking this up, I found my answer in an unlikely place:

> The name of the .desktop file must match the name of the executable it links to. Otherwise the icon doesn’t show up.
>
> --davidfstr, [Discuss wxPython](https://discuss.wxpython.org/t/how-to-set-an-apps-icon-in-the-dock-on-linux-solved/36647/7)

Distrobox had appended the name of my Ubuntu container ("noble") to the start of the .desktop file's name, so I renamed it, which fixed the issue[^2]:
```
cd ~/.local/share/applications
mv noble-google-chrome.desktop google-chrome.desktop
gtk-update-icon-cache
```

## Finishing touches

Finally, I made some tweaks to Chrome to make it more usable.
These are things Firefox gets right out of the box, but they're easily fixable for Chrome.

First, since Chrome runs under Xwayland by default, it looks blurry on GNOME 46 with fractional scaling.
(GNOME 47 actually has a fix for this issue, but [it's behind an experimental feature flag](https://release.gnome.org/47/#:~:text=GNOME%2047%20includes,xwayland%2Dnative%2Dscaling%22%5D%27)).

To fix this, I went to `chrome://flags` and set "Preferred Ozone platform" to "Auto". This made Chrome run under Wayland, since my desktop uses Wayland.[^3]

Second, by default, the two-finger swipe gestures to go back and forward don't work.

To fix this, I edited `~/.local/share/applications/google-chrome.desktop` and added the following flag to every `Exec` field:
```
--enable-features=TouchpadOverscrollHistoryNavigation
```
For example, the first `Exec` field became:
```txt
Exec=/usr/bin/distrobox-enter  -n noble  --   /usr/bin/google-chrome-stable --enable-features=TouchpadOverscrollHistoryNavigation  %U
```

## Conclusion

With earlyoom and Chrome up and running, I finally have a usable Bluefin system.
I hope that by documenting the steps I took, this post will be helpful for other Bluefin users struggling with running out of memory.

## Addendum: systemd-oomd
As I wrote this, I found that [earlyoom was enabled by default](https://fedoraproject.org/wiki/Changes/EnableEarlyoom) in Fedora 32 and then
[replaced by systemd-oomd](https://fedoraproject.org/wiki/Changes/EnableSystemdOomd) in Fedora 34.

So, before I had installed earlyoom, systemd-oomd had been running.
Clearly though, systemd-oomd had not been working well, as it had let my system go completely unresponsive multiple times.
Looking at [discussion on Reddit](https://www.reddit.com/r/Fedora/comments/zsn729/earlyoom_does_not_seem_to_work/),
other people also have had the issue of systemd-oomd not working properly, so earlyoom may be the way to go.

Thus, I disabled systemd-oomd for more memory savings:

```
sudo systemctl disable --now systemd-oomd
```


[^1]: Other people may manage their tabs using reference counting, but I prefer garbage collection.
[^2]: Interestingly, this isn't an issue for other Distrobox-exported apps. For example, my Distrobox-exported VSCode runs fine with the default name. It's still unclear to me what's going on here.
[^3]: Avid readers of this site may remember that I achieved the same effect in a previous post [by setting a command-line argument](/blog/setting-up-vscode-for-gnome-and-wayland#fixing-blurry-text). Adding that command-line argument would also work. I figured that since we have a GUI here though, might as well use it.