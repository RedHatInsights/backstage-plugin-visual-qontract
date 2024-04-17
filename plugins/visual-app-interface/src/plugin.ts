import {
  createPlugin,
  createComponentExtension
} from '@backstage/core-plugin-api';

export const visualAppInterfacePlugin = createPlugin({
  id: 'visual-app-interface',
});

export const EntityVisualAppInterfaceContent = visualAppInterfacePlugin.provide(
  createComponentExtension({
    name: 'EntityVisualAppInterfaceContent',
    component: {
      lazy: () => import('./components/VisualAppInterfaceComponent').then(m => m.ExampleComponent),
    }
  }),
);
