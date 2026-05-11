import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/app';

const app = createApp({
  nodeEnv: 'test',
  port: 3000,
  docsEnabled: true,
  serveStatic: false,
  staticAssetsDir: 'dist/client',
});

describe('API routes', () => {
  it('returns health status', async () => {
    const response = await app.request('http://localhost/api/v1/health');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: {
        status: 'ok',
        runtime: 'node',
      },
    });
  });

  it('returns validation errors in envelope format', async () => {
    const response = await app.request('http://localhost/api/v1/echo');
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('serves openapi and swagger docs', async () => {
    const openApiResponse = await app.request('http://localhost/openapi.json');
    const openApiBody = await openApiResponse.json();

    expect(openApiResponse.status).toBe(200);
    expect(openApiBody.openapi).toBe('3.1.0');

    const docsResponse = await app.request('http://localhost/docs');

    expect(docsResponse.status).toBe(200);
    expect((await docsResponse.text()).toLowerCase()).toContain('swagger');
  });
});
