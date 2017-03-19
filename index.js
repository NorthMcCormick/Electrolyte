#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

var myArgs = process.argv.slice(2);

function invalidArguments() {
  console.log('The arguments you entered (or didn\'t are invalid');
}

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

switch(myArgs[0]) {
  case 'install': // Install a plugin shim
    /**
     * Arguments:
     * 1 - plugin name
     */

    if(myArgs[1] !== undefined) {
      console.log('Installing plugin shim for ' + myArgs[1]);
    }else{
      invalidArguments();
    }
  break;

  case 'list': // List available plugin shims
    console.log('AVAILABLE PLUGINS');

    var hyphenMax = 30;

    var pluginDirs = getDirectories('plugins');

    var plugins = [];

    pluginDirs.forEach(function(dir) {
      var pluginInfo = fs.readJSONSync('./plugins/' + dir + '/plugin.json');

      plugins.push({
        name: pluginInfo.name,
        bundle: pluginInfo.bundle
      });
    });

    plugins.forEach(function(plugin) {

      var hyphens = '';

      for(var i = 0; i <= (hyphenMax - plugin.bundle.length); i++) {
        hyphens += '-';
      }

      console.log('[' + plugin.bundle + '] ' + hyphens + ' ' + plugin.name);
    });

  break;

  default:
  
  break;
}