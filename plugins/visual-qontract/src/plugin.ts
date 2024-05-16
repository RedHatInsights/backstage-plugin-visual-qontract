import {
  createPlugin,
  createComponentExtension
} from '@backstage/core-plugin-api';

export const visualQontractPlugin = createPlugin({
  id: 'visual-qontract',
});

export const EntityVisualQontractContent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityVisualQontractContent',
    component: {
      lazy: () => import('./components/VisualQontractComponent').then(m => m.VisualQontractComponent),
    }
  }),
);

export const EntityQontractDependenciesContent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityQontractDependenciesContent',
    component: {
      lazy: () => import('./components/DependenciesComponent').then(m => m.DependenciesComponent),
    }
  }),
);

export const EntityQontractNamespacesContent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityQontractNamespacesContent',
    component: {
      lazy: () => import('./components/NamespacesComponent').then(m => m.NamespacesComponent),
    }
  }),
);

export const EntityQontractCodeComponentsContent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityQontractCodeComponentsContent',
    component: {
      lazy: () => import('./components/CodeComponentsComponent').then(m => m.CodeComponentsComponent),
    }
  }),
);

export const EntityQontractPipelinesComponent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityQontractPipelinesComponent',
    component: {
      lazy: () => import('./components/PipelinesComponent').then(m => m.PipelinesComponent),
    }
  }),
);

export const EntityQontractEscalationPolicyComponent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityQontractEscalationPolicyComponent',
    component: {
      lazy: () => import('./components/EscalationPolicyComponent').then(m => m.EscalationPolicyComponent),
    }
  }),
);