import { createDevApp } from '@backstage/dev-utils';
import { webRcaPlugin, WebRcaPage } from '../src/plugin';

createDevApp()
  .registerPlugin(webRcaPlugin)
  .addPage({
    element: <WebRcaPage />,
    title: 'Web RCA',
    path: '/webrca',
  })
  .render();
