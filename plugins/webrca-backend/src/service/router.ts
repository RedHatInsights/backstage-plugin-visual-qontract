import { errorHandler } from '@backstage/backend-common';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { lookupProduct } from './ocm/status-board';
import { refresh } from './ocm/token';
import { listIncidents, listPublicIncidents } from './ocm/web-rca';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
}

// Utility function to get the token
async function getToken(config: Config, logger: LoggerService): Promise<string> {
  try {
    const token = await refresh(
      config.getString('backend.baseUrl'),
      config.getString('ocm.clientId'),
      config.getString('ocm.clientSecret'),
    );

    if (token.error) {
      logger.error('Error: ', token.error);
      return 'Invalid token';
    }

    return token.access_token;
  } catch (e) {
    logger.error('Error: ', e);
    return 'Invalid token';
  }
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.post('/incidents', async (req, response) => {
    response.setHeader('Content-Type', 'application/json');

    const default_token = await getToken(config, logger);
    if (default_token === 'Invalid token') {
      response.status(500).json({ error: 'Failed to retrieve access token' });
      return;
    }

    let products = '';
    let product_list = await lookupProduct(config.getString('backend.baseUrl'), default_token, req.body.products);
    if (product_list && product_list.items && product_list.items.length > 0) {
      products = product_list.items[0].id;
    }

    if (products === '') {
      const msg = 'No product based on entity';
      response.status(400).json({ error: msg });
      return;
    }

    // TODO: Filter by status? Add a toggle?
    let incident_list = await listIncidents(config.getString('backend.baseUrl'), default_token, products);
    response.status(200);

    if (incident_list.errorMsg) {
      logger.error('Unsuccessful parse: ' + incident_list.errorMsg);
      response.status(400).json({ error: incident_list.errorMsg });
      return;
    }

    response.json(incident_list);
  });

  router.get('/incidents/public', async (req, response) => {
    response.setHeader('Content-Type', 'application/json');

    const default_token = await getToken(config, logger);
    if (default_token === 'Invalid token') {
      response.status(500).json({ error: 'Failed to retrieve access token' });
      return;
    }

    let incident_list = await listPublicIncidents(config.getString('backend.baseUrl'), default_token);
    response.status(200);

    if (incident_list.errorMsg) {
      logger.error('Unsuccessful parse: ' + incident_list.errorMsg);
      response.status(400).json({ error: incident_list.errorMsg });
      return;
    }

    response.json(incident_list);
  });

  router.use(errorHandler());
  return router;
}
