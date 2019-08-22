import {loadConfig, processArgs} from '../lib/configHelper';

describe('the configuration helper', function() {
  it('loads configuration as expected', function(done) {
    // load test configuration from this folder
    loadConfig(__dirname).then(
      function(config) {
        expect(config && typeof config).toBe('object');
        expect(config.bucket).toBe('bucketName');
        expect(config.prefix).toBe(process.env["USER"] || "");
        expect(config.accessKeyId).toBe('awsId');
        expect(config.secretAccessKey).toBe('awsSecret');
        done();
      }
    );
  });

  it('processes command line arguments', function() {
    const config = processArgs(['launch', '--configFolder', '/tmp']);
    expect(config.command).toBe('launch');
    expect(config.options['configFolder']).toBe('/tmp');
    const config2 = processArgs([]);
    expect(config2.command).toBe('help');
  });
});
