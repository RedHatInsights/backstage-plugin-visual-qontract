import React, { useState, useEffect } from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

type Change = {
  commit: string;
  merged_at: string;
  change_types: string[];
  error: boolean;
  apps: string[];
};

type DenseTableProps = {
  changes: Change[];
};

const stringToColor = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 80%)`;
};

const getTextColor = (bgColor: string) => {
  const [h, s, l] = bgColor.match(/\d+/g)!.map(Number);
  return l > 60 ? 'black' : 'white';
};

const PillList = ({
  items,
  field,
  onClick,
  removable = false,
}: {
  items: string[];
  field: string;
  onClick: (field: string, item: string) => void;
  removable?: boolean;
}) => (
  <Box display="flex" flexWrap="wrap" gap={1}>
    {items.map(item => {
      if (!item) return null;
      const normalizedItem = item.trim();
      const bgColor = stringToColor(normalizedItem);
      const textColor = getTextColor(bgColor);
      return (
        <Box
          key={normalizedItem}
          sx={{
            backgroundColor: bgColor,
            color: textColor,
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8em',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            cursor: 'pointer', // Show hand cursor for clickable pills
          }}
          onClick={() => !removable && onClick(field, normalizedItem)} // Only add filter from table pills
        >
          <span>{normalizedItem}</span>
          {removable && (
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation(); // Prevent triggering parent onClick
                onClick(field, normalizedItem);
              }}
              sx={{ marginLeft: '4px', padding: 0, color: textColor }}
            >
              ×
            </IconButton>
          )}
        </Box>
      );
    })}
  </Box>
);

const ActiveFilterPills = ({
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
          <Typography variant="button" sx={{ fontWeight: 'bold' }}>
            Active Filters
          </Typography>
          <Button
            onClick={onClearAll}
            variant="outlined"
            size="small"
            style={{ marginLeft: 'auto' }}
          >
            Clear All Filters
          </Button>
        </Box>
      )}
      {hasAppFilters && (
        <Box mb={1}>
          <Typography variant="button" sx={{ fontWeight: 'bold' }}>
            Apps
          </Typography>
          <PillList
            items={filters
              .filter(filter => filter.field === 'app')
              .map(filter => filter.value)}
            field="app"
            onClick={(field, value) => onRemove({ field, value })}
            removable
          />
        </Box>
      )}
      {hasTypeFilters && (
        <Box mb={1}>
          <Typography variant="button" sx={{ fontWeight: 'bold' }}>
            Change Types
          </Typography>
          <PillList
            items={filters
              .filter(filter => filter.field === 'type')
              .map(filter => filter.value)}
            field="type"
            onClick={(field, value) => onRemove({ field, value })}
            removable
          />
        </Box>
      )}
    </Box>
  );
};

export const DenseTable = ({ changes }: DenseTableProps) => {
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

export const ChangelogFetchComponent = () => {
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<Change[]> => {
    const response = await fetch(
      `${config.getString(
        'backend.baseUrl',
      )}/api/proxy/inscope-resources/resources/json/change-log.json`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const changes = await response.json();
    return changes.items;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable changes={value || []} />;
};
