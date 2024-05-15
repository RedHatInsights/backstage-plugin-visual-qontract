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


const appInterfaceBaseURL = `https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data`;

const getAppInterfaceLink = (path: string) => {
  return `${appInterfaceBaseURL}${path}`;
};

export const EscalationPolicyRow = ({ep}: {ep: any}) => {
  return (  
    <TableRow>
      <TableCell width="20%">
        <Typography>{ep.name}</Typography>
      </TableCell>
      <TableCell width="55%">
        <Typography>{ep.description}</Typography>
      </TableCell>
      <TableCell width="25%">
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Typography >
                <Box sx={{ alignItems: "baseline" }}>
                  email:
                  {" "}
                  <Link target="_blank" href={"mailto:"+ep.channels.email}>
                    {ep.channels.email}
                  </Link>
                </Box>
              </Typography>
            </Grid>
            { ep.channels.slackUserGroup[0].handle && 
            <Grid item>
              <Typography>
                <Box sx={{ alignItems: "baseline" }}>
                  Slack:
                  {" "}
                  <Link target="_blank" href={getAppInterfaceLink(ep.channels.slackUserGroup[0].path)}>
                    {ep.channels.slackUserGroup[0].handle}
                  </Link>
                </Box>
              </Typography>
            </Grid>
            }
            <Grid item >
              <Typography >{
                <Box sx={{ alignItems: "baseline" }}>
                  JIRA:
                  {" "}
                  <Link target="_blank" href={ep.channels.jiraBoard[0].server.serverUrl}>
                    {ep.channels.jiraBoard[0].name}
                  </Link>
                </Box>
              }</Typography>
            </Grid>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );
};
