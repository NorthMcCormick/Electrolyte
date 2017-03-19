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

### How to use (Manual)

1. Clone or `npm install --save-dev electrolyte` so you can access the shims. 
2. Follow the installation instructions for each supported plugin. Some plugins require additional node modules to be installed or require additional configuration steps.

### How to use (Automated, but in beta)

1. Install electrolyte globally `npm install -g electrolyte`
2. Make sure you are in the root of your Polyonic project. Initialize Electrolyte with `electrolyte init`
3. Update your index.html so that Electrolyte can automatically include the scripts for you:

**On Load**

Update the cordova.js tag to look like this:

```html
<script src="cordova.js" onload="javascript:window.isCordovaApp = true;"></script>
```
**Script Comments**

Add these comments after so that Electrolyte knows where to put the scripts, like so:

```html
<script src="cordova.js" onload="javascript:window.isCordovaApp = true;"></script>
<!--electrolyte:begin-->
<!--electrolyte:end-->
```

4. Install plugins with `electrolyte install cordova-plugin-device`, if Electrolyte has a shim, it will install it.

### Plugins

[Device (cordova-plugin-device)](plugins/cordova-plugin-device/readme.md)

[App Version (cordova-plugin-app-version)](plugins/cordova-plugin-app-version/readme.md)

### CLI

#### electrolyte install

This will install all the plugins listed in the `electrolyte.json`. Great for restoring the shims after a fresh clone or copy.

#### electrolyte install <plugin-bundle-name>

This will install a plugin and update your `electrolyte.json`. If a plugin doesn't have a shim yet the call will fail with the information. Note: github urls are not yet supported.

#### electrolyte list

This will give you a list of available plugin shims to install.

### With Ionic Native

The end goal with these shims is to allow any ionic app to be easily ported over for desktop use with minimal code changes. Obviously not all plugins can be ported but the hope is things like notifications, device info, geolocation, etc, can be used without any code modification on the desktop side. 

### For contributors

PRs are welcome! If you are contributing please keep in mind the following:

If you are creating a shim for a plugin be sure to follow the correct readme format and include full installation instructions. Shims *must* line up with the cordova interface. If the cordova plugin is using `window.device`, your shim must also bind to `window.device`. 

If creating additional functionality consider creating an entirely new plugin to keep the mobile-compatible shims more aligned with their cordova plugin methods. 