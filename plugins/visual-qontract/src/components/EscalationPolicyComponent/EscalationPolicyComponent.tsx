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
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { InfoCard } from '@backstage/core-components';
import { EscalationPolicyQuery, NextEscalationPolicyQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';

export const EscalationPolicyComponent = () => {
  const { result: app_result, loaded: app_loaded, error: app_error } = QueryQontract(EscalationPolicyQuery);

  const title = 'Escalation Policy';

  if (app_error) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">
          Error loading the Escalation Policy information.
        </Typography>
      </InfoCard>
    );
  }

  if (!app_loaded) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">Loading...</Typography>
      </InfoCard>
    );
  }

  if (app_result.apps_v1.length === 0) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">No {title} found.</Typography>
      </InfoCard>
    );
  }

  let eps: [any] = [app_result.apps_v1[0].escalationPolicy];

  function getEscalationPolicies(path: string) {
    const { result: nep_result, loaded: nep_loaded, error: nep_error } = QueryQontract(NextEscalationPolicyQuery, path);
    console.log('ep:', path)

    // Check if useful data was returned about our next escalation policy
    if ((nep_error || !nep_loaded) || !(nep_result.escalation_policies_1.length === 0)) {
      return
    }

    var nep = nep_result.escalation_policies_1[0]

    // if this escalation policy has a next escalation policy
    if (nep.channels.nextEscalationPolicy) {
      // make sure we didn't already check this (avoid infinite recursion)
      if (eps.some(e => e.channels.nextEscalationPolicy.path === nep.channels.nextEscalationPolicy.path)) {
        return
      }
      eps.push(nep)
      getEscalationPolicies(nep.channels.nextEscalationPolicy.path)
    }
  }

  //getEscalationPolicies(ep_result.apps_v1[0].escalationPolicy.path)

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
                <TableRow>
                  <TableCell>
                    <Typography>{app_result.apps_v1[0].escalationPolicy.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{app_result.apps_v1[0].escalationPolicy.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Grid item>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography >{app_result.apps_v1[0].escalationPolicy.channels.email}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography >{app_result.apps_v1[0].escalationPolicy.channels.slackUserGroup.handle}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography >{app_result.apps_v1[0].escalationPolicy.channels.jiraBoard.name}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
