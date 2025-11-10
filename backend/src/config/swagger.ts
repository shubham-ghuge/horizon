import { readFileSync } from 'fs';
import path from 'path';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';

const openapiPath = path.join(process.cwd(), 'openapi.yaml');
const openapiDoc = yaml.parse(readFileSync(openapiPath, 'utf8'));

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(openapiDoc);
