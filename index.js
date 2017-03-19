#!/usr/bin/env node

const fs        = require('fs-extra');
const path      = require('path');
const npm       = require("npm");
const exec      = require('child_process').exec;

var myArgs = process.argv.slice(2);

function invalidArguments() {
  console.log('The arguments you entered (or didn\'t are invalid');
}

function getDirectories (srcpath) {
  console.log('Getting directories in: ' + srcpath);
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

function installDeps(deps) {
  return new Promise(function(resolve, reject) {
    var workingDir = process.cwd();

    var installDeps = exec('cd ' + workingDir + ' && npm install --save ' + deps.join(' '), {}, function() {
      resolve();
    });

    installDeps.stdout.on('data', function(data){
      console.log(data);
    });

    installDeps.stderr.on('data', function(data){
      console.log(data);
    });
  });
}

switch(myArgs[0]) {

  case 'init': // Create your electrolyte.json and copy some other stuff over
    console.log('Initializing your project');

    var workingDir = process.cwd();

    var electrolytePath = workingDir + '/src/src/assets/electrolyte/electrolyte.js';
    var electrolyteSourcePath = __dirname + '/templates/electrolyte.js';

    if(!fs.existsSync(workingDir + '/src/src/assets/electrolyte/')) {
      console.log('No electrolyte directory, creating now');
      fs.mkdirSync(workingDir + '/src/src/assets/electrolyte/');
    }

    if(!fs.existsSync(electrolytePath)) {
      console.log('Electrolyte device-ready shim not present, creating now');
      fs.copySync(electrolyteSourcePath, electrolytePath);
    }

    if(!fs.existsSync(workingDir + '/electrolyte.json')) {
      console.log('Missing electrolyte.json, creating now');
      var blank = {
        plugins: []
      };

      fs.writeJSONSync(workingDir + '/electrolyte.json', blank);
    }
    
  break;

  case 'install': // Install a plugin shim
    /**
     * Arguments:
     * 1 - plugin name
     */

    if(myArgs[1] !== undefined) {
      console.log('Installing plugin shim for ' + myArgs[1]);

      var workingDir = process.cwd();

      if(!fs.existsSync(workingDir + '/electrolyte.json')) {
        console.log('Missing electrolyte.json. Run `electrolyte init` before installing plugins');
        return;
      }

      if(fs.existsSync(__dirname + '/plugins/' + myArgs[1] + '/plugin.json')) {
        var pluginDetails = fs.readJsonSync(__dirname + '/plugins/' + myArgs[1] + '/plugin.json');

        installDeps(pluginDetails.dependencies).then(function() {
          console.log('Dependencies installed! Copying other files...');

          var electrolytePath = workingDir + '/src/src/assets/electrolyte/electrolyte.js';
          var electrolyteSourcePath = __dirname + '/templates/electrolyte.js';
          var shimPath = workingDir + '/src/src/assets/electrolyte/' + pluginDetails.bundle + '.js';
          var shimSourcePath = __dirname + '/plugins/' + pluginDetails.bundle + '/'  + pluginDetails.bundle + '.js';

          if(!fs.existsSync(workingDir + '/src/src/assets/electrolyte/')) {
            console.log('No electrolyte directory, creating now');
            fs.mkdirSync(workingDir + '/src/src/assets/electrolyte/');
          }

          if(!fs.existsSync(electrolytePath)) {
            console.log('Electrolyte device-ready shim not present, creating now');
            fs.copySync(electrolyteSourcePath, electrolytePath);
          }

          if(fs.existsSync(shimPath)) {
            fs.removeSync(shimPath);
          }

          fs.copySync(shimSourcePath, shimPath);

          var electrolyteJSON = fs.readJSONSync(workingDir + '/electrolyte.json');
          
          var exists = false;
          electrolyteJSON.plugins.forEach(function(plugin) {
            if(pluginDetails.bundle === plugin) {
              exists = true;
            }
          });

          if(!exists) {
            electrolyteJSON.plugins.push(pluginDetails.bundle);

            fs.writeJSONSync(workingDir + '/electrolyte.json', electrolyteJSON);
          }
        });


      }else{
        console.log('No shims available for the plugin "' + myArgs[1] + '". Consider requesting a shim in the repo.');
      }

    }else{
      invalidArguments();
    }
  break;

  case 'list': // List available plugin shims
    console.log('AVAILABLE PLUGINS');

    var hyphenMax = 30;

    var pluginDirs = getDirectories(__dirname + '/plugins');

    var plugins = [];

    pluginDirs.forEach(function(dir) {
      var pluginInfo = fs.readJSONSync(__dirname + '/plugins/' + dir + '/plugin.json');

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