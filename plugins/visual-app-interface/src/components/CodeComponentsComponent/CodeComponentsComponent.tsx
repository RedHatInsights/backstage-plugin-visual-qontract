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
import { CodeComponentsQuery } from './query';
import QueryAppInterface from '../../common/QueryAppInterface';

export const CodeComponentsComponent = () => {

    const { result, loaded, error } = QueryAppInterface(CodeComponentsQuery)

    const title = "Code Repositories"

    const CodeComponentsTable = () => {
        return <Grid item>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {result.apps_v1[0].codeComponents.map((component: any, key: any) => (
                            <TableRow key={key}>
                                <TableCell>
                                    <Link target="_blank" href={component.url}>
                                        {component.name}
                                    </Link>
                                </TableCell>
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
            <CodeComponentsTable />
        </Grid>
    </InfoCard>
}
