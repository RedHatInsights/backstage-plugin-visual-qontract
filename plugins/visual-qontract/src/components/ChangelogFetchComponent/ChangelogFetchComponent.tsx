import React from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
// Import green checkmark and red X icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

type Change = {
  commit: string;
  merged_at: string; // TODO: Timezone
  change_types: string[];
  error: boolean;
  apps: string[];
};

type DenseTableProps = {
  changes: Change[];
};

// Helper function to calculate a color based on text content
const stringToColor = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 80%)`; // Soft background color
  return color;
};

// Helper function to check text color contrast
const getTextColor = (bgColor: string) => {
  const [h, s, l] = bgColor.match(/\d+/g)!.map(Number);
  return l > 60 ? 'black' : 'white'; // Dark text for light backgrounds, white for darker
};

// Reusable component to render a list of pills
const PillList = ({ items }: { items: string[] }) => (
  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
    {items.map(item => {
      const bgColor = stringToColor(item);
      const textColor = getTextColor(bgColor);
      return (
        <span
          key={item}
          style={{
            backgroundColor: bgColor,
            color: textColor,
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8em',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {item}
        </span>
      );
    })}
  </div>
);

export const DenseTable = ({ changes }: DenseTableProps) => {
  const columns: TableColumn[] = [
    {
      title: 'Commit',
      field: 'commit',
      render: rowData => (
        <a
          href={`https://gitlab.cee.redhat.com/service/app-interface/-/commit/${rowData.commit}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#007bff', // Link color
            textDecoration: 'underline', // Underline for link
          }}
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
        rowData.error === false ?  (
          <CheckCircleIcon color="primary" data-testid="change-succeeded-icon" aria-label="Change succeeded" />
        ) : (
          <CancelIcon color="error" data-testid="change-failed-icon" aria-label="Change failed" />
        ),
    },
    {
      title: 'Change Types',
      field: 'change_types',
      render: rowData => <PillList items={rowData.change_types.split(',')} />,
    },
    {
      title: 'Apps',
      field: 'apps',
      render: rowData => <PillList items={rowData.apps.split(',')} />,
    },
  ];

  const data = changes.map(change => ({
    ...change,
    change_types: change.change_types.join(', '),
    apps: change.apps.join(', '),
  }));

  return (
    <Table
      options={{ search: false, paging: true, pageSize: 10 }}
      columns={columns}
      data={data}
    />
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
