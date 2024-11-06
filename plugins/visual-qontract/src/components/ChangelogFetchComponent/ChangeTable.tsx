import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@material-ui/core';
import { Table } from '@backstage/core-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChangeTableProps } from './ChangeTypes';
import { ColumnDefinitions } from './ColumnDefinitions';
import { SearchBox } from './SearchBox';
import { FilterManager } from './FilterManager';

export const ChangeTable = ({ changes }: ChangeTableProps) => {
  const [filters, setFilters] = useState<{ field: string; value: string }[]>(
    [],
  );
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
  }, [filters, navigate, location.search]);

  const addFilter = (field: string, value: string) => {
    setFilters(prevFilters => [...prevFilters, { field, value }]);
  };

  const filteredData = changes
    .filter(change =>
      filters.every(filter =>
        filter.field === 'type'
          ? change.change_types.includes(filter.value)
          : change.apps.includes(filter.value),
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
          <SearchBox searchText={searchText} setSearchText={setSearchText} />
          <FilterManager filters={filters} setFilters={setFilters} />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Table
          options={{ search: false, paging: true, pageSize: 10 }}
          columns={ColumnDefinitions(addFilter)}
          data={filteredData}
        />
      </Grid>
    </Grid>
  );
};
