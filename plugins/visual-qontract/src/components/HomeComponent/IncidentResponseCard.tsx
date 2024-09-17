import React, { useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import BugReportIcon from '@material-ui/icons/BugReport';
import { makeStyles } from 'tss-react/mui';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';
import { IncidentResponseGuide } from './IncidentResponse/IncidentResponseGuide';
import { AccessWebRCA } from './IncidentResponse/AccessWebRCA';
import { IncidentsTable } from './IncidentResponse/IncidentsTable';
import { TabPanel } from './IncidentResponse/TabPanel';

export const IncidentResponseCard = () => {
  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/webrca/api`;
  const oauthUrl = `${backendUrl}/api/proxy/webrca/oauth`;

  const [webRCAResponse, setWebRCAResponse] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [oauthToken, setOauthToken] = React.useState(null);
  const [oauthTokenTimeout, setOauthTokenTimeout] = React.useState(0);
  const [selectedTab, setSelectedTab] = React.useState(0);

  // Effect that runs when the token changes
  useEffect(() => {
    // If the token is null, fetch a new token
    if (oauthToken === null) {
      fetchAndSetOAuthToken();
      return;
    }
    // If the token is not null, fetch the incidents
    fetchIncidents();
  }, [oauthToken]);

  // Effect that runs when the token timeout changes
  useEffect(() => {
    // If the timeout is 0, return
    // this is the default state
    if (oauthTokenTimeout === 0) {
      return;
    }
    // Set a timeout to clear the token after the timeout
    const timeout = setTimeout(() => {
      setOauthToken(null);
    }, oauthTokenTimeout * 1000);
    // When the component unmounts, clear the timeout
    return () => clearTimeout(timeout);
  }, [oauthTokenTimeout]);

  const fetchAndSetOAuthToken = async () => {
    fetchOAuthToken().then(response => {
      setOauthToken(response.access_token);
      setOauthTokenTimeout(response.expires_in);
    });
  };

  const fetchOAuthToken = async () => {
    setError(false);
    try {
      const response = await fetch(oauthUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials', // You may add more parameters if necessary.
      });

      const data = await response.json();
      return data; // Assuming the response includes the access_token.
    } catch (error) {
      console.error('Error fetching OAuth token:', error);
      setError(true);
    }
  };

  const fetchIncidents = () => {
    setLoading(true);
    setError(false);
    fetch(
      `${proxyUrl}/?status=ongoing&invalid=false&order_by=created_at desc`,
      {
        headers: {
          Authorization: `Bearer ${oauthToken}`,
        },
      },
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(json => {
        setWebRCAResponse(json);
        setLoading(false);
      })
      .catch(error => {
        setError(true);
        setLoading(false);
        console.error('Error fetching incidents:', error);
      });
  };

  const useStyles = makeStyles()(_theme => ({
    infocard: {
      minHeight: '25em',
      flex: '0 0 auto',
      height: '100%',
    },
  }));
  const { classes } = useStyles();

  const StatusIndicatorIcon = () => {
    if (webRCAResponse.total === 0) {
      return <CheckCircleIcon style={{ color: green[500] }} />;
    }
    return <ErrorIcon style={{ color: red[500] }} />;
  };

  const OngoingIncidentsCard = () => {
    if (loading) {
      // Return a centered spinner while loading
      return (
        <Grid container justifyContent="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }

    if (error) {
      return (
        <Typography variant="body1">
          An error occurred while fetching incidents. You can try reloading or
          contact Engineering Productivity.
        </Typography>
      );
    }

    return (
      <Grid>
        <Grid item>
          <Grid container>
            <Grid item xs={1}>
              <Button onClick={() => fetchIncidents()}>Refresh</Button>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item>
              <StatusIndicatorIcon />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="p">
                There are {webRCAResponse.total} Ongoing Incidents
              </Typography>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </Grid>
        <Grid item>
          <IncidentsTable incidents={webRCAResponse.items} />
        </Grid>
      </Grid>
    );
  };

  const TabBar = () => {
    return (
      <React.Fragment>
        <Paper square>
          <Tabs
            value={selectedTab}
            onChange={(_e, newValue) => setSelectedTab(newValue)}
            aria-label="simple tabs example"
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Ongoing Incidents" />
            <Tab label="Report an Incident" />
            <Tab label="Get WebRCA Access" />
          </Tabs>
        </Paper>
        <TabPanel value={selectedTab} index={0}>
          <CardContent>
            <OngoingIncidentsCard />
          </CardContent>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <CardContent>
            <IncidentResponseGuide />
          </CardContent>
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <CardContent>
            <AccessWebRCA />
          </CardContent>
        </TabPanel>
      </React.Fragment>
    );
  };
  return (
    <Card classes={{ root: classes.infocard }}>
      <CardHeader
        title="WebRCA Incidents"
        titleTypographyProps={{
          variant: 'h6',
        }}
        avatar={<BugReportIcon />}
      />
      <TabBar />
    </Card>
  );
};
