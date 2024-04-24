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
      lazy: () => import('./components/VisualAppInterfaceComponent').then(m => m.VisualAppInterfaceComponent),
    }
  }),
);

export const EntityAppInterfaceDependenciesContent = visualAppInterfacePlugin.provide(
  createComponentExtension({
    name: 'EntityAppInterfaceDependenciesContent',
    component: {
      lazy: () => import('./components/DependenciesComponent').then(m => m.DependenciesComponent),
    }
  }),
);

export const EntityAppInterfaceNamespacesContent = visualAppInterfacePlugin.provide(
  createComponentExtension({
    name: 'EntityAppInterfaceNamespacesContent',
    component: {
      lazy: () => import('./components/NamespacesComponent').then(m => m.NamespacesComponent),
    }
  }),
);

export const EntityAppInterfaceCodeComponentsContent = visualAppInterfacePlugin.provide(
  createComponentExtension({
    name: 'EntityAppInterfaceCodeComponentsContent',
    component: {
      lazy: () => import('./components/CodeComponentsComponent').then(m => m.CodeComponentsComponent),
    }
  }),
);

export const EntityAppInterfacePipelinesComponent = visualAppInterfacePlugin.provide(
  createComponentExtension({
    name: 'EntityAppInterfacePipelinesComponent',
    component: {
      lazy: () => import('./components/PipelinesComponent').then(m => m.PipelinesComponent),
    }
  }),
);