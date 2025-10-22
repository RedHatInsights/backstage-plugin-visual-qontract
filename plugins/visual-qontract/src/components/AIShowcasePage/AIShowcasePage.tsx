import React, { useEffect, useState } from 'react';
import {
  Page,
  Header,
  Content,
  Table,
  TableColumn,
  Progress,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

const columns: TableColumn<Entity>[] = [
  { title: 'Name', field: 'metadata.name' },
  { title: 'Kind', field: 'kind' },
  { title: 'Namespace', field: 'metadata.namespace' },
  { title: 'Description', field: 'metadata.description' },
];

export function AIShowcasePage() {
  const catalogApi = useApi(catalogApiRef);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await catalogApi.getEntities({
          filter: { 'metadata.namespace': 'ai' },
        });
        setEntities(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching entities');
        console.error('Error fetching entities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [catalogApi]);

  return (
    <Page themeId="tool">
      <Header title="AI Showcase" subtitle="AI-powered features and demonstrations" />
      <Content>
        {loading && <Progress />}
        {error && <div>Error: {error}</div>}
        {!loading && !error && (
          <Table
            title="AI Namespace Entities"
            options={{ search: true, paging: true, pageSize: 10 }}
            columns={columns}
            data={entities}
          />
        )}
      </Content>
    </Page>
  );
}

