import { readFileSync, existsSync } from 'fs';
import path from 'path';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';

let openapiDocCache: any = null;

function resolveOpenApiPath(): string | null {
  // Compute module directory in ESM-friendly way
  const moduleDir = (() => {
    try {
      // import.meta.url is available in ESM
      const url = new URL(import.meta.url);
      return path.dirname(decodeURIComponent(url.pathname));
    } catch {
      // Fallback for environments that provide __dirname
      // @ts-ignore
      return typeof __dirname !== 'undefined' ? __dirname : process.cwd();
    }
  })();

  const candidatePaths = [
    // When running from backend directory
    path.join(process.cwd(), 'openapi.yaml'),
    // When running from monorepo root
    path.join(process.cwd(), 'backend', 'openapi.yaml'),
    // When running compiled code from dist (e.g., dist/config -> ../../openapi.yaml)
    path.resolve(moduleDir, '../../openapi.yaml'),
    // Another fallback when path depth differs
    path.resolve(moduleDir, '../../../openapi.yaml'),
  ];
  for (const p of candidatePaths) {
    if (existsSync(p)) return p;
  }
  console.warn('⚠️  openapi.yaml not found. Tried paths:', candidatePaths);
  return null;
}

export function loadOpenApiDoc() {
  if (openapiDocCache) return openapiDocCache;
  try {
    const openapiPath = resolveOpenApiPath();
    if (openapiPath) {
      openapiDocCache = yaml.parse(readFileSync(openapiPath, 'utf8'));
      return openapiDocCache;
    }
  } catch (error) {
    console.error('Failed to load OpenAPI spec:', (error as Error).message);
  }
  return null;
}

export const swaggerServe = swaggerUi.serve;
// Point UI to fetch the spec from /api/docs.json so it always reflects latest
export const swaggerSetup = swaggerUi.setup(undefined, {
  swaggerOptions: {
    url: '/api/docs.json',
  },
});

export const getOpenApiDoc = () => loadOpenApiDoc();
