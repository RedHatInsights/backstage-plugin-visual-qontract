import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { PillList } from './PillList';

type Filter = { field: string; value: string };

export const ActiveFilterPills = ({
  filters,
  onRemove,
  onClearAll,
}: {
  filters: Filter[];
  onRemove: (filter: Filter) => void;
  onClearAll: () => void;
}) => {
  const filterSections = [
    { field: 'app', label: 'Apps' },
    { field: 'type', label: 'Change Types' },
  ];

  const hasFilters = (field: string) =>
    filters.some(filter => filter.field === field);

  const renderFilterSection = (field: string, label: string) => {
    if (!hasFilters(field)) return null;

    return (
      <Box mb={1} key={field}>
        <Typography variant="button">{label}</Typography>
        <PillList
          items={filters
            .filter(filter => filter.field === field)
            .map(filter => filter.value)}
          field={field}
          onClick={(field, value) => onRemove({ field, value })}
          removable
          dataTestIdPrefix="active-filter"
        />
      </Box>
    );
  };

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
      {filterSections.map(({ field, label }) =>
        renderFilterSection(field, label),
      )}
    </Box>
  );
};
