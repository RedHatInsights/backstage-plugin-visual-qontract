import React, { useState } from 'react';
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
import { EscalationPolicyQuery } from './query';
import { NextEscalationPolicyQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';
import { NextEscalationPolicyRow } from './NextEscalationPolicyRow';

export const NextEscalationPolicyComponent = ({ path }: { path: string }) => {
  if(!path) {
    return <React.Fragment/>
  }
  const { result: result, loaded: loaded, error: error } = QueryQontract(NextEscalationPolicyQuery, path);
  const title = 'Escalation Policy';

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

  if (result.escalation_policies_1.length === 0) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">No {title} found.</Typography>
      </InfoCard>
    );
  }

  function NextEscalationPolicy({nextEscalationPolicy}:{nextEscalationPolicy: any}) {
    if (nextEscalationPolicy?.channels?.nextEscalationPolicy?.path) {
      return <NextEscalationPolicyComponent path={nextEscalationPolicy.channels.nextEscalationPolicy.path}/>
    }
    
    return <React.Fragment/>          
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
                < NextEscalationPolicyRow ep={result.escalation_policies_1[0].escalationPolicy} />
                < NextEscalationPolicy nextEscalationPolicy={result.escalation_policies_1[0].escalationPolicy} />
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
