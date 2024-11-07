import React from 'react';
import { Box, TextField, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

export const SearchBox = ({
  searchText,
  setSearchText,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
}) => (
  <Box display="flex" alignItems="center" mb={2}>
    <TextField
      label="Search"
      variant="outlined"
      fullWidth
      placeholder="Search the changelog"
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
      InputProps={{
        endAdornment: (
          <IconButton onClick={() => setSearchText('')} size="small">
            <ClearIcon />
          </IconButton>
        ),
      }}
    />
  </Box>
);
