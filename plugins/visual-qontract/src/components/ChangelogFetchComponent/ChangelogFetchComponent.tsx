import React from 'react';
import {
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { Change } from './ChangeTypes';

import { ChangeTable } from './ChangeTable';


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

  return <ChangeTable changes={value || []} />;
};
