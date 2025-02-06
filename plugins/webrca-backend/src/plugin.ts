// import { loggerToWinstonLogger } from '@backstage/backend-common';
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
        httpRouter.use(
          await createRouter({
            logger,
            config,
          }),
        );
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
