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
import { DepsQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';

export const DependenciesComponent = () => {

    const {result, loaded, error} = QueryQontract(DepsQuery)

    const title = "Dependencies"

    const DependencyTable = () => {
        return <Grid item>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Status Page</TableCell>
                            <TableCell>SLO</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {result.apps_v1[0].dependencies.map((dependency: any) => (
                            <TableRow key={dependency.path}>
                                <TableCell>{dependency.name}</TableCell>
                                <TableCell>
                                    <Link target="_blank" href={dependency.statusPage}>
                                        {dependency.statusPage}
                                    </Link>
                                </TableCell>
                                <TableCell>{dependency.SLA}</TableCell>
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
                Error loading the dependency information.
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
            <DependencyTable />
        </Grid>
    </InfoCard>
}
