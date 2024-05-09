import React from 'react';
import {

    Typography,
    IconButton,
    Link,
    Table,
    TableContainer,
    TableRow,
    TableBody,
    TableHead,
    TableCell,
    Paper
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation'
import {
    InfoCard,
} from '@backstage/core-components';
import { CodeComponentsQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';


export const CodeComponentsComponent = () => {

    const { result, loaded, error } = QueryQontract(CodeComponentsQuery)

    const title = "Code Repositories"

    const CodeComponentsTable = () => {
        return  <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="button">Name</Typography></TableCell>
                            <TableCell align="center"><Typography variant="button">Build Job</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {result.apps_v1[0].codeComponents.map((component: any, key: any) => (
                            <TableRow key={key}>
                                <TableCell scope="row">
                                    <Link target="_blank" href={component.url}>
                                        {component.name}
                                    </Link>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton aria-label="go-to-build-job" size="small">
                                        {component.imageBuildUrl
                                            ? <Link target="_blank" href={component.imageBuildUrl}><ExitToAppIcon /></Link>
                                            : <NotListedLocationIcon />
                                        }
                                    </IconButton>
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
