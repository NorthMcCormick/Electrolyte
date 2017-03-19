#!/usr/bin/env node

var program = require('commander');

program
  //.arguments('<file>')
  //.option('-u, --username <username>', 'The user to authenticate as')
  //.option('-p, --password <password>', 'The user\'s password')
  //.action(function(file) {
  //  console.log('user: %s pass: %s file: %s', program.username, program.password, file);
  //})
  .version('0.0.1')
  .command('install <plugin-name>', 'Install a cordova plugin shim')
  .parse(process.argv);