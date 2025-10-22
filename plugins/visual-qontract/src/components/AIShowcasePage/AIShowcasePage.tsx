import React from 'react';
import {
  Page,
  Header,
  Content,
} from '@backstage/core-components';

export function AIShowcasePage() {
  return (
    <Page themeId="tool">
      <Header title="AI Showcase" subtitle="AI-powered features and demonstrations" />
      <Content>
        <h1>Hello World</h1>
      </Content>
    </Page>
  );
}

