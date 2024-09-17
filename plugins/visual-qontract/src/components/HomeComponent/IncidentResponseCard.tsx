import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from '@material-ui/core';
import BugReportIcon from '@material-ui/icons/BugReport';
import { makeStyles } from 'tss-react/mui';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';
import OpenInNew from '@material-ui/icons/OpenInNew';

import { mdiSlack, mdiGoogle } from '@mdi/js';
import Icon from '@mdi/react';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

// The component that displays the instructions on how to respond to an incident
const IncidentResponseGuide = () => {
  return (
    <React.Fragment>
      <Typography variant="body1">
        Have you noticed an incident? Follow these steps:
      </Typography>
      <List>
        <ListItem>
          <ListItemText>
            1. Check the{' '}
            <Link
              href="https://redhat.enterprise.slack.com/archives/C022YV4E0NA"
              target="_blank"
            >
              #consoledot-incident
            </Link>{' '}
            channel on Slack. Ping if there's no current discussion.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            2. Consult the{' '}
            <Link
              href="https://docs.google.com/document/d/1AyEQnL4B11w7zXwum8Boty2IipMIxoFw1ri1UZB6xJE/edit?usp=sharing"
              target="_blank"
            >
              Hybrid Cloud Console Incident Response Plan
            </Link>{' '}
            document.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            3. Open an incident report on{' '}
            <Link href="https://web-rca.devshift.net/new" target="_blank">
              WebRCA
            </Link>
            .
          </ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};

// The component that displays the instructions on how to get access to WebRCA
const AccessWebRCA = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        How to get access to WebRCA
      </Typography>

      <List
        component="ol"
        sx={{ listStyleType: 'decimal', paddingLeft: '20px' }}
      >
        <ListItem>
          <Typography variant="body1">
            WebRCA access is managed through{' '}
            <Link
              href="https://gitlab.cee.redhat.com/service/ocm-resources"
              target="_blank"
              rel="noopener"
            >
              ocm-resources
            </Link>
            .
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            If you are a member of an SRE team, you should be added to one of
            the existing SRE roles for your team.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            If you are not a member of the SRE team, you should create a Merge
            Request (MR) similar to{' '}
            <Link
              href="https://gitlab.cee.redhat.com/service/ocm-resources/-/merge_requests/4202"
              target="_blank"
              rel="noopener"
            >
              this
            </Link>
            . Once pipelines are green, ping{' '}
            <Link
              href="https://redhat.enterprise.slack.com/archives/CB53T9ZHQ"
              target="_blank"
              rel="noopener"
            >
              @ocm-resources
            </Link>{' '}
            in the{' '}
            <Link
              href="https://redhat.enterprise.slack.com/archives/CB53T9ZHQ"
              target="_blank"
              rel="noopener"
            >
              #forum-cluster-management
            </Link>{' '}
            Slack channel.
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Notes
      </Typography>

      <List component="ul" sx={{ listStyleType: 'disc', paddingLeft: '20px' }}>
        <ListItem>
          <Typography variant="body1">
            Your{' '}
            <Typography component="span" variant="overline">
              user_id
            </Typography>{' '}
            might or might not be your email address. It's whatever you used to
            log into OCM.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            The name of the files you create in{' '}
            <Typography component="span" variant="overline">
              ocm-resources
            </Typography>{' '}
            must match your{' '}
            <Typography component="span" variant="overline">
              user_id
            </Typography>
            . For example, if your{' '}
            <Typography component="span" variant="overline">
              user_id
            </Typography>{' '}
            is{' '}
            <Typography component="span" variant="overline">
              jsmith.myorg
            </Typography>
            , your files should be named{' '}
            <Typography component="span" variant="overline">
              jsmith.myorg.yaml
            </Typography>
            .
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            You only need files for{' '}
            <Typography component="span" variant="overline">
              uhc-stage
            </Typography>{' '}
            and{' '}
            <Typography component="span" variant="overline">
              uhc-production
            </Typography>
            , not{' '}
            <Typography component="span" variant="overline">
              uhc-integration
            </Typography>
            .
          </Typography>
        </ListItem>
      </List>

      <Typography variant="body1" gutterBottom>
        For help, ping{' '}
        <Link
          href="https://redhat.enterprise.slack.com/archives/CB53T9ZHQ"
          target="_blank"
          rel="noopener"
        >
          @ocm-resources
        </Link>{' '}
        in the{' '}
        <Link
          href="https://redhat.enterprise.slack.com/archives/CB53T9ZHQ"
          target="_blank"
          rel="noopener"
        >
          #forum-cluster-management
        </Link>{' '}
        Slack channel.
      </Typography>
    </Box>
  );
};

const ExternalCoordinationButton = ({ link }: { link: any }) => {
  // if the link contains meet return a video call icon that acts as a link to a new target with the URL and target set to _blank
  if (link.includes('meet')) {
    return (
      <Link href={link} target="_blank">
        <Icon path={mdiGoogle} size={1} color="currentColor" />
      </Link>
    );
  }
  // if the link contains slack return a chat icon that acts as a link to a new target with the URL and target set to _blank
  if (link.includes('slack')) {
    return (
      <Link href={link} target="_blank">
        <Icon path={mdiSlack} size={1} color="currentColor" />
      </Link>
    );
  }
  // If we're not sure what the link is use the OpenInNew icon that acts as a link to a new target with the URL and target set to _blank
  return (
    <Link href={link} target="_blank">
      <OpenInNew />
    </Link>
  );
};

// The component that displays the incidents in a table
function IncidentTable({ incidents }: { incidents: any }) {
  if (incidents?.length === 0) {
    return null;
  }

  const rowsPerPage = 5;
  const [page, setPage] = React.useState(0);
  const [maxPage, setMaxPage] = React.useState(0);
  const [visibleRows, setVisibleRows] = React.useState([]);

  useEffect(() => {
    setMaxPage(Math.floor(incidents.length / rowsPerPage));
    setVisibleRows(
      incidents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    );
  }, [incidents]);

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
        setVisibleRows(
        incidents.slice(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage),
        );
    };
  

  return (
    <TableContainer>
      <Table aria-label="incident table" size="small">
        <TableHead>
          <TableRow>
            <TableCell variant="head" align="center">
              <Typography variant="button">View</Typography>
            </TableCell>
            <TableCell variant="head" align="center">
              <Typography variant="button">Summary</Typography>
            </TableCell>
            <TableCell variant="head" align="center">
              <Typography variant="button">Severity</Typography>
            </TableCell>
            <TableCell variant="head" align="center">
              <Typography variant="button">Coordination</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map(incident => (
            <TableRow key={incident.name}>
              <TableCell>
                <Link
                  href={`https://web-rca.devshift.net/incident/${incident.incident_id}`}
                  target="_blank"
                >
                  <OpenInNew />
                </Link>
              </TableCell>
              <TableCell style={{ maxWidth: '30em' }}>
                {incident.summary}
              </TableCell>
              <TableCell>{incident.severity}</TableCell>
              <TableCell>
                {incident.external_coordination?.map(link => (
                  <ExternalCoordinationButton link={link} />
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              count={incidents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={() => {}}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

// This is essentially taken whole cloth from the Material UI documentation
// Seems like they should ship this as a component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <React.Fragment>{children}</React.Fragment>}
    </div>
  );
}

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
          <IncidentTable incidents={webRCAResponse.items} />
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
