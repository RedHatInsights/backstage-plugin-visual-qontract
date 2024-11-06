import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { ActiveFilterPills } from './ActiveFilterPills';

export const FilterManager = ({
  filters,
  setFilters,
}: {
  filters: { field: string; value: string }[];
  setFilters: React.Dispatch<
    React.SetStateAction<{ field: string; value: string }[]>
  >;
}) => {
  const clearAllFilters = () => setFilters([]);
  const removeFilter = (filter: { field: string; value: string }) => {
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
          >
            Clear All Filters
          </Button>
        </Box>
      )}
      <ActiveFilterPills
        filters={filters}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />
    </>
  );
};
