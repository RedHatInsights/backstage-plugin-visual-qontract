import { Typography, List, ListItem, ListItemText, Link } from "@material-ui/core";
import React from "react";

// The component that displays the instructions on how to respond to an incident
export const IncidentResponseGuide = () => {
    return (
      <React.Fragment>
        <Typography variant="body1">
          Have you noticed an incident? Follow these steps:
        </Typography>
        <List>
          <ListItem>
            <ListItemText>
              1. Check the{' '}
              <Link
                href="https://redhat.enterprise.slack.com/archives/C022YV4E0NA"
                target="_blank"
              >
                #consoledot-incident
              </Link>{' '}
              channel on Slack. Ping if there's no current discussion.
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              2. Consult the{' '}
              <Link
                href="https://docs.google.com/document/d/1AyEQnL4B11w7zXwum8Boty2IipMIxoFw1ri1UZB6xJE/edit?usp=sharing"
                target="_blank"
              >
                Hybrid Cloud Console Incident Response Plan
              </Link>{' '}
              document.
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              3. Open an incident report on{' '}
              <Link href="https://web-rca.devshift.net/new" target="_blank">
                WebRCA
              </Link>
              .
            </ListItemText>
          </ListItem>
        </List>
      </React.Fragment>
    );
  };