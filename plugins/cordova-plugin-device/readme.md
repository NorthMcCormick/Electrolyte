# Device (cordova-plugin-device)

### Installation

##### Ionic plugin install

Navigate to your `src` directory and run `ionic plugin install cordova-plugin-device`

##### Shim Install

Navigate to the root of your Polyonic project and install the follow dependencies like so: `npm install platform --save`

Copy the `cordova-plugin-device.js` file into your `src/assets/electrolyte` directory

Load the script in your `src/index.html` like so: 

```html
<!-- cordova.js required for cordova apps -->
<script src="cordova.js"></script>
<script src="assets/electrolyte/cordova-plugin-device.js"></script>
```