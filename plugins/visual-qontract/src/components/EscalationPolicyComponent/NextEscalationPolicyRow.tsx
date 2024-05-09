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
import { NextEscalationPolicyQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';

export const EscalationPolicyRow = ({ep}: {ep: any}) => {  
  return (  
    <TableRow>
      <TableCell>
        <Typography>{ep.name}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{ep.description}</Typography>
      </TableCell>
      <TableCell>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Typography >{ep.channels.email}</Typography>
            </Grid>
            <Grid item>
              <Typography >{ep.channels.slackUserGroup[0].handle}</Typography>
            </Grid>
            <Grid item>
              <Typography >{ep.channels.jiraBoard[0].name}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );
};
