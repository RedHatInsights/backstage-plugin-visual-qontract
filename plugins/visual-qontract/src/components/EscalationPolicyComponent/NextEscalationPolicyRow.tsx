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

export const ContactItem = ( {channel, href, text}: {channel: string, href: string, text: string} ) => {
  return (
    <Grid item>
      <Typography >
        <Box sx={{ alignItems: "baseline" }}>
          {channel+":"}
          {" "}
          <Link target="_blank" href={href}>
            {text}
          </Link>
        </Box>
      </Typography>
    </Grid>
  );
};

export const NextEscalationPolicyRow = ({ ep }: { ep: any }) => {
  let email: any;
  let slack: any;
  let jira: any;

  if(ep?.channels?.email){
    email = ep.channels.email;
  }

  if(ep?.channels?.slackUserGroup[0]){
    slack = ep.channels.slackUserGroup[0];
  }

  if(ep?.channels?.jiraBoard[0]){
    jira = ep.channels.jiraBoard[0];
  }

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
            {email && < ContactItem channel='email' href={"mailto:" + email} text={email} />}
            {slack.path && slack.name && < ContactItem channel='Slack' href={getAppInterfaceLink(slack.path)} text={slack.name} />}
            {jira.server?.serverUrl && jira.name && < ContactItem channel='JIRA' href={jira.server.serverUrl} text={jira.name} />}
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );
};
