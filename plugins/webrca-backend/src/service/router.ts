import { errorHandler } from '@backstage/backend-common';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { lookupProduct } from './ocm/status-board';
import { refresh } from './ocm/token';
import { listIncidents } from './ocm/web-rca';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
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

    let default_token = await refresh(
      config.getString('backend.baseUrl'),
      config.getString('ocm.clientId'),
      config.getString('ocm.clientSecret'),
    ).catch((e) => {
      logger.error("Error: ", e);
      response.status(500);
      response.json({error: e})
      return "Invalid token";
    }
    ).then((token) => {
      if (token.error) {
        logger.error("Error: ", token.error);
        response.status(400);
        response.json({error: token.error})
        return 'Invalid token'
      } else {
        return token.access_token;
      }
    });


    let products = '';
    let product_list = await lookupProduct(config.getString('backend.baseUrl'), default_token, req.body.products);
    if (product_list && product_list.items && product_list.items.length > 0) {
      products = product_list.items[0].id;
    }

    if (products === '') {
      const msg = 'No product based on entity';

      response.status(400);
      response.json({error: msg})

      return;
    }

    // TODO: Filter by status?  Add a toggle?
    let incident_list = await listIncidents(config.getString('backend.baseUrl'), default_token, products);
    response.status(200);

    if (incident_list.errorMsg) {
      logger.error('Unsuccessful parse: ' + incident_list.errorMsg);

      response.status(400);
    }

    response.json(incident_list);
  });

  router.use(errorHandler());
  return router;
}
