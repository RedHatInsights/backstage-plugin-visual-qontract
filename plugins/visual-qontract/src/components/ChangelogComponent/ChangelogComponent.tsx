import React from 'react';
import {
  Page,
  Header,
  TabbedLayout,
} from '@backstage/core-components';
import { QueueTable } from '../MergeQueues/QueueTable';
import { ChangelogFetchComponent } from '../ChangelogFetchComponent';
import { MergeQueueTable } from '../MergeQueues/MergeQueueTable';

export function ChangelogComponent() {
  return (
    <Page themeId="tool">
      <Header title="App Interface" subtitle="App Interface Change History and Merge Queues" />
      <TabbedLayout>
        <TabbedLayout.Route path="/changelog" title="Changelog">
          <ChangelogFetchComponent />
        </TabbedLayout.Route>
        <TabbedLayout.Route path="/self-serviceable" title="Self Service Queue">
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
          <MergeQueueTable />
        </TabbedLayout.Route>
      </TabbedLayout>
    </Page>
  );
}
