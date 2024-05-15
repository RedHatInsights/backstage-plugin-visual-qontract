import React, { Component, useEffect, useState } from 'react';
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
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { InfoCard } from '@backstage/core-components';
import { EscalationPolicyQuery, NextEscalationPolicyQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';
import { request } from 'graphql-request';
import { EscalationPolicyRow } from './NextEscalationPolicyRow';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export const EscalationPolicyComponent = ({ path }: { path: string }) => {
  const { result: result, loaded: loaded, error: error } = QueryQontract(EscalationPolicyQuery);
  const title = 'Escalation Policy';

  const [escalationPolicies, setEscalationPolicies] = useState<any[]>([]);
  const [nextPath, setNextPath] = useState("");

  // Get Backstage objects
  const config = useApi(configApiRef);

  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/visual-qontract/graphql`;

  function GetEscalationPolicy(path: string) {
    const variables = { path: path };
    console.log(variables);
    request(proxyUrl, NextEscalationPolicyQuery, variables)
      .then((data: any) => {
        if (data.escalation_policies_1.length !== 0) {
          if (data.escalation_policies_1[0].channels?.nextEscalationPolicy?.path) {
            // catch any circularly connected policies to avoid infinite recursion
            if (escalationPolicies.some(e => e.path === data.escalation_policies_1[0].channels.nextEscalationPolicy.path)) {
              return;
            }
            setNextPath(data.escalation_policies_1[0].channels.nextEscalationPolicy.path);
          }
          if (escalationPolicies.some(e => e.path === data.escalation_policies_1[0].path)) {
            return;
          }
          setEscalationPolicies([...escalationPolicies, data.escalation_policies_1[0]]);
        }
      })
      .catch((_error) => {
        console.log("no work")
      });
  }

  useEffect(() => {
    if (!result.apps_v1 || result.apps_v1.length === 0) {
      return;
    }
    if (result.apps_v1[0].escalationPolicy?.channels?.nextEscalationPolicy?.path) {
      GetEscalationPolicy(result.apps_v1[0].escalationPolicy.channels.nextEscalationPolicy.path);
    }
  }, [result]);

  useEffect(() => {
    GetEscalationPolicy(nextPath)
  }, [escalationPolicies]);

  if (error) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">
          Error loading the Escalation Policy information.
        </Typography>
      </InfoCard>
    );
  }

  if (!loaded) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">Loading...</Typography>
      </InfoCard>
    );
  }

  if (result.apps_v1.length === 0) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">No {title} found.</Typography>
      </InfoCard>
    );
  }

  return (
    <InfoCard title={title} noPadding>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <TableContainer component={Paper}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="button">Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='button' paragraph>Description</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="button">Contact</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <EscalationPolicyRow ep={result.apps_v1[0].escalationPolicy}  />
                {escalationPolicies.map((component: any, key: any) => (
                  < EscalationPolicyRow ep={component} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
