import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { ActiveFilterPills } from './ActiveFilterPills';

type Filter = { field: string; value: string };

export const FilterManager = ({
  filters,
  setFilters,
}: {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}) => {
  const clearAllFilters = () => setFilters([]);
  const removeFilter = (filter: Filter) => {
    setFilters(
      filters.filter(f => f.field !== filter.field || f.value !== filter.value),
    );
  };

  return (
    <>
      {filters.length > 0 && (
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="button">Active Filters</Typography>
          <Button
            onClick={clearAllFilters}
            variant="outlined"
            size="small"
            style={{ marginLeft: 'auto' }}
            data-testid="clear-all-filters"
          >
            Clear All Filters
          </Button>
        </Box>
      )}
      <ActiveFilterPills
        filters={filters}
        onRemove={removeFilter}
      />
    </>
  );
};