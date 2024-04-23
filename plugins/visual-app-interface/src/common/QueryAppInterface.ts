import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const QueryAppInterface = (query: string) => {
    type AppInterfaceApp = Record<string, any>;

    // Get Backstage objects
    const config = useApi(configApiRef);
    const { entity } = useEntity();

    // Constants
    const backendUrl = config.getString('backend.baseUrl');
    const proxyUrl = `${backendUrl}/api/proxy/visual-app-interface/graphql`

    const [result, setResult] = useState<AppInterfaceApp>({});
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    // Function to get the app interface path
    const getAppInterfacePath = () => {
        const platform = entity?.metadata?.labels?.platform
        const service = entity?.metadata?.labels?.service
        return `/services/${platform}/${service}/app.yml`
    }

    // Get the app interface data on load
    useEffect(() => {
        const variables = { path: getAppInterfacePath() };
        request(proxyUrl, query, variables)
            .then((data: any) => {
                //Set the app info from data as a AppInterfaceApp
                setLoaded(true)
                setResult(data)
            })
            .catch((_error) => {
                setError(true)
            });
    }, []);

    return { result, loaded, error }
}

export default QueryAppInterface;