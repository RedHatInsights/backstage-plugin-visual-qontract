import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Modal } from '@material-ui/core';
import { MarkdownContent } from '@backstage/core-components';

export const IncidentModal = ({ incident }: { incident: any }) => {
  const [open, setOpen] = React.useState(false);

  const styles = theme => ({
    modalStyle1: {
      position: 'absolute',
      top: '10%',
      left: '10%',
      overflow: 'scroll',
      height: '100%',
      display: 'block',
    },
  });

  if (!incident) {
    return null;
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>View</Button>;
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <Card>
          <CardContent>
            <Typography>
              <MarkdownContent content={incident.ai_summary} />
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Dialog>
  );
};
