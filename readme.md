# Electrolyte

The bridge between Cordova phonegap and Electron

<img src="http://www.northmccormick.com/content/images/2017/02/build-with-love@2x.png" height="20">

**Look ma, same codebase!**

<img src="https://github.com/northmccormick/electrolyte/blob/master/assets/device-desktop.png" width="70%" height="auto" style="display: inline-block;"/><img src="https://github.com/northmccormick/electrolyte/blob/master/assets/device-iphone.png" width="30%" height="auto"  style="display: inline-block;"/>

### Goals

Electrolyte's focus is to bridge the gap between Cordova and Electron. Plugin shims allow developers to continue to share a single codebase for not only mobile platforms, but now desktop platforms too. Each shim is modeled as close as possible to its cordova plugin interface. 

### Roadmap

Here's what is coming up

- Continue adding more plugins
- Create a CLI that will automatically install dependencies and update the scripts
- Minifications
- Create-your-own-bundle tool

### How to use

1. Clone or `npm install --save-dev electrolyte` so you can access the shims. 
2. Follow the installation instructions for each supported plugin. Some plugins require additional node modules to be installed or require additional configuration steps.

### Plugins

[Device (cordova-plugin-device)](plugins/cordova-plugin-device/readme.md)
[Device (cordova-plugin-app-version)](plugins/cordova-plugin-app-version/readme.md)

### With Ionic Native

The end goal with these shims is to allow any ionic app to be easily ported over for desktop use with minimal code changes. Obviously not all plugins can be ported but the hope is things like notifications, device info, geolocation, etc, can be used without any code modification on the desktop side. 

### For contributors

PRs are welcome! If you are contributing please keep in mind the following:

If you are creating a shim for a plugin be sure to follow the correct readme format and include full installation instructions. Shims *must* line up with the cordova interface. If the cordova plugin is using `window.device`, your shim must also bind to `window.device`. 

If creating additional functionality consider creating an entirely new plugin to keep the mobile-compatible shims more aligned with their cordova plugin methods. 