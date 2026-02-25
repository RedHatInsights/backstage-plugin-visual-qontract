import http from 'http';
import express from 'express';
import cors from 'cors';
import { Logger } from 'winston';
import { createRouter } from './router';
import { Config } from '@backstage/config';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
  config: Config;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<http.Server> {
  const logger = options.logger.child({ service: 'plugin-web-rca-backend' });
  logger.debug('Starting application server...');
  const config = options.config;
  const router = await createRouter({
    logger,
    config,
  });

  const app = express();
  if (options.enableCors) {
    app.use(cors({ origin: 'http://localhost:3000' }));
  }
  app.use('/web-rca-backend', router);

  const server = http.createServer(app);
  return new Promise((resolve, reject) => {
    server.listen(options.port, () => {
      logger.info(`Listening on :${options.port}`);
      resolve(server);
    }).on('error', (err: Error) => {
      logger.error('Dev server failed:', err);
      reject(err);
    });
  });
}
