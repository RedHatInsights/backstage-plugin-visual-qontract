import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { MockConfigApi } from '@backstage/test-utils';

describe('createRouter', () => {
  let app: express.Express;

  const mockConfig = new MockConfigApi({
    app: { baseUrl: 'https://example.com' },
    ocm: {
      webRcaUrl: 'https://web-rca.stage.devshift.net',
      clientId: 'foo',
      clientSecret: 'bar',
    }
  })

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: mockConfig,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
