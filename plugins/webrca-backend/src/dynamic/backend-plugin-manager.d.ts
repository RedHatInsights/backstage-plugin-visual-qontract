declare module '@backstage/backend-plugin-manager' {
  import { Router } from 'express';

  export interface BackendDynamicPluginInstaller {
    kind: 'legacy';
    router: {
      pluginID: string;
      createPlugin: (options: unknown) => Promise<Router>;
    };
  }
}
