// We're importing useState and useEffect from React for state and hooks
import React, { useState, useEffect } from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
    InfoCard,
    Header,
    Page,
    Content,
    ContentHeader,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
// These will let us get info about our backstage configuration
import { useApi, configApiRef } from '@backstage/core-plugin-api';

// A super generic type for the response from the backend
type HelloEntityResponse = Record<string, any>;

export function HelloEntityComponent() {
    const { entity } = useEntity();
    // Get the config object from backstage
    const config = useApi(configApiRef);

    // Set up some state for the response from the backend
    const [response, setResponse] = useState<HelloEntityResponse>({});

    // Get the backend URL from the config
    const backendUrl = config.getString('backend.baseUrl');

    // Fetch the hello entity data when the component loads
    useEffect(() => {
        fetchHelloEntity();
    }, []);

    // Function to fetch the hello entity data from the backend proxy
    const fetchHelloEntity = () => {
        // Notice we are constructing the URL with the backend URL we grabbed from the config
        fetch(`${backendUrl}/api/proxy/hello-entity/hello-${entity.metadata.name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ greeting: `${entity.metadata.name} (via the Internet)` }),
        })
            .then(response => response.json())
            .then(data => setResponse(data.json))
            .catch(_error => setResponse({ greeting: "Error" }));
    }

    // Function to read the app name from the response
    // If the response is not loaded yet, we'll show a loading message
    const getGreeting = () => {
        if (!response) {
            return 'Loading...';
        }
        return response.greeting
    }

    return <Page themeId="tool">
        <Header title="Hello World!" subtitle="Optional subtitle">
        </Header>
        <Content>
            <ContentHeader title="My Plugin Header">
            </ContentHeader>
            <Grid container spacing={3} direction="column">
                <Grid item>
                    <InfoCard title="My Plugin Card">
                        <Typography variant="body1">
                            Hello from {getGreeting()}!
                        </Typography>
                    </InfoCard>
                </Grid>
            </Grid>
        </Content>
    </Page>
}