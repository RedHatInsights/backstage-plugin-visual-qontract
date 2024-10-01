import { Box, Typography, List, ListItem, Link } from "@material-ui/core";
import React from "react";

// The component that displays the instructions on how to get access to WebRCA
export const AccessWebRCA = () => {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          How to get access to WebRCA
        </Typography>
  
        <List
          component="ol"
          sx={{ listStyleType: 'decimal', paddingLeft: '20px' }}
        >
          <ListItem>
            <Typography variant="body1">
              WebRCA access is managed through{' '}
              <Link
                href="https://gitlab.cee.redhat.com/service/ocm-resources"
                target="_blank"
                rel="noopener"
              >
                ocm-resources
              </Link>
              .
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              If you are a member of an SRE team, you should be added to one of
              the existing SRE roles for your team.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              If you are not a member of the SRE team, you should create a Merge
              Request (MR) similar to{' '}
              <Link
                href="https://gitlab.cee.redhat.com/service/ocm-resources/-/merge_requests/4202"
                target="_blank"
                rel="noopener"
              >
                this
              </Link>
              . Once pipelines are green, ping{' '}
              <Link
                href="https://redhat.enterprise.slack.com/archives/CB53T9ZHQ"
                target="_blank"
                rel="noopener"
              >
                @ocm-resources
              </Link>{' '}
              in the{' '}
              <Link
                href="https://redhat.enterprise.slack.com/archives/CB53T9ZHQ"
                target="_blank"
                rel="noopener"
              >
                #forum-cluster-management
              </Link>{' '}
              Slack channel.
            </Typography>
          </ListItem>
        </List>
  
        <Typography variant="h5" gutterBottom>
          Notes
        </Typography>
  
        <List component="ul" sx={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <ListItem>
            <Typography variant="body1">
              Your{' '}
              <Typography component="span" variant="overline">
                user_id
              </Typography>{' '}
              might or might not be your email address. It's whatever you used to
              log into OCM.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              The name of the files you create in{' '}
              <Typography component="span" variant="overline">
                ocm-resources
              </Typography>{' '}
              must match your{' '}
              <Typography component="span" variant="overline">
                user_id
              </Typography>
              . For example, if your{' '}
              <Typography component="span" variant="overline">
                user_id
              </Typography>{' '}
              is{' '}
              <Typography component="span" variant="overline">
                jsmith.myorg
              </Typography>
              , your files should be named{' '}
              <Typography component="span" variant="overline">
                jsmith.myorg.yaml
              </Typography>
              .
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              You only need files for{' '}
              <Typography component="span" variant="overline">
                uhc-stage
              </Typography>{' '}
              and{' '}
              <Typography component="span" variant="overline">
                uhc-production
              </Typography>
              , not{' '}
              <Typography component="span" variant="overline">
                uhc-integration
              </Typography>
              .
            </Typography>
          </ListItem>
        </List>
  
        <Typography variant="body1" gutterBottom>
          For help, ping{' '}
          <Link
            href="https://redhat.enterprise.slack.com/archives/CB53T9ZHQ"
            target="_blank"
            rel="noopener"
          >
            @ocm-resources
          </Link>{' '}
          in the{' '}
          <Link
            href="https://redhat.enterprise.slack.com/archives/CB53T9ZHQ"
            target="_blank"
            rel="noopener"
          >
            #forum-cluster-management
          </Link>{' '}
          Slack channel.
        </Typography>
      </Box>
    );
  };