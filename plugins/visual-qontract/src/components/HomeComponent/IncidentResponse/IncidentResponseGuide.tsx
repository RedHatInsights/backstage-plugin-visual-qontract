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
              1. Consult the  {' '}
              <Link
                href="/docs/default/component/incident-management/identify/"
                target="_blank"
              >
                Identifying an Incident
              </Link>{' '}
              document to ensure what you are seeing meets the criteria for an incident.
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              2. Use the steps outlined in the{' '}
              <Link
                href="/docs/default/component/incident-management/create/"
                target="_blank"
              >
                Creating an Incident
              </Link>{' '}
              guide to raise an incident.
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              3. Consult the full
              <Link href="/docs/default/component/incident-management/" target="_blank">
              Incident Management and Response Process
              </Link>
              documentation for information on all facets of the incident process including severity levels, roles, and more.
            </ListItemText>
          </ListItem>
        </List>
      </React.Fragment>
    );
  };