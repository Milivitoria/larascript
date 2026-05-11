import SwaggerParser from '@apidevtools/swagger-parser';

import { createApp } from '../src/app';
import { loadConfig } from '../src/config/env';

const app = createApp(loadConfig());
const response = await app.request('http://localhost/openapi.json');

if (!response.ok) {
  throw new Error(`Unable to fetch OpenAPI document: ${response.status} ${response.statusText}`);
}

const document = await response.json();
await SwaggerParser.validate(document as object);

console.info('OpenAPI document is valid.');
