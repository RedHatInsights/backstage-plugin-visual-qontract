import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Typography,
} from '@material-ui/core';
import { useState } from 'react';
import { MarkdownContent } from '@backstage/core-components';

export const IncidentModal = ({ incident }: { incident: any }) => {
  const [open, setOpen] = useState(false);

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
