import { readFileSync, existsSync } from 'fs';
import path from 'path';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';

let openapiDoc: any = null;

try {
  const openapiPath = path.join(process.cwd(), 'openapi.yaml');
  if (existsSync(openapiPath)) {
    openapiDoc = yaml.parse(readFileSync(openapiPath, 'utf8'));
  } else {
    console.warn('⚠️  openapi.yaml not found at:', openapiPath);
  }
} catch (error) {
  console.error('Failed to load OpenAPI spec:', (error as Error).message);
}

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = openapiDoc
  ? swaggerUi.setup(openapiDoc)
  : swaggerUi.setup({
      openapi: '3.0.0',
      info: {
        title: 'Horizon API',
        version: '1.0.0',
        description: 'API documentation unavailable',
      },
      paths: {},
    });
