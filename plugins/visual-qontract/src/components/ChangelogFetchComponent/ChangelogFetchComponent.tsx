import React from 'react';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import {
  useApi,
  configApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { Change } from './ChangeTypes';
import { ChangeTable } from './ChangeTable';

export const ChangelogFetchComponent = () => {
  const config = useApi(configApiRef);
  const baseUrl = config.getString('backend.baseUrl');
  const fetchApi = useApi(fetchApiRef);

  const {
    value: changes,
    loading,
    error,
  } = useAsync(async () => {
    const response = await fetchApi.fetch(
      `${baseUrl}/api/proxy/inscope-resources/resources/json/change-log.json?timestamp=${Date.now()}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data.items as Change[];
  }, [config]);

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <ChangeTable changes={changes || []} />;
};
