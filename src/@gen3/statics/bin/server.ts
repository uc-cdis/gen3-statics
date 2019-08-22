import fs = require('fs');
import * as express from 'express';
import s3Proxy = require('s3-proxy');

import {loadConfig, processArgs, LaunchConfig, ProxyConfig} from '../lib/configHelper';

function launchServer(configFolder:string) {
  const app = express();

  // enable logging
  app.use(require('morgan')('dev'));

  loadConfig(configFolder).then(
    (config:ProxyConfig) => {
      app.get('/*', s3Proxy(config));
      app.listen(4000, function() {
        console.log('Server listening at http://localhost:4000/');
      });    
    }
  );
}

function help() {
  fs.readFile(`${__dirname}/../README.md`, 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}

// main --------------

console.log(process.argv);
const launchConfig:LaunchConfig = processArgs(process.argv.slice(2))

if (launchConfig.command == 'launch') {
  launchServer(launchConfig.options['configFolder']);
} else {
  help();
}
