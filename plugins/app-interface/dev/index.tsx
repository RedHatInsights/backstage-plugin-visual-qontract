import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { appInterfacePlugin, AppInterfacePage } from '../src/plugin';

createDevApp()
  .registerPlugin(appInterfacePlugin)
  .addPage({
    element: <AppInterfacePage />,
    title: 'Root Page',
    path: '/app-interface',
  })
  .render();
