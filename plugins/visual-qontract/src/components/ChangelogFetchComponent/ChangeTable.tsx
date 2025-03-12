import React, { useState, useEffect } from 'react';
import { FormControlLabel, FormGroup, Grid, Paper, Typography } from '@material-ui/core';
import { Table } from '@backstage/core-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChangeTableProps } from './ChangeTypes';
import { ColumnDefinitions } from './ColumnDefinitions';
import { SearchBox } from './SearchBox';
import { FilterManager } from './FilterManager';
import { Switch } from '@material-ui/core';

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
    const startTimeFromQuery = queryParams.get('startTime');
    const endDateFromQuery = queryParams.get('endDate');
    const endTimeFromQuery = queryParams.get('endTime');

    if (filtersFromQuery) {
      const parsedFilters = filtersFromQuery.split(',').map(filterStr => {
        const [field, value] = filterStr.split(':');
        return { field, value };
      });
      setFilters(parsedFilters);
    }

    if (startDateFromQuery) setStartDate(startDateFromQuery);
    if (startTimeFromQuery) setStartTime(startTimeFromQuery);
    if (endDateFromQuery) setEndDate(endDateFromQuery);
    if (endTimeFromQuery) setEndTime(endTimeFromQuery);
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

    if (startTime) {
      queryParams.set('startTime', startTime);
    } else {
      queryParams.delete('startTime');
    }

    if (endDate) {
      queryParams.set('endDate', endDate);
    } else {
      queryParams.delete('endDate');
    }

    if (endTime) {
      queryParams.set('endTime', startTime);
    } else {
      queryParams.delete('endTime');
    }

    navigate({ search: queryParams.toString() }, { replace: true });
  }, [filters, startDate, startTime, endDate, endTime, navigate, location.search]);

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
      if (!startDate && !endDate) {
        return true;
      }

      // Convert the change's date and the filter dates to Date objects
      //debugger
      const changeDate = new Date(change.merged_at);

      const [startYear, startMonth, startDay] = startDate.split("-");
      const [endYear, endMonth, endDay] = endDate.split("-");

      //const start = startDate ? new Date(startDate) : null;
      //const end = endDate ? new Date(endDate) : null;

      const start = new Date(`${startMonth}/${startDay}/${startYear}`);
      const end = new Date(`${endMonth}/-${endDay}/${endYear}`);

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      if (startTime) {
        start.setHours(startHour, startMinute);
      }
      else {
        start.setHours(0, 0);
      }

      if (endTime) {
        end.setHours(endHour, endMinute);
      }
      else {
        end.setHours(23, 59);
      }

      // Check if the change date is within the range
      //const isWithinRange =
      //  (!start || changeDate >= start) && (!end || changeDate <= end);

      const isWithinRange = changeDate >= start && changeDate <= end;
      console.log(changeDate, start, end);

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
            <Grid item>
              <FormGroup>
                <FormControlLabel control={<Switch />} label="UTC" />
              </FormGroup>
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
