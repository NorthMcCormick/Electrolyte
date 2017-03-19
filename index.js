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

function updateIndex() {
  var re = /\<\!\-\-electrolyte:begin\-\-\>((.|[\n|\r|\r\n])*?)\<\!\-\-electrolyte:end\-\-\>[\n|\r|\r\n]?(\s+)?/g;

  var workingDir = process.cwd();
  var electrolyteJSON = fs.readJSONSync(workingDir + '/electrolyte.json');
  var indexHtml = fs.readFileSync(workingDir + '/src/src/index.html').toString();
  var plugins = '<!--electrolyte:begin-->\n<script type="text/javascript" src="assets/electrolyte/electrolyte.js"></script>\n';

  electrolyteJSON.plugins.forEach(function(bundle) {
    plugins += '<script type="text/javascript" src="assets/electrolyte/' + bundle + '.js"></script>\n';
  });

  plugins += '<!--electrolyte:end-->\n\r';

  var contents = indexHtml.replace(re, plugins);

  fs.writeFileSync(workingDir + '/src/src/index.html', contents);
}

function installPlugin(bundle) {
  var workingDir = process.cwd();

  if(fs.existsSync(__dirname + '/plugins/' + bundle + '/plugin.json')) {
    var pluginDetails = fs.readJsonSync(__dirname + '/plugins/' + bundle + '/plugin.json');

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

      updateIndex();
    });


  }else{
    console.log('No shims available for the plugin "' + myArgs[1] + '". Consider requesting a shim in the repo.');
  }
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

    updateIndex();
  break;

  case 'install': // Install a plugin shim
    /**
     * Arguments:
     * 1 - plugin name
     */

    console.log('Installing plugin shim for ' + myArgs[1]);

    var workingDir = process.cwd();

    if(!fs.existsSync(workingDir + '/electrolyte.json')) {
      console.log('Missing electrolyte.json. Run `electrolyte init` before installing plugins');
      return;
    }

    if(myArgs[1] === undefined) {
      console.log('Installing all plugins in electrolyte.json');

      var electrolyteJSON = fs.readJsonSync(workingDir + '/electrolyte.json');

      electrolyteJSON.plugins.forEach(function(plugin) {
        installPlugin(plugin);
      });

    }else{
      installPlugin(myArgs[1]);
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