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
import QueryQontract from '../../common/QueryAppInterface';

export const CodeComponentsComponent = () => {

    const { result, loaded, error } = QueryQontract(CodeComponentsQuery)

    const title = "Code Repositories"

    const CodeComponentsTable = () => {
        return  <TableContainer component={Paper} >
                <Table size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="button">Name</Typography></TableCell>
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
    }

    if (error) {
        return <InfoCard title={title}>
            <Typography align="center" variant="body1">
                Error loading the {title} information.
            </Typography>
        </InfoCard>
    }

    if (!loaded) {
        return <InfoCard title={title}>
            <Typography align="center" variant="body1">
                Loading...
            </Typography>
        </InfoCard>

    }

    if (result.apps_v1.length === 0 || result.apps_v1[0].codeComponents.length === 0) {
        return (
          <InfoCard title={title}>
            <Typography align="center" variant="body1">No {title} found.</Typography>
          </InfoCard>
        );
      }

    return <InfoCard title={title} noPadding>
            <CodeComponentsTable />
    </InfoCard>
}
