import React from 'react';
import { TableColumn } from '@backstage/core-components';
import { PillList } from './PillList';

export const ColumnDefinitions = (
  addFilter: (field: string, value: string) => void,
  showUtcTimestamps: boolean
): TableColumn[] => [
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
          {rowData.description || rowData.commit}
        </a>
      ),
    },
    {
      title: 'Merged At',
      field: 'merged_at',
      render: rowData => {
        if (showUtcTimestamps) {
          return rowData.merged_at
        }
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
      title: 'Change Types',
      field: 'change_types',
      render: rowData => (
        <PillList items={rowData.change_types} field="type" onClick={addFilter} />
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
