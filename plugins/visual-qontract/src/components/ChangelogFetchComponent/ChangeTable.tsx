import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
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
  const [utcStartDate, setUtcStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [utcEndDate, setUtcEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showUtcTimestamps, setShowUtcTimestamps] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function retrieveFilteringBounds() {
    // Date picker component emits datetime in YYYY-MM-DD format
    // by default; to maintain the proper locale, convert this datetime
    // format to MM-DD-YYYY
    const [startYear, startMonth, startDay] = startDate.split("-");
    const [endYear, endMonth, endDay] = endDate.split("-");

    const start = new Date(`${startMonth}/${startDay}/${startYear}`);
    const end = new Date(`${endMonth}/${endDay}/${endYear}`);

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

    return { start, end };
  }

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

      if (!startTime) {
        setStartTime("00:00");
      }
    } else {
      queryParams.delete('startDate');
    }

    if (utcStartDate) {
      const utcDate = new Date(utcStartDate);

      // If the entered UTC start date is invalid, do not update
      // the local start date field or the associated
      // search parameters
      if (!isNaN(utcDate.getTime())) {
        const formattedDate = `${utcDate.getFullYear()}-${String(utcDate.getMonth() + 1).padStart(2, '0')}-${String(utcDate.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(utcDate.getHours()).padStart(2, '0')}:${String(utcDate.getMinutes()).padStart(2, '0')}`;

        setStartDate(formattedDate);
        setStartTime(formattedTime);
      }
    }
    else {
      queryParams.delete('startDate');
      queryParams.delete('startTime');
    }

    if (startTime) {
      queryParams.set('startTime', startTime);
    } else {
      queryParams.delete('startTime');
    }

    if (endDate) {
      queryParams.set('endDate', endDate);

      if (!endTime) {
        setEndTime("23:59");
      }
    } else {
      queryParams.delete('endDate');
    }

    if (utcEndDate) {
      const utcDate = new Date(utcEndDate);

      // If the entered UTC end date is invalid, do not
      // update the local end date field oe the associated
      // search parameters
      if (!isNaN(utcDate.getTime())) {

        const formattedDate = `${utcDate.getFullYear()}-${String(utcDate.getMonth() + 1).padStart(2, '0')}-${String(utcDate.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(utcDate.getHours()).padStart(2, '0')}:${String(utcDate.getMinutes()).padStart(2, '0')}`;

        setEndDate(formattedDate);
        setEndTime(formattedTime);
      }
    }
    else {
      queryParams.delete('endDate');
      queryParams.delete('endTime');
    }


    if (endTime) {
      queryParams.set('endTime', endTime);
    } else {
      queryParams.delete('endTime');
    }

    navigate({ search: queryParams.toString() }, { replace: true });
  }, [filters, startDate, utcStartDate, startTime, endDate, utcEndDate, endTime, navigate, location.search]);

  useEffect(() => {
    if (!startDate && !endDate) {
      return;
    }

    if (showUtcTimestamps) {
      const { start, end } = retrieveFilteringBounds();

      setUtcStartDate(start.toISOString());
      setUtcEndDate(end.toISOString());
    }
  }, [showUtcTimestamps])

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
      if (showUtcTimestamps) {
        if (!utcStartDate && !utcEndDate) {
          return true;
        }

        const changeDate = new Date(change.merged_at);
        return changeDate >= new Date(utcStartDate) && changeDate <= new Date(utcEndDate);
      }

      // If the start and end dates are not specified,
      // filter out no changelogs
      if (!startDate && !endDate) {
        return true;
      }

      // Convert the change's date and the filter dates to Date objects
      //debugger
      const changeDate = new Date(change.merged_at);
      const { start, end } = retrieveFilteringBounds();
      return changeDate >= start && changeDate <= end;
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
                utcStartDate={utcStartDate}
                startTime={startTime}
                setStartDate={setStartDate}
                setUtcStartDate={setUtcStartDate}
                setStartTime={setStartTime}
                endDate={endDate}
                utcEndDate={utcEndDate}
                endTime={endTime}
                setEndTime={setEndTime}
                setEndDate={setEndDate}
                setUtcEndDate={setUtcEndDate}
                showUtcTimestamps={showUtcTimestamps}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid >
      <Grid item xs={9}>
        <Table
          title={
            <>
              <Typography variant="h5" component="h2">Changelog</Typography>
              <Grid style={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                display: 'flex',
                marginRight: "20px"
              }}
                justifyContent="center" alignItems="center" xs={2}>
                <Button variant={showUtcTimestamps ? "text" : "contained"} onClick={() => setShowUtcTimestamps(false)}>Local</Button>
                <Button variant={showUtcTimestamps ? "contained" : "text"} onClick={() => setShowUtcTimestamps(true)}>UTC</Button>
              </Grid>
            </>
          }
          options={{ search: false, paging: true, pageSize: 10 }}
          columns={ColumnDefinitions(addFilter, showUtcTimestamps)}
          data={filteredData}
        />
      </Grid>
    </Grid >
  );
};
