import { createDevApp } from '@backstage/dev-utils';
import { visualQontractPlugin, ChangelogPageComponent } from '../src/plugin';

createDevApp()
  .registerPlugin(visualQontractPlugin)
  .addPage({
    element: <ChangelogPageComponent />,
    title: 'Changelog',
    path: '/changelog',
  })
  .render();
