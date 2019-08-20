# TL;DR

little service proxies access to an S3 bucket

## Configuration

Looks under `ENV["GEN3_CONFIG_FOLDER"]/` (defaults to `/etc/gen3`)
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

## Resources

We're just using the [s3-proxy](https://www.npmjs.com/package/s3-proxy) npm package.

