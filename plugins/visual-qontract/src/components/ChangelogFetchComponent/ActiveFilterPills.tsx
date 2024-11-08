import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { PillList } from './PillList';

type Filter = { field: string; value: string };

export const ActiveFilterPills = ({
  filters,
  onRemove,
}: {
  filters: Filter[];
  onRemove: (filter: Filter) => void;
}) => {
  const filterSections = [
    { field: 'app', label: 'Apps' },
    { field: 'type', label: 'Change Types' },
  ];

  const renderFilterSection = (field: string, label: string) => {
    const sectionFilters = filters.filter(filter => filter.field === field);
    if (sectionFilters.length === 0) return null;

    return (
      <Box mb={1} key={field}>
        <Typography variant="button">{label}</Typography>
        <PillList
          items={sectionFilters.map(filter => filter.value)}
          field={field}
          onClick={(field, value) => onRemove({ field, value })}
          removable
          dataTestIdPrefix="active-filter"
        />
      </Box>
    );
  };

  if (filters.length === 0) return (
    <Box textAlign="center" mt={2}>
      <Typography variant="caption" color="textSecondary">
        Click on app or type labels to filter.
      </Typography>
    </Box>
  );

  return (
    <Box mb={2}>
      {filterSections.map(({ field, label }) => renderFilterSection(field, label))}
    </Box>
  );
};