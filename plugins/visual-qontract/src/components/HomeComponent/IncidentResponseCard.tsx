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
import { configApiRef, useApi, fetchApiRef } from '@backstage/core-plugin-api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';
import { IncidentResponseGuide } from './IncidentResponse/IncidentResponseGuide';
import { AccessWebRCA } from './IncidentResponse/AccessWebRCA';
import { IncidentsTable } from './IncidentResponse/IncidentsTable';
import { TabPanel } from './IncidentResponse/TabPanel';

export const IncidentResponseCard = ({maxRows}:{maxRows: number}) => {
  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  // Make this a record any any to prevent type errors
  const [webRCAResponse, setWebRCAResponse] = React.useState(
    {} as any,
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const fetchApi = useApi(fetchApiRef);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await fetchApi.fetch(
        `${config.getString(
          'backend.baseUrl',
        )}/api/plugin-web-rca-backend/incidents/public`,
      );

      if (!response.ok ) {
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }

      const json = await response.json();

      if (json.kind === 'Error' || json.error) {
        throw new Error('Something went wrong talking to WebRCA');
      }

      setWebRCAResponse(json);
    } catch (error) {
      setError(true);
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
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
            <CircularProgress role="progressbar" />
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
          <IncidentsTable incidents={webRCAResponse.items} maxRows={maxRows}/>
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
