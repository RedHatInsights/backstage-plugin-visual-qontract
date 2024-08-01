import React from 'react';
import {
  Typography,
  Grid,
  Link,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const appInterfaceBaseURL = `https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data`;

const getAppInterfaceLink = (path: string) => {
  return `${appInterfaceBaseURL}${path}`;
};

export const ContactItem = ({ channel, href, text }: { channel: string, href: string, text: string }) => {
  return (
    <Grid>
      <Grid item>
        <Typography variant="overline">{channel}</Typography>
      </Grid>
      <Grid item>
        <Link target="_blank" href={href}>
          {text}
        </Link>
      </Grid>
    </Grid>
  );
};

export const getJiraLink = (server: string, project: string) => {
  return `${server}/projects/${project}/issues`;
}

export const NextEscalationPolicyRow = ({ ep }: { ep: any }) => {
  let email: any;
  let slack: any;
  let jira: any;

  if (ep?.channels?.email) {
    email = ep.channels.email;
  }

  if (ep?.channels?.slackUserGroup[0]) {
    slack = ep.channels.slackUserGroup[0];
  }

  if (ep?.channels?.jiraBoard[0]) {
    jira = ep.channels.jiraBoard[0];
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Grid container direction='row'>
        <Grid item xs={3}>
          <Typography variant="button">{ep.name}</Typography>
        </Grid>
        <Grid item xs={3}>
          {email && < ContactItem channel='email' href={"mailto:" + email.join(',')} text={email.join('\n')} />}
        </Grid>
        <Grid item xs={3}>
          {slack.path && slack.name && < ContactItem channel='Slack' href={getAppInterfaceLink(slack.path)} text={slack.name} />}
        </Grid>
        <Grid item xs={3}>
          {jira.server?.serverUrl && jira.name && < ContactItem channel='JIRA' href={getJiraLink(jira.server.serverUrl, jira.name)} text={jira.name} />}
        </Grid>
      </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid item>
          <Typography>{ep.description}</Typography>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
