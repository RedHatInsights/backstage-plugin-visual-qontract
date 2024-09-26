import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const webrcaFrontendPlugin = createPlugin({
  id: 'webrca-frontend',
  routes: {
    root: rootRouteRef,
  },
});

export const WebrcaFrontendPage = webrcaFrontendPlugin.provide(
  createRoutableExtension({
    name: 'WebrcaFrontendPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
