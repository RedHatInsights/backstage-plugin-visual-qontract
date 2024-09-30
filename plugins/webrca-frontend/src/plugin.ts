import {
  createPlugin,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const webRcaPlugin = createPlugin({
  id: 'web-rca',
});

export const WebRcaPage = webRcaPlugin.provide(
  createComponentExtension({
    name: 'WebRcaPage',
    component: {
      lazy: () =>
        import('./components/WebRCAFetchComponent').then(m => m.WebRCAFetchComponent),
    },
  }),
);
