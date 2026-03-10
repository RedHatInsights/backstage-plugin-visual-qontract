import { coreServices, createBackendPlugin } from '@backstage/backend-plugin-api';

import { createRouter } from './service/router';

/**
 * The web-rca-backend backend plugin.
 *
 * @alpha
 */
export const web_rca_backendPlugin = createBackendPlugin({
  pluginId: 'plugin-web-rca-backend',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        httpRouter: coreServices.httpRouter,
      },
      async init({ config, logger, httpRouter }) {
        // http.use(() => createRouter({...config, logger: loggerToWinstonLogger(logger)}));
        const router = await createRouter({
          logger,
          config,
        });
        httpRouter.use(router as unknown as Parameters<typeof httpRouter.use>[0]);
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'user-cookie',
        });
        httpRouter.addAuthPolicy({
          path: '/incidents',
          allow: 'user-cookie',
        });
      },
    });
  },
});
