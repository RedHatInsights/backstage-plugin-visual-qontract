import React from 'react';
import {
  Typography,
  Grid,
  Link,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Paper,
} from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { NSQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';

export const NamespacesComponent = () => {
  const { result, loaded, error } = QueryQontract(NSQuery);

  const title = 'Clusters & Namespaces';

  const appInterfaceBaseURL = `https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/`;

  const getAppInterfaceLink = (path: string) => {
    return `${appInterfaceBaseURL}${path}`;
  };

  const clusterMap = {
    crcd01ue1: {
      url: 'https://console-openshift-console.apps.crcs02ue1.urby.p1.openshiftapps.com/k8s/cluster/projects/',
      name: 'CRCD',
    },
    'crc-eph': {
      url: 'https://console-openshift-console.apps.crc-eph.r9lp.p1.openshiftapps.com/k8s/cluster/projects/',
      name: 'Ephemeral',
    },
    crcp01ue1: {
      url: 'https://console-openshift-console.apps.crcp01ue1.o9m8.p1.openshiftapps.com/k8s/cluster/projects/',
      name: 'Production',
    },
    crcs02ue1: {
      url: 'https://console-openshift-console.apps.crcs02ue1.urby.p1.openshiftapps.com/k8s/cluster/projects/',
      name: 'Stage',
    },
  };

  const getClusterName = (cluster: string) => {
    if (clusterMap[cluster as keyof typeof clusterMap]) {
      return clusterMap[cluster as keyof typeof clusterMap].name;
    }
    return cluster;
  };

  const getClusterLink = (
    cluster: string,
    namespace: string,
    fallback: string,
  ) => {
    if (clusterMap[cluster as keyof typeof clusterMap]) {
      return `${
        clusterMap[cluster as keyof typeof clusterMap].url
      }${namespace}`;
    }
    return getAppInterfaceLink(fallback);
  };

  const NamespacesTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table size="small" >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="button">Name</Typography>
              </TableCell>
              <TableCell><Typography variant="button">Cluster</Typography></TableCell>
              <TableCell><Typography variant="button">Description</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.apps_v1[0].namespaces.map((namespace: any, key: any) => (
              <TableRow key={key}>
                <TableCell style={{ width: '25%' }}>
                  <Typography variant="subtitle2">
                    <Link
                      target="_blank"
                      href={getAppInterfaceLink(namespace.path)}
                    >
                      {namespace.name}
                    </Link>
                  </Typography>
                </TableCell>
                <TableCell style={{ width: '25%' }}>
                  <Typography variant="subtitle2">
                    <Link
                      target="_blank"
                      href={getClusterLink(
                        namespace.cluster.name,
                        namespace.name,
                        namespace.cluster.path,
                      )}
                    >
                      {getClusterName(namespace.cluster.name)}
                    </Link>
                  </Typography>
                </TableCell>
                <TableCell>{namespace.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (error) {
    return (
      <InfoCard title={title}>
        <Typography  align="center"  variant="body1">
          Error loading the {title} information.
        </Typography>
      </InfoCard>
    );
  }

  if (!loaded) {
    return (
      <InfoCard title={title}>
        <Typography  align="center"  variant="body1">Loading...</Typography>
      </InfoCard>
    );
  }

  if (result.apps_v1.length === 0 || result.apps_v1[0].namespaces.length === 0) {
    return null
  }

  return (
    <InfoCard title={title} noPadding>
      <NamespacesTable />
    </InfoCard>
  );
};
