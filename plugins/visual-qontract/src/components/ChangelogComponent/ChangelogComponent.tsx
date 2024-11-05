import React from 'react';
import { Grid } from '@material-ui/core';

import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ChangelogFetchComponent } from '../ChangelogFetchComponent';

export const ChangelogComponent = () => (
  <Page themeId="tool">
    <Header title="App SRE Changelog" subtitle="">
      <HeaderLabel label="Owner" value="HCM Engineering Productivity" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <ChangelogFetchComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
