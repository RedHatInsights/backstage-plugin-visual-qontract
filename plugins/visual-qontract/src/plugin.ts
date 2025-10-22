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

export const EntityQontractSLOComponent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityQontractSLOComponent',
    component: {
      lazy: () => import('./components/SLOComponent').then(m => m.SLOComponent),
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

export const EntityQontractHomePageComponent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityQontractHomePageComponent',
    component: {
      lazy: () => import('./components/HomeComponent').then(m => m.HomeComponent),
    }
  }),
);

export const EntityQontractNewsComponent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityQontractNewsComponent',
    component: {
      lazy: () => import('./components/NewsComponent').then(m => m.NewsComponent),
    }
  }),
);

export const EntityQontractStatusMiniComponent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'EntityQontractStatusMiniComponent',
    component: {
      lazy: () => import('./components/StatusMiniComponent').then(m => m.StatusMiniComponent),
    }
  }),
)

export const ChangelogPageComponent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'ChangelogPageComponent',
    component: {
      lazy: () => import('./components/ChangelogComponent').then(m => m.ChangelogComponent),
    }
  }),
);

export const IncidentResponseComponent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'IncidentResponseComponent',
    component: {
      lazy: () => import('./components/IncidentResponseComponent').then(m => m.IncidentResponseComponent),
    }
  }),
);

export const AIShowcasePageComponent = visualQontractPlugin.provide(
  createComponentExtension({
    name: 'AIShowcasePageComponent',
    component: {
      lazy: () => import('./components/AIShowcasePage').then(m => m.AIShowcasePage),
    }
  }),
);