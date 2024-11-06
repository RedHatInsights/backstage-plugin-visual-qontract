import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { PillList } from './PillList';

export const ActiveFilterPills = ({
  filters,
  onRemove,
  onClearAll,
}: {
  filters: { field: string; value: string }[];
  onRemove: (filter: { field: string; value: string }) => void;
  onClearAll: () => void;
}) => {
  const hasAppFilters = filters.some(filter => filter.field === 'app');
  const hasTypeFilters = filters.some(filter => filter.field === 'type');

  return (
    <Box mb={2}>
      {filters.length > 0 && (
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="button">Active Filters</Typography>
          <Button
            onClick={onClearAll}
            variant="outlined"
            size="small"
            style={{ marginLeft: 'auto' }}
            data-testid="clear-all-filters"
          >
            Clear All Filters
          </Button>
        </Box>
      )}
      {hasAppFilters && (
        <Box mb={1}>
          <Typography variant="button">Apps</Typography>
          <PillList
            items={filters
              .filter(filter => filter.field === 'app')
              .map(filter => filter.value)}
            field="app"
            onClick={(field, value) => onRemove({ field, value })}
            removable
            dataTestIdPrefix="active-filter" // Only assign data-testid for active filters
          />
        </Box>
      )}
      {hasTypeFilters && (
        <Box mb={1}>
          <Typography variant="button">Change Types</Typography>
          <PillList
            items={filters
              .filter(filter => filter.field === 'type')
              .map(filter => filter.value)}
            field="type"
            onClick={(field, value) => onRemove({ field, value })}
            removable
            dataTestIdPrefix="active-filter"
          />
        </Box>
      )}
    </Box>
  );
};
