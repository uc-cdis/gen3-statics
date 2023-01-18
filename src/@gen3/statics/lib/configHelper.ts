import fs = require('fs');

/**
 * S3 proxy configuration loaded from
 * configuration files by loadConfig
 */
export interface ProxyConfig {
  bucket: string;
  prefix: string;
  accessKeyId: string;
  secretAccessKey: string;
  overrideCacheControl: string;
  defaultKey: string;
  region: string;
};

/**
 * Results of command line parsing -
 * see processArgs
 */
export interface LaunchConfig {
  options: { [key:string]: string };
  command: string;
}


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
      // file deepcode ignore HardcodedNonCryptoSecret: this is not a secret
      secretAccessKey: (config.AWS && config.AWS.secret) || '$AWS_SECRET_ACCESS_KEY',
      overrideCacheControl: 'max-age=300',
      defaultKey: '',
      region: config.region || process.env.AWS_DEFAULT_REGION || 'us-east-1'
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

  // sanitize secrets before logging
  const safe:ProxyConfig = { ...result };
  if (safe.secretAccessKey) {
    safe.secretAccessKey = safe.secretAccessKey.substring(0,2) + '...';
  }
  if (safe.accessKeyId) {
    safe.accessKeyId = safe.accessKeyId.substring(0,2) + '...';
  }
  console.log('Loaded configuration', safe);
  return Promise.resolve(result);
}

/**
 * Process command line arguments: command --opt1 val1 --opt2 val2 ..
 *   --option value sets options[option] to value - default value is true
 * Last argument is set to the command, or command defaults to 'help'.
 * 
 * @param args CLI args - typically process.argv.slice(2)
 * @return LaunchConfig
 */
export function processArgs(args:string[]): LaunchConfig {
  const config:LaunchConfig = {
    options: {},
    command: args[0] || 'help'
  };
  args.slice(1).reduce((acc,it) => {
    if (it.startsWith('-')) {
      const optionKey = it.replace(/^-+/, '');
      acc.config.options[optionKey] = 'true';
      acc.lastOption = optionKey;
    } else if (acc.lastOption) {
      acc.config.options[acc.lastOption] = it;
    } else {
      console.log(`ignoring misplaced option: ${it}`);
    }
    return acc;
  }, { config, lastOption: ''} );
  return config
}
