import React from 'react';
import {
  Page,
  Header,
  HeaderLabel,
  TabbedLayout,
} from '@backstage/core-components';
import { QueueTable } from './QueueTable';

export function MergeQueues() {
  return (
    <Page themeId="tool">
      <Header title="App SRE Queues" subtitle="">
        <HeaderLabel label="Owner" value="HCM Engineering Productivity" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <TabbedLayout>
        <TabbedLayout.Route path="/self-serviceable" title="Self Serviceable">
          <QueueTable
            key="self-serviceable"
            markdown="app-interface-open-selfserviceable-mr-queue.md"
            title="Self Serviceable"
          />
        </TabbedLayout.Route>
        <TabbedLayout.Route path="/review-queue" title="Review Queue">
          <QueueTable
            key="review-queue"
            markdown="app-interface-review-queue.md"
            title="Review Queue (Non Self-serviceable)"
          />
        </TabbedLayout.Route>
        <TabbedLayout.Route path="/merge-queue" title="Merge Queue">
          <QueueTable
            key="merge-queue"
            markdown="app-interface-merge-queue.md"
            title="Merge Queue"
          />
        </TabbedLayout.Route>
      </TabbedLayout>
    </Page>
  );
}
