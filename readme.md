# Electrolyte

The bridge between Cordova phonegap and Electron

A light weight wrapper for Firebase Queue to give you a slightly opinionated but fast way to use the queue.

<img src="http://northmccormick.com/wp-content/uploads/2017/01/build-with-love@2x.png" width="164" height="auto" />

Look ma, same codebase!

<img src="https://github.com/northmccormick/electrolyte/blob/master/assets/device-desktop.png" width="65%" height="auto" />
<img src="https://github.com/northmccormick/electrolyte/blob/master/assets/device-iphone.png" width="30%" height="auto" />

# ![Device Desktop](https://github.com/northmccormick/electrolyte/blob/master/assets/device-desktop.png)

# ![Device iPhone](https://github.com/northmccormick/electrolyte/blob/master/assets/device-iphone.png)

### Goals

Electrolyte's focus is to bridge the gap between Cordova and Electron. Plugin shims allow developers to continue to share a single codebase for not only mobile platforms, but now desktop platforms too. Each shim is modeled as close as possible to its cordova plugin interface. 

### Roadmap

Here's what is coming up

- Continue adding more plugins
- Create a CLI that will automatically install dependencies and update the scripts
- Minifications
- Create-your-own-bundle tool

### How to (Manual)

[Device (cordova-plugin-device)](plugins/cordova-plugin-device/readme.md)

### How to (Automatic)

Coming one day

### With Ionic Native

The end goal with these shims is to allow any ionic app to be easily ported over for desktop use with minimal code changes. Obviously not all plugins can be ported but the hope is things like notifications, device info, geolocation, etc, can be used without any code modification on the desktop side. 

### For contributors

PRs are welcome! If you are contributing please keep in mind the following:

If you are creating a shim for a plugin be sure to follow the correct readme format and include full installation instructions. Shims *must* line up with the cordova interface. If the cordova plugin is using `window.device`, your shim must also bind to `window.device`. 

If creating additional functionality consider creating an entirely new plugin to keep the mobile-compatible shims more aligned with their cordova plugin methods. 