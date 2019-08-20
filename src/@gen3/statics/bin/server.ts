import * as express from 'express';
import s3Proxy from 's3-proxy';

import {loadConfig} from '../lib/configHelper';

const app = express();

app.get('/statics/', s3Proxy(loadConfig(null)));
