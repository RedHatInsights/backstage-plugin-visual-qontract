import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { WebRCAFetchComponent } from '../WebRCAFetchComponent';

export const WebRCAComponent = () => (
  <Page themeId="tool">
    <Header title="Welcome to web-rca!" subtitle="This is a work in progress">
      <HeaderLabel label="Owner" value="Service Delivery Ops Dev" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Incidents">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <form>
            <TextField id="product" label="Product" variant="filled" />
          </form>
        </Grid>
        <Grid item>
          <WebRCAFetchComponent product="quay" />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
