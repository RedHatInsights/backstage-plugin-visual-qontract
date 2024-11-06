import React, { useState, useEffect } from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, Paper, TextField, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { PillList } from './PillList';
import { ActiveFilterPills } from './ActiveFilterPills';
import { ChangeTableProps } from './ChangeTypes';

export const ChangeTable = ({ changes }: ChangeTableProps) => {
  const [filters, setFilters] = useState<{ field: string; value: string }[]>(
    [],
  );
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const updateQueryString = (filters: { field: string; value: string }[]) => {
    const queryParams = new URLSearchParams(location.search);
    const filterStrings = filters.map(
      filter => `${filter.field}:${filter.value}`,
    );
    if (filterStrings.length > 0) {
      queryParams.set('filters', filterStrings.join(','));
    } else {
      queryParams.delete('filters');
    }
    navigate({ search: queryParams.toString() }, { replace: true });
  };

  const addFilter = (field: string, value: string) => {
    setFilters(prevFilters => {
      const newFilter = { field, value };
      return prevFilters.some(f => f.field === field && f.value === value)
        ? prevFilters
        : [...prevFilters, newFilter];
    });
  };

  const removeFilter = (filter: { field: string; value: string }) => {
    setFilters(prevFilters =>
      prevFilters.filter(
        f => f.field !== filter.field || f.value !== filter.value,
      ),
    );
  };

  const clearAllFilters = () => {
    setFilters([]);
  };

  const handleSearchClear = () => {
    setSearchText('');
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filtersFromQuery = queryParams.get('filters');
    if (filtersFromQuery) {
      const parsedFilters = filtersFromQuery.split(',').map(filterStr => {
        const [field, value] = filterStr.split(':');
        return { field, value };
      });
      setFilters(parsedFilters);
    }
  }, [location.search]);

  useEffect(() => {
    updateQueryString(filters);
  }, [filters]);

  const columns: TableColumn[] = [
    {
      title: 'Commit',
      field: 'commit',
      render: rowData => (
        <a
          href={`https://gitlab.cee.redhat.com/service/app-interface/-/commit/${rowData.commit}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#007bff', textDecoration: 'underline' }}
        >
          {rowData.commit}
        </a>
      ),
    },
    {
      title: 'Merged At',
      field: 'merged_at',
      render: rowData => {
        const date = new Date(rowData.merged_at);
        return new Intl.DateTimeFormat('default', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short',
        }).format(date);
      },
    },
    {
      title: 'Change Succeeded',
      field: 'error',
      render: rowData =>
        rowData.error === false ? (
          <CheckCircleIcon color="primary" aria-label="Change succeeded" />
        ) : (
          <CancelIcon color="error" aria-label="Change failed" />
        ),
    },
    {
      title: 'Change Types',
      field: 'change_types',
      render: rowData => (
        <PillList
          items={rowData.change_types}
          field="type"
          onClick={addFilter}
        />
      ),
    },
    {
      title: 'Apps',
      field: 'apps',
      render: rowData => (
        <PillList items={rowData.apps} field="app" onClick={addFilter} />
      ),
    },
  ];

  const filteredData = changes
    .filter(change =>
      filters.every(filter =>
        filter.field === 'type'
          ? (change.change_types || []).some(
              type => type.trim() === filter.value,
            )
          : (change.apps || []).some(app => app.trim() === filter.value),
      ),
    )
    .filter(change =>
      searchText
        ? Object.values(change).some(value =>
            Array.isArray(value)
              ? value.join(' ').toLowerCase().includes(searchText.toLowerCase())
              : String(value).toLowerCase().includes(searchText.toLowerCase()),
          )
        : true,
    );

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Search"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearchClear} size="small">
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <ActiveFilterPills
            filters={filters}
            onRemove={removeFilter}
            onClearAll={clearAllFilters}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Table
          options={{ search: false, paging: true, pageSize: 10 }}
          columns={columns}
          data={filteredData}
        />
      </Grid>
    </Grid>
  );
};
