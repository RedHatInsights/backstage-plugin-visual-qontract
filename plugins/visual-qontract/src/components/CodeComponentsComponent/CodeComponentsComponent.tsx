import React from 'react';
import {
  Typography,
  Link,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Paper,
  Box,
} from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { CodeComponentsQuery } from './query';
import { RELATION_HAS_PART } from '@backstage/catalog-model';
import { useEntity, useRelatedEntities } from '@backstage/plugin-catalog-react';
import GitHubIcon from '@material-ui/icons/GitHub';

import QueryQontract from '../../common/QueryAppInterface';
import Icon from '@mdi/react';
import { mdiGitlab } from '@mdi/js';
import { mdiApplicationExport } from '@mdi/js';

export const CodeComponentsComponent = () => {
  const title = 'Code Repos & Build Jobs';

  const { entity } = useEntity();

  const {
    entities: relatedEntities,
    loading: relatedEntitiesLoading,
    error: relatedEntitiesError,
  } = useRelatedEntities(entity, {
    type: RELATION_HAS_PART,
    kind: 'Component',
  });

  const {
    result: qontractResult,
    loaded: qontractLoaded,
    error: qontractError,
  } = QueryQontract(CodeComponentsQuery);

  if (relatedEntitiesError || qontractError) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">
          Error loading the {title} information.
        </Typography>
      </InfoCard>
    );
  }

  if (relatedEntitiesLoading || !qontractLoaded) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">
          Loading...
        </Typography>
      </InfoCard>
    );
  }

  if (
    qontractResult.apps_v1.length === 0 ||
    qontractResult.apps_v1[0].codeComponents.length === 0
  ) {
    return null
  }

  const CodeComponentsTable = () => {
    // For each code component, try to locate a child entity which has a matching source code URL.
    // If a match is found, use that entity's 'image-build-url' annotation value if defined

    if (!qontractResult.apps_v1[0].codeComponents) {
      return (
        <InfoCard title={title}>
          <Typography align="center" variant="body1">
            No {title} found.
          </Typography>
        </InfoCard>
      );
    }

    if (relatedEntities) {
      for (var component of qontractResult.apps_v1[0].codeComponents) {
        for (var relatedEntity of relatedEntities) {
          if (
            relatedEntity.metadata.annotations?.[
              'backstage.io/source-location'
            ] == `url:${component.url}`
          ) {
            var annotationBuildUrl =
              relatedEntity.metadata.annotations?.[
                'visual-qontract/image-build-url'
              ];
            if (annotationBuildUrl) {
              component.imageBuildUrl = annotationBuildUrl;
            }
          }
        }
      }
    }

    const RepoIcon = (props: any) => {
      if (props.url.includes('github.com')) {
        return <GitHubIcon />;
      } else {
        return <Icon path={mdiGitlab} size={1} />;
      }
    };

    const getLastPathSegment = (url: string) => {
      try {
        if (!url.includes('/')) {
          return url;
        }
        const segments = url.split('/');
        return segments[segments.length - 1] || url;
      } catch (error) {
        console.error('Error processing URL:', error);
        return url;
      }
    };

    const RepoTableCell = (props: any) => {
      const { component } = props;
      return (
        <TableCell scope="row">
          <Box display="flex" alignItems="center">
            <RepoIcon url={component.url} />
            <Box ml={1}>
              <Link target="_blank" href={component.url}>
                {component.name}
              </Link>
            </Box>
          </Box>
        </TableCell>
      );
    };

    const CodeComponentsTable = (props: any) => {
      const { component } = props;
      if (!component.imageBuildUrl) {
        return <TableCell></TableCell>;
      }
      return (
        <TableCell align="center">
          <Box display="flex" alignItems="center">
            <Icon path={mdiApplicationExport} size={1} />
            <Box ml={1}>
              <Link target="_blank" href={component.imageBuildUrl}>
                {getLastPathSegment(component.imageBuildUrl)}
              </Link>
            </Box>
          </Box>
        </TableCell>
      );
    };

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="button">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="button">Build Job</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {qontractResult.apps_v1[0].codeComponents?.map(
              (component: any, key: any) => (
                <TableRow key={key}>
                  <RepoTableCell component={component} />
                  <CodeComponentsTable component={component} />
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <InfoCard title={title} noPadding>
      <CodeComponentsTable />
    </InfoCard>
  );
};
