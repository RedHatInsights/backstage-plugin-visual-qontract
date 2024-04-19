import {
  createPlugin,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const helloEntityPlugin = createPlugin({
  id: 'hello-entity',
});

export const EntityHelloEntityContent = helloEntityPlugin.provide(
  createComponentExtension({
    name: 'EntityHelloEntityContent',
    component: {
      lazy: () => import('./components/HelloEntityComponent').then(m => m.HelloEntityComponent),
    },
  }),
);