import React, { useEffect, useState } from 'react';
import { Card, CardActionArea, CardActions, CardContent, Grid, Link, Typography, makeStyles } from '@material-ui/core';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import HelpIcon from '@material-ui/icons/Help';
import { red, green, yellow, orange } from '@material-ui/core/colors';
import OpenInNew from '@material-ui/icons/OpenInNew';


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  infocard: {
    minHeight: '7em',
    flex: '0 0 auto',
    height: '100%',
  },
});

export const StatusMiniComponent = () => {
  const classes = useStyles();

  const [status, setStatus] = useState({status: {indicator: 'unknown', description: 'Unknown'}});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/status`;

  useEffect(() => {
    setLoading(true);
    fetch(proxyUrl)
      .then(response => response.json())
      .then(json => {
        setStatus(json)
        setLoading(false)
      })
      .catch(error => {
        setError(true)
        console.error('Error fetching Status Page:', error)
        setLoading(false) 
      })
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Status
          </Typography>
          <Typography variant="body2" component="p">
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Status
          </Typography>
          <Typography variant="body2" component="p">
            Error fetching Status Page.
          </Typography>
        </CardContent>
      </Card>
    );
  }


  const StatusIndicatorIcon = () => {
    const icons: { [key: string]: JSX.Element } = {
      none: <CheckCircleIcon style={{ color: green[500] }} />,
      major: <ErrorIcon style={{ color: orange[500] }} />,
      minor: <WarningIcon style={{ color: yellow[500] }} />,
      critical: <NewReleasesIcon style={{ color: red[500] }} />,
      unknown: <HelpIcon />,
    }
    return (
      icons[status.status?.indicator || 'unknown']
    )
  }


  return (
    <Card className={classes.infocard}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Red Hat Service Status
        </Typography>
      </CardContent>
      <CardContent>
        <Grid container>
          <Grid item xs={3}>
          </Grid>
          <Grid item>
            <StatusIndicatorIcon />
          </Grid>
          <Grid item>
            <Typography variant="h6" component="p">
              {status.status?.description || 'Status Unknown'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
          <OpenInNew />
          <Link href={"https://status.redhat.com"} target='_new'>
            <Typography variant="button">Status Page</Typography>
          </Link>
        </CardActions>
    </Card>
  );
};