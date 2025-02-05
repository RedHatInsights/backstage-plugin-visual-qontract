import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  useApi,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

const QueryQontract = (query: string, path?: string) => {
  type QontractApp = Record<string, any>;

  // Get Backstage objects
  const config = useApi(configApiRef);
  const { entity } = useEntity();

  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/visual-qontract/graphql`;

  const identityApi = useApi(identityApiRef);

  const [result, setResult] = useState<QontractApp>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // Function to get the app interface path
  const getQontractPath = () => {
    if (path) {
      return path;
    }

    // use 'visual-qontract/app-path' annotation if defined on the entity
    const appPath = entity?.metadata?.annotations?.['visual-qontract/app-path'];
    if (appPath) {
      return appPath;
    }

    // otherwise fall back to making an educated guess at this entity's app path
    const platform = entity?.metadata?.labels?.platform;
    const service = entity?.metadata?.labels?.service;
    return `/services/${platform}/${service}/app.yml`;
  };

  const getQontractData = async () => {
    const variables = { path: getQontractPath() };
    const { token } = await identityApi.getCredentials();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    request(proxyUrl, query, variables, headers)
      .then((data: any) => {
        setLoaded(true);
        setResult(data);
      })
      .catch(_error => {
        setError(true);
      });
  };

  // Get the qontract data on load
  useEffect(() => {
    getQontractData();
  }, []);

  return { result, loaded, error };
};

export default QueryQontract;
