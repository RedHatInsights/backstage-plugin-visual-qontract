import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
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
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filtersFromQuery = queryParams.get('filters');
    const startDateFromQuery = queryParams.get('startDate');
    const endDateFromQuery = queryParams.get('endDate');

    if (filtersFromQuery) {
      const parsedFilters = filtersFromQuery.split(',').map(filterStr => {
        const [field, value] = filterStr.split(':');
        return { field, value };
      });
      setFilters(parsedFilters);
    }

    if (startDateFromQuery) setStartDate(startDateFromQuery);
    if (endDateFromQuery) setEndDate(endDateFromQuery);
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

    if (startDate) {
      queryParams.set('startDate', startDate);
    } else {
      queryParams.delete('startDate');
    }

    if (endDate) {
      queryParams.set('endDate', endDate);
    } else {
      queryParams.delete('endDate');
    }

    navigate({ search: queryParams.toString() }, { replace: true });
  }, [filters, startDate, endDate, navigate, location.search]);

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
    .filter(change => {
      // Convert the change's date and the filter dates to Date objects
      //debugger
      const changeDate = new Date(change.merged_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      // Check if the change date is within the range
      const isWithinRange =
        (!start || changeDate >= start) && (!end || changeDate <= end);

      return isWithinRange;
    })
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
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h6">Search & Filter</Typography>
            </Grid>
            <Grid item>
              <SearchBox
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </Grid>
            <Grid item>
              <FilterManager
                filters={filters}
                setFilters={setFilters}
                startDate={startDate}
                startTime={startTime}
                setStartDate={setStartDate}
                setStartTime={setStartTime}
                endDate={endDate}
                endTime={endTime}
                setEndTime={setEndTime}
                setEndDate={setEndDate}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Table
          title="Changelog"
          options={{ search: false, paging: true, pageSize: 10 }}
          columns={ColumnDefinitions(addFilter)}
          data={filteredData}
        />
      </Grid>
    </Grid>
  );
};
