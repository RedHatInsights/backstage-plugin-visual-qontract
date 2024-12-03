import { Box, Typography, List, ListItem, Link } from '@material-ui/core';
import React from 'react';

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
          <Typography>
            Use the{' '}
            <Link
              href="/create/templates/default/webrca-user-onboarding"
              target="_blank"
            >
              WebRCA User Onboarding
            </Link>{' '}
            template to request access to WebRCA.
          </Typography>
        </ListItem>
      </List>
    </Box>
  );
};
