import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { webrcaFrontendPlugin, WebrcaFrontendPage } from '../src/plugin';

createDevApp()
  .registerPlugin(webrcaFrontendPlugin)
  .addPage({
    element: <WebrcaFrontendPage />,
    title: 'Root Page',
    path: '/webrca-frontend',
  })
  .render();
