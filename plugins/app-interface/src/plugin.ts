import {
  createPlugin,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const appInterfacePlugin = createPlugin({
  id: 'app-interface',
});

export const EntityAppInterfaceContent = appInterfacePlugin.provide(
  createComponentExtension({
    name: 'EntityAppInterfaceContent',
    component: {
      lazy: () => import('./components/AppInterfaceComponent').then(m => m.AppInterfaceComponent),
    },
  }),
);
