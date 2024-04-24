import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Link,
  Chip,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Paper
} from '@material-ui/core';
import {
  InfoCard,
  Page,
  Content,
} from '@backstage/core-components';
import { request } from 'graphql-request';
import { useEntity } from '@backstage/plugin-catalog-react';
import { AppQuery } from './query';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

export const VisualQontractComponent = () => {

  //I'm not creating a type for the app object because it's a lot of fields and I'm not sure what they all are
  type QontractApp = Record<string, any>;

  // Get Backstage objects
  const config = useApi(configApiRef);
  const { entity } = useEntity();

  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/visual-qontract/graphql`
  const gitlabBaseURL = `https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/`

  // Stage
  const [app, setApp] = useState<QontractApp>({});
  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // Get the app interface data on load
  useEffect(() => {
    const variables = { path: getAppInterfacePath() };
    request(proxyUrl, AppQuery, variables)
      .then((data: any) => {
        //Set the app info from data as a AppInterfaceApp
        setAppLoaded(true)
        setApp(data.apps_v1[0])
        console.log(data.apps_v1[0])
      })
      .catch((_error) => {
        setError(true)
      });
  }, []);

  // Function to get the app interface path
  const getAppInterfacePath = () => {
    const platform = entity?.metadata?.labels?.platform
    const service = entity?.metadata?.labels?.service
    return `/services/${platform}/${service}/app.yml`
  }

  const DependencyTable = () => {
    return <Grid item>
      <Typography variant="button">
        Dependencies
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status Page</TableCell>
              <TableCell>SLO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {app.dependencies.map((dependency: any) => (
              <TableRow key={dependency.path}>
                <TableCell>{dependency.name}</TableCell>
                <TableCell>
                  <Link target="_blank" href={dependency.statusPage}>
                    {dependency.statusPage}
                  </Link>
                </TableCell>
                <TableCell>{dependency.SLA}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  }

  const EscalationPolicy = () => {
    return <Grid item>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <Typography variant="button">
            Escalation Policy
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            {app.escalationPolicy.description}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction="row">
        <Grid item>
          <Typography variant="body1">
            Name
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            {app.escalationPolicy.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction="row">
        <Grid item>
          <Typography variant="body1">
            Path
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            <Link target="_blank" href={`${gitlabBaseURL}${app.escalationPolicy.path}`}>
              {app.escalationPolicy.path}
            </Link>
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction="row">
        <Grid item>
          <Typography variant="body1">
            Email
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            <Link target="_blank" href={`mailto:${app.escalationPolicy.channels.email}`}>
              {app.escalationPolicy.channels.email}
            </Link>
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction="row">
        <Grid item>
          <Typography variant="body1">
            Jira Board
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            <Link target="_blank" href={`${gitlabBaseURL}${app.escalationPolicy.channels.jiraBoard[0].path}`}>
              {app.escalationPolicy.channels.jiraBoard[0].name}
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  }

  const Description = () => {
    return <Grid item>
      <Typography variant="button">
        Description
      </Typography>
      <Typography variant="body1">
        {app.description}
      </Typography>
    </Grid>
  }

  const GrafanaURLs = () => {
    return <Grid item>
      <Typography variant="button">
        Grafana URLs
      </Typography>
      <Typography variant="body1">
        {app.grafanaUrls.map((url: any) => <Link
          href={url.url}
          target="_blank"
          rel="noopener noreferrer"
        >{url.title}</Link>)}
      </Typography>
    </Grid>
  }

  const OnBoardingStatus = () => {
    return <Grid item>
      <Typography variant="button">
        Onboarding Status
      </Typography>
      <Typography variant="body1">
        <Chip color="primary" label={app.onboardingStatus} style={{ backgroundColor: '#00AF11' }} />
      </Typography>
    </Grid>
  }

  const ServiceOwners = () => {
    return <Grid item>
      <Typography variant="button">
        Service Owners
      </Typography>
      <Typography variant="body1">
        {app.serviceOwners.map((owner: any) => <Link
          href={`mailto:${owner.email}`}
        >{owner.name}</Link>)}
      </Typography>
    </Grid>
  }

  const SlackUserGroups = () => {
    return <Grid item>
      <Typography variant="button">
        Slack User Group
      </Typography>
      <Typography variant="body1">
        <Link target="_blank" href={`${gitlabBaseURL}${app.escalationPolicy.channels.slackUserGroup[0].path}`}>
          {app.escalationPolicy.channels.slackUserGroup[0].name}
        </Link>
      </Typography>
    </Grid>
  }

  const NextEscalationPolicy = () => {
    return <Grid item>
      <Typography variant="button">
        Next Escalation Policy
      </Typography>
      <Typography variant="body1">
        <Link target="_blank" href={`${gitlabBaseURL}${app.escalationPolicy.channels.nextEscalationPolicy.path}`}>
          {app.escalationPolicy.channels.nextEscalationPolicy.name}
        </Link>
      </Typography>
    </Grid>
  }

  if (error) {
    return <Page themeId="tool">
      <Content>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="App Interface">
              <Typography variant="body1">
                Error loading app interface data.
              </Typography>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  }

  if (!appLoaded) {
    return <Page themeId="tool">
      <Content>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="App Interface">
              <Typography variant="body1">
                Loading...
              </Typography>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  }

  return <InfoCard title="App Interface">
    <Grid container spacing={3} direction="column">
      <Description />
      <GrafanaURLs />
      <OnBoardingStatus />
      <ServiceOwners />
      <EscalationPolicy />
      <SlackUserGroups />
      <NextEscalationPolicy />
      <DependencyTable />
    </Grid>
  </InfoCard>
}
