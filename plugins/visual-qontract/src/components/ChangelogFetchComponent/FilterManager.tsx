import React from 'react';
import { Box, IconButton, Typography, Grid, TextField, Tooltip } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { ActiveFilterPills } from './ActiveFilterPills';

type Filter = { field: string; value: string };

export const FilterManager = ({
  filters,
  setFilters,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const clearAllFilters = () => {
    setFilters([]);
    setStartDate('');
    setEndDate('');
  };

  const removeFilter = (filter: Filter) => {
    setFilters(
      filters.filter(f => f.field !== filter.field || f.value !== filter.value),
    );
  };

  const hasFilters = filters.length > 0 || startDate || endDate;

  return (
    <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Filters</Typography>
        {hasFilters && (
          <Tooltip title="Clear Filters">
            <IconButton onClick={clearAllFilters} data-testid="clear-all-filters">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {filters.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="button">Active Filters</Typography>
            <ActiveFilterPills filters={filters} onRemove={removeFilter} />
          </Grid>
        )}
        {!hasFilters && (
          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              style={{ marginTop: '16px' }}
            >
              Click on the app or change type labels to add filters.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};