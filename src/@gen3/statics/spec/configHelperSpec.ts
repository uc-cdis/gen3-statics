import {loadConfig} from '../lib/configHelper';

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
});
