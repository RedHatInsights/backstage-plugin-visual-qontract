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
import { useNavigate, useLocation } from 'react-router-dom'; // Updated import

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
  onClick,
}: {
  items: string[];
  onClick: (item: string) => void;
}) => (
  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
    {items.map(item => {
      if (!item) return null;
      const normalizedItem = item.trim();
      const bgColor = stringToColor(normalizedItem);
      const textColor = getTextColor(bgColor);
      return (
        <span
          key={normalizedItem}
          onClick={() => onClick(normalizedItem)}
          style={{
            backgroundColor: bgColor,
            color: textColor,
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8em',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          {normalizedItem}
        </span>
      );
    })}
  </div>
);

const ActiveFilterPills = ({
  filters,
  onRemove,
  onClearAll,
}: {
  filters: string[];
  onRemove: (item: string) => void;
  onClearAll: () => void;
}) => (
  <div style={{ marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
    {filters.map(filter => (
      <span
        key={filter}
        onClick={() => onRemove(filter)}
        style={{
          backgroundColor: stringToColor(filter),
          color: getTextColor(stringToColor(filter)),
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.8em',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        {filter} &times;
      </span>
    ))}
    {filters.length > 0 && (
      <button onClick={onClearAll} style={{ marginLeft: '10px' }}>
        Clear All Filters
      </button>
    )}
  </div>
);

export const DenseTable = ({ changes }: DenseTableProps) => {
  const [filters, setFilters] = useState<string[]>([]);
  const navigate = useNavigate(); 
  const location = useLocation();

  // Function to update URL with current filters
  const updateQueryString = (filters: string[]) => {
    const queryParams = new URLSearchParams(location.search);
    if (filters.length > 0) {
      queryParams.set('filters', filters.join(','));
    } else {
      queryParams.delete('filters');
    }
    navigate({ search: queryParams.toString() }, { replace: true });
  };

  // Add filter and update URL
  const addFilter = (filter: string) => {
    const normalizedFilter = filter.trim();
    setFilters(prevFilters =>
      prevFilters.includes(normalizedFilter) ? prevFilters : [...prevFilters, normalizedFilter],
    );
  };

  // Remove filter and update URL
  const removeFilter = (filter: string) => {
    const normalizedFilter = filter.trim();
    setFilters(prevFilters => prevFilters.filter(f => f !== normalizedFilter));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters([]);
  };

  // Sync filters with URL on load and when filters change
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filtersFromQuery = queryParams.get('filters');
    if (filtersFromQuery) {
      setFilters(filtersFromQuery.split(',').map(f => f.trim()));
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
        <PillList items={rowData.change_types} onClick={addFilter} />
      ),
    },
    {
      title: 'Apps',
      field: 'apps',
      render: rowData => (
        <PillList items={rowData.apps} onClick={addFilter} />
      ),
    },
  ];

  const filteredData = filters.length > 0
    ? changes.filter(change =>
        filters.every(filter =>
          (change.change_types || []).some(type => type.trim() === filter) ||
          (change.apps || []).some(app => app.trim() === filter)
        )
      )
    : changes;

  return (
    <div>
      <ActiveFilterPills filters={filters} onRemove={removeFilter} onClearAll={clearAllFilters} />

      <Table
        options={{ search: true, paging: true, pageSize: 10 }}
        columns={columns}
        data={filteredData}
      />
    </div>
  );
};

export const ChangelogFetchComponent = () => {
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<Change[]> => {
    const response = await fetch(
      `${config.getString('backend.baseUrl')}/api/proxy/inscope-resources/resources/json/change-log.json`,
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