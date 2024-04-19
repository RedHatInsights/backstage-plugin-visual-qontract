import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { helloEntityPlugin, HelloEntityPage } from '../src/plugin';

createDevApp()
  .registerPlugin(helloEntityPlugin)
  .addPage({
    element: <HelloEntityPage />,
    title: 'Root Page',
    path: '/hello-entity',
  })
  .render();
