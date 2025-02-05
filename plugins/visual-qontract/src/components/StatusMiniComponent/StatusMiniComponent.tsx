import React, { useEffect, useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Link,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import HelpIcon from '@material-ui/icons/Help';
import { red, green, yellow, orange } from '@material-ui/core/colors';
import OpenInNew from '@material-ui/icons/OpenInNew';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import { configApiRef, fetchApiRef } from '@backstage/core-plugin-api';

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

  const config = useApi(configApiRef);
  const fetchApi = useApi(fetchApiRef);
  const backendUrl = config.getString('backend.baseUrl');

  const [status, setStatus] = useState({
    status: { indicator: 'unknown', description: 'Unknown' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Constants
  const proxyUrl = `${backendUrl}/api/proxy/status`;

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetchApi.fetch(proxyUrl);
      const json = await response.json();
      setStatus(json);
    } catch (error) {
      console.error('Error fetching Status Page:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
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
    };
    return icons[status.status?.indicator || 'unknown'];
  };

  return (
    <Card className={classes.infocard}>
      <CardHeader
        titleTypographyProps={{
          variant: 'h6',
        }}
        title="Red Hat Service Status"
        avatar={<CloudDoneIcon />}
      ></CardHeader>
      <CardContent>
        <Grid container>
          <Grid item xs={3}></Grid>
          <Grid item>
            <StatusIndicatorIcon />
          </Grid>
          <Grid item>
            <Typography variant="h6" component="p">
              {status.status?.description || 'Status Unknown'}
            </Typography>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <OpenInNew />
        <Link href={'https://status.redhat.com'} target="_new">
          <Typography variant="button">Status Page</Typography>
        </Link>
      </CardActions>
    </Card>
  );
};
