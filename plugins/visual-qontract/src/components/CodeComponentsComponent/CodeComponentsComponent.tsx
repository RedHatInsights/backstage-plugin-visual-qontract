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
import { RELATION_HAS_PART } from '@backstage/catalog-model';
import { useEntity, useRelatedEntities } from '@backstage/plugin-catalog-react';
import QueryQontract from '../../common/QueryAppInterface';


export const CodeComponentsComponent = () => {
    const title = "Code Repositories"

    const { entity } = useEntity();

    const { entities: relatedEntities, loading: relatedEntitiesLoading, error: relatedEntitiesError } = useRelatedEntities(entity, {
        type: RELATION_HAS_PART,
        kind: "Component"
    });

    const { result: qontractResult, loaded: qontractLoaded, error: qontractError } = QueryQontract(CodeComponentsQuery);

    if (relatedEntitiesError || qontractError) {
        return <InfoCard title={title}>
            <Typography align="center" variant="body1">
                Error loading the {title} information.
            </Typography>
        </InfoCard>
    }

    if (relatedEntitiesLoading || !qontractLoaded) {
        return <InfoCard title={title}>
            <Typography align="center" variant="body1">
                Loading...
            </Typography>
        </InfoCard>
    }

    if (qontractResult.apps_v1.length === 0 || qontractResult.apps_v1[0].codeComponents.length === 0 ) {
        return (
          <InfoCard title={title}>
            <Typography align="center" variant="body1">No {title} found.</Typography>
          </InfoCard>
        );
    }

    const CodeComponentsTable = () => {
        // For each code component, try to locate a child entity which has a matching source code URL.
        // If a match is found, use that entity's 'image-build-url' annotation value if defined

        if ( !qontractResult.apps_v1[0].codeComponents) {
            return (
                <InfoCard title={title}>
                    <Typography align="center" variant="body1">No {title} found.</Typography>
                </InfoCard>
            );
        }

        if (relatedEntities) {
            for (var component of qontractResult.apps_v1[0].codeComponents) {
                for (var relatedEntity of relatedEntities) {
                    if (relatedEntity.metadata.annotations?.["backstage.io/source-location"] == `url:${component.url}`) {
                        var annotationBuildUrl = relatedEntity.metadata.annotations?.["visual-qontract/image-build-url"]
                        if (annotationBuildUrl) {
                            component.imageBuildUrl = annotationBuildUrl
                        }
                    }
                }
            }
        }

        return  <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="button">Name</Typography></TableCell>
                            <TableCell align="center"><Typography variant="button">Build Job</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {qontractResult.apps_v1[0].codeComponents?.map((component: any, key: any) => (
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

    return <InfoCard title={title} noPadding>
            <CodeComponentsTable />
    </InfoCard>
}
