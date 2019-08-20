import fs = require('fs');

export interface ProxyConfig {
  bucket: string;
  prefix: string;
  accessKeyId: string;
  secretAccessKey: string;
  overrideCacheControl: string;
  defaultKey: string;
};


/**
 * Load `creds.json` and `config.json` from the
 * GEN3_CONFIG_FOLDER, and transform the result
 * into a config suitable to pass to `s3-proxy`
 * 
 * @param configFolder defaults to GEN3_CONFIG_FOLDER env and /etc/gen3
 * @return s3-proxy ready config
 */
export function loadConfig(configFolder:string):Promise<ProxyConfig> {
  configFolder = configFolder || process.env['GEN3_CONFIG_FOLDER'] || '/etc/gen3';
  const config:any = ['creds.json', 'config.json'].reduce(
      function(config, fileName) {
        const path = `${configFolder}/${fileName}`;
        if (fs.existsSync(path)) {
          console.log(`Loading config from ${path}`);
          Object.assign(config, require(path));
        } else {
          console.log(`Config file does not exist: ${path}`);
        }
        return config;
      }, {}
    );
  const result:ProxyConfig = {
      bucket: config.bucket || '$BUCKET',
      prefix: config.prefix || '$HOSTNAME',
      accessKeyId: (config.AWS && config.AWS.id) || '$AWS_ACCESS_KEY_ID',
      secretAccessKey: (config.AWS && config.AWS.secret) || '$AWS_SECRET_ACCESS_KEY',
      overrideCacheControl: 'max-age=100000',
      defaultKey: 'index.html'
    };
  // check for environment variable delegation
  ['bucket', 'prefix', 'accessKeyId', 'secretAccessKey'].forEach(
    (key) => {
      if (result[key] && result[key][0] === '$') {
        const varName = result[key].substring(1);
        console.log(`Checking environment ${varName} for config key ${key} - ${process.env[varName]}`);
        result[key] = process.env[varName] || "";
      }
    }
  );
  console.log('Loaded configuration', result);
  return Promise.resolve(result);
}

