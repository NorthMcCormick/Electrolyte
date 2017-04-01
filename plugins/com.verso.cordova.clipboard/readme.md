[< Back To Readme](../../readme.md)

# Clipboard (com.verso.cordova.clipboard)

### Installation

##### Ionic plugin install

Navigate to your `src` directory and run `ionic plugin install com.verso.cordova.clipboard`

##### Shim Install

Copy the `com.verso.cordova.clipboard.js` file into your `src/assets/electrolyte` directory

Load the script in your `src/index.html` like so: 

```html
<!-- cordova.js required for cordova apps -->
<script src="cordova.js"></script>
<script src="assets/electrolyte/com.verso.cordova.clipboard.js"></script>
```

### Other Notes

The clipboard plugin within electron is actually capable of ALL kinds of clipboard transactions. However only the basic `copy` and `paste` are supported via cordova so that is what this mirrors. I may eventually extend it further.