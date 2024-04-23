import React from 'react';
import {
    Typography,
    Grid,
    Link,
    Table,
    TableContainer,
    TableRow,
    TableBody,
    TableHead,
    TableCell,
    Paper
} from '@material-ui/core';
import {
    InfoCard,
} from '@backstage/core-components';
import { NSQuery } from './query';
import QueryAppInterface from '../../common/QueryAppInterface';

export const NamespacesComponent = () => {

    const {result, loaded, error} = QueryAppInterface(NSQuery)

    const title = "Namespaces"

    const appInterfaceBaseURL = `https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/`

    const getAppInterfaceLink = (path: string) => {
        return `${appInterfaceBaseURL}${path}`
    }

    const NamespacesTable = () => {
        return <Grid item>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Path</TableCell>
                            <TableCell>Cluster</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {result.apps_v1[0].namespaces.map((namespace: any, key: any) => (
                            <TableRow key={key}>
                                <TableCell>{namespace.name}</TableCell>
                                <TableCell>
                                    <Link target="_blank" href={getAppInterfaceLink(namespace.path)}>
                                        {namespace.path}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link target="_blank" href={getAppInterfaceLink(namespace.cluster.path)}>
                                        {namespace.cluster.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{namespace.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    }

    if (error) {
        return <InfoCard title={title}>
            <Typography variant="body1">
                Error loading the {title} information.
            </Typography>
        </InfoCard>
    }

    if (!loaded) {
        return <InfoCard title={title}>
            <Typography variant="body1">
                Loading...
            </Typography>
        </InfoCard>

    }

    return <InfoCard title={title}>
        <Grid container spacing={3} direction="column">
            <NamespacesTable />
        </Grid>
    </InfoCard>
}
