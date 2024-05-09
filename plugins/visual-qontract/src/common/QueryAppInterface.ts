import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const QueryQontract = (query: string) => {
    type QontractApp = Record<string, any>;

    // Get Backstage objects
    const config = useApi(configApiRef);
    const { entity } = useEntity();

    // Constants
    const backendUrl = config.getString('backend.baseUrl');
    const proxyUrl = `${backendUrl}/api/proxy/visual-qontract/graphql`

    const [result, setResult] = useState<QontractApp>({});
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    // Function to get the app interface path
    const getQontractPath = () => {
        // use 'visual-qontract/app-path' annotation if defined on the entity
        const appPath = entity?.metadata?.annotations?.["visual-qontract/app-path"];
        if (appPath) {
             return appPath
        }

        // otherwise fall back to making an educated guess at this entity's app path
        const platform = entity?.metadata?.labels?.platform
        const service = entity?.metadata?.labels?.service
        return `/services/${platform}/${service}/app.yml`
    }

    // Get the qontract data on load
    useEffect(() => {
        const variables = { path: getQontractPath() };
        request(proxyUrl, query, variables)
            .then((data: any) => {
                setLoaded(true)
                setResult(data)
            })
            .catch((_error) => {
                setError(true)
            });
    }, []);

    return { result, loaded, error }
}

export default QueryQontract;