import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import {
  Page,
  Content,
  Link,
  Table,
  TableColumn,
  Progress,
} from '@backstage/core-components';
import {
  useApi,
  fetchApiRef,
  configApiRef
} from '@backstage/core-plugin-api';
import { PillList } from '../ChangelogFetchComponent/PillList';

export function QueueTable({
  markdown,
  title,
  columns,
}: {
  markdown: string;
  title: string;
  columns?: TableColumn[];
}) {
  const [error, setError] = useState(false);
  const [tableData, setTableData] = useState<Array<object> | null>(null);
  const fetchApi = useApi(fetchApiRef);
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');


  useEffect(() => {
    fetchMergeQ();
  }, []);

  const fetchMergeQ = async () => {
    try {
      const response = await fetchApi.fetch(`${backendUrl}/api/proxy/mergeq/${markdown}`);
      if (!response.ok) {
        throw new Error('Failed to fetch the Markdown file');
      }


      const text = await response.text();
      const parsedData = parseMarkdownTable(text);
      setTableData(parsedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(true);
    }
  };

  // I hate this, but I couldn't find a small, modern library to parse markdown tables
  // into JSON. This is a simple implementation that works for our use case.
  const parseMarkdownTable = (markdown: string): Array<object> => {
    const lines = markdown.trim().split('\n');
    const headers = lines[0]
      .replace(/^\||\|$/g, '')
      .split('|')
      .map(h => h.trim().toLocaleLowerCase());
    const rows = lines.slice(2); // Skip headers and separator line

    return rows.map(row => {
      const cells = row
        .replace(/^\||\|$/g, '')
        .split('|')
        .map(cell => cell.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = cells[index];
        return obj;
      }, {} as { [key: string]: string });
    });
  };

  if (error) {
    return (
      <Page themeId="tool">
        <Content>
          <Typography variant="body1" color="error">
            Failed to load the Merge Queue data. Please try again later.
          </Typography>
        </Content>
      </Page>
    );
  }

  // Define columns explicitly
  const defaultColumns: TableColumn[] = [
    {
      title: 'Title',
      field: 'title',
      render: (row: any) => {
        // Extract the display text and URL from markdown-style link format
        const match = row.id.match(/\[(.*?)\]\((.*?)\)/);
        const url = match ? match[2] : '#';

        return (
          <Link to={url} target="_blank" rel="noopener noreferrer">
            {row.title}
          </Link>
        );
      },
    },
    {
      title: 'Author',
      field: 'author',
      render: (row: any) => <Typography>{row.author}</Typography>,
    },
    {
      title: 'Updated At',
      field: 'updated_at',
      render: (row: any) => {
        try {
          const date = new Date(row.updated_at);
          return new Intl.DateTimeFormat('default', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
          }).format(date);
        } catch (e) {
          return row.updated_at;
        }
      },
    },
    {
      title: 'Labels',
      field: 'labels',
      render: (row: any) => (
        <PillList
          items={row.labels.split(',')}
          field="label"
          clickable={false}
          onClick={() => {}}
        />
      ),
    },
  ];

  // We allow passing in custom columns, but default to the ones above
  // This is so we can handle different payloads
  if (!columns) {
    columns = defaultColumns;
  }

  return tableData ? (
    <Table
      title={title}
      columns={columns}
      data={tableData}
      options={{
        showTitle: true,
        search: false,
        paging: false,
        toolbar: true,
      }}
    />
  ) : (
    <Progress />
  );
}
