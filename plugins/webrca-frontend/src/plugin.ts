import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const webRcaPlugin = createPlugin({
  id: 'web-rca',
  routes: {
    root: rootRouteRef,
  },
});

export const WebRcaPage = webRcaPlugin.provide(
  createRoutableExtension({
    name: 'WebRcaPage',
    component: () =>
      import('./components/WebRCAComponent').then(m => m.WebRCAComponent),
    // import('./components/WebRCAFetchComponent').then(m => m.WebRCAFetchComponent),
    mountPoint: rootRouteRef,
  }),
);
