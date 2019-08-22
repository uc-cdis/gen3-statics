# TL;DR

little service proxies access to an S3 bucket

## Use

```
npm start -- [--config configFolder] [help|launch]
```

## Configuration

The server loads configuration from files under a configuration folder.  The configuration folder may be specified in a few ways:
* the `--config` flag is checked first
* if `--config` is not provided, then the code looks under the path specified by the `GEN3_CONFIG_FOLDER` environment folder
* otherwise the configuration folder is set to `/etc/gen3`

for json configuration files `config.json` (holds public configuration) and `creds.json` (holds secret configuration) that combined provide the following data:

```
{
  "bucket": "name",
  "prefix": "object prefix",
  "AWS": {
    "id": "...",
    "secret": "..."
  }
}
```

Run `npm start -- help` for interative help.

## Debugging

Set the debug environment variable to enable verbose logs in the express and s3-proxy modules.

```
export DEBUG='*'
```

## Health check 

Just hit `http://localhost:4000/` as a simple health check - should return `HTTP 200` with root level keys in the configured bucket.

## Docker

```
docker build -t statics:reuben .
```

```
docker run --rm  -v /home/reuben/Secrets/gen3-statics:/etc/gen3 -p 4000:4000 quay.io/cdis/statics:master launch
```

## Resources

We're just using the [s3-proxy](https://www.npmjs.com/package/s3-proxy) npm package.

