import React, { useEffect } from 'react';
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
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { InfoCard } from '@backstage/core-components';
import { PipelinesQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';

export const PipelinesComponent = () => {
  const { result, loaded, error } = QueryQontract(PipelinesQuery);
  const [filteredPipelines, setFilteredPipelines] = React.useState<any[]>([]);

  const title = 'Pipelines';

  useEffect(() => {
    if (result.saas_files_v2 && result.apps_v1) {
      const appName = result.apps_v1[0].name;
      const filtered = result.saas_files_v2.filter(
        (saas_file: any) => saas_file.app.name === appName,
      );
      setFilteredPipelines(filtered);
    }
  }, [result]);

  const appInterfaceBaseURL = `https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data`;

  const getAppInterfaceLink = (path: string) => {
    return `${appInterfaceBaseURL}${path}`;
  };

  //This is a remix of https://github.com/app-sre/visual-qontract/blob/master/src/pages/elements/Service.js#L74
  const makePipelineURLs = (saas_file: any) => {
    const pipeline_template_name = saas_file.pipelinesProvider.pipelineTemplates
      ? saas_file.pipelinesProvider.pipelineTemplates.openshiftSaasDeploy.name
      : saas_file.pipelinesProvider.defaults.pipelineTemplates
          .openshiftSaasDeploy.name;

    const pipeline_name = `o-${pipeline_template_name}-${saas_file.name}`;
    const pp_ns_name = saas_file.pipelinesProvider.namespace.name;
    const pp_cluster_console_url =
      saas_file.pipelinesProvider.namespace.cluster.consoleUrl;

    const urls: any[] = [];
    for (const template of saas_file.resourceTemplates) {
      for (const target of template.targets.filter(
        (t: { namespace: any }) => t.namespace,
      )) {
        const url = `${pp_cluster_console_url}/k8s/ns/${pp_ns_name}/tekton.dev~v1~Pipeline/${pipeline_name}`;
        urls.push({ url, title: target.namespace.environment.name });
      }
    }
    return urls;
  };

  const PipelinesTable = () => {
    return (
      <Grid item>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SaaS File</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Pipelines</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPipelines.map((pipeline: any, key: any) => (
                <TableRow key={key}>
                  <TableCell>
                    <Link
                      target="_blank"
                      href={getAppInterfaceLink(pipeline.path)}
                    >
                      {pipeline.name}
                    </Link>
                  </TableCell>
                  <TableCell>{pipeline.pipelinesProvider.provider}</TableCell>
                  <TableCell>
                    {makePipelineURLs(pipeline).map((url: any) => (
                      <Box>
                        <Link target="_blank" href={url.url}>
                          {url.title}
                        </Link>
                      </Box>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    );
  };

  const SaasFileLabel = ({ name, path }: { name: string; path: string }) => {
    return (
      <Grid>
        <Grid item>
          <Typography variant="overline">SaSS File</Typography>
        </Grid>
        <Grid item>
          <Link target="_blank" href={getAppInterfaceLink(path)}>
            {name}
          </Link>
        </Grid>
      </Grid>
    );
  };

  const PipelineProvider = ({ provider }: { provider: string }) => {
    return (
      <Grid>
        <Grid item>
          <Typography variant="overline">Provider</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">{provider}</Typography>
        </Grid>
      </Grid>
    );
  };

  const PipelinesAccordian = () => {
    return (
      <Grid item>
        {filteredPipelines.map((pipeline: any, key: any) => (
          <Accordion>
            <AccordionSummary key={`${key}-summary`} expandIcon={<ExpandMoreIcon />}>
                <Grid container direction="row">
                  <Grid item xs={4}>
                    <Typography variant="button">{pipeline.name}</Typography>
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={2}>
                    <SaasFileLabel name={pipeline.name} path={pipeline.path} />
                  </Grid>
                  <Grid item xs={2}>
                    <PipelineProvider
                      provider={pipeline.pipelinesProvider.provider}
                    />
                  </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails key={`${key}-details`}>
              <Grid container direction="column">
                <Grid item>
                  <Table>
                    {makePipelineURLs(pipeline).map((url: any) => (
                      <TableRow>
                        <TableCell>
                          <Link target="_blank" href={url.url}>
                            {url.title}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    );
  };

  if (error) {
    return (
      <InfoCard title={title}>
        <Typography variant="body1">
          Error loading the {title} information.
        </Typography>
      </InfoCard>
    );
  }

  if (!loaded) {
    return (
      <InfoCard title={title}>
        <Typography variant="body1">Loading...</Typography>
      </InfoCard>
    );
  }

  return (
    <InfoCard title={title}>
      <PipelinesAccordian />
    </InfoCard>
  );
};
