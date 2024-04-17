import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { visualAppInterfacePlugin, VisualAppInterfacePage } from '../src/plugin';

createDevApp()
  .registerPlugin(visualAppInterfacePlugin)
  .addPage({
    element: <VisualAppInterfacePage />,
    title: 'Root Page',
    path: '/visual-app-interface',
  })
  .render();
