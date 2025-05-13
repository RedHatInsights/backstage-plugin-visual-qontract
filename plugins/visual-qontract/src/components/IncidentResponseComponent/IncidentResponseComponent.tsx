import React from 'react';

import { IncidentResponseCard } from '../HomeComponent/IncidentResponseCard';
import { Page, Header, Content } from '@backstage/core-components';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Link,
} from '@material-ui/core';
import FloatingChat from './FloatingChat';

const LeftMenu = () => {
  return (
    <Grid item xs={3}>
      <Grid container direction="column">
        <Grid item>
          <Card>
            <CardHeader title="Links" />
            <CardContent>
              <Grid container direction="column">
                <Grid item>
                    <Link target="blank" href="/docs/default/component/incident-management">
                      Incident Management & Response Guide
                    </Link>
                </Grid>
                <Grid item>
                    <Link target="blank" href="https://web-rca.devshift.net/new">
                        Report an Incident
                    </Link>
                </Grid>
                <Grid item>
                  <Link target="blank" href="https://web-rca.devshift.net/">Web RCA</Link>
                </Grid>
                <Grid item>
                  <Link target="blank" href="/create/templates/default/webrca-user-onboarding">
                    Web RCA User Onboarding Template
                  </Link>
                </Grid>
                <Grid item>
                  <Link target="blank" href="https://issues.redhat.com/secure/Dashboard.jspa?selectPageId=12362932">
                    PMR AI Dashboard
                  </Link>
                </Grid>
                <Grid item>
                  <Link target="blank" href="https://redhat.enterprise.slack.com/archives/C02PR0YHSBE2">
                    #hcm-incidents-announce on Slack
                  </Link>
                </Grid>
                <Grid item>
                    <Link target="blank" href="/create/templates/default/webrca-user-onboarding">
                        Web RCA User Onboarding Template
                    </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>

              <FloatingChat />
        </Grid>
      </Grid>
    </Grid>
  );
};

const RightContent = () => {
  return (
    <Grid item xs={9}>
      <Grid container direction="column">
        <Grid item xs={12}>
          <IncidentResponseCard maxRows={10}/>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const IncidentResponseComponent = () => {
  return (
    <Page themeId="home">
      <Header title="Incident Response" />
      <Content>
        <Grid container direction="row">
          <LeftMenu />
          <RightContent />
        </Grid>
      </Content>
    </Page>
  );
};
