import React, { useEffect } from 'react';
import {
  Typography,
  Grid,
  Link,
  Table,
  TableRow,
  TableCell,
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
      if (result.apps_v1.length === 0) {
        return;
      }
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
        const title = target.namespace.environment.name;
        //ensure no duplicates by title
        if (!urls.find((u: { title: any }) => u.title === title)) {
         urls.push({ url, title });
        }
      }
    }
    return urls;
  };

  const SaasFileLabel = ({ name, path }: { name: string; path: string }) => {
    return (
      <Grid>
        <Grid item>
          <Typography variant="overline">SaaS File</Typography>
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

  const PipelineHeader = ({ pipeline }: { pipeline: any }) => {
    return (
      <Grid container direction="row">
        <Grid item xs={4}>
          <Typography variant="button">{pipeline.name}</Typography>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={4}>
          <SaasFileLabel name={pipeline.name} path={pipeline.path} />
        </Grid>
        <Grid item xs={2}>
          <PipelineProvider provider={pipeline.pipelinesProvider.provider} />
        </Grid>
      </Grid>
    );
  };

  const PipelineBody = ({ pipeline }: { pipeline: any }) => {
    return (
      <Table size="small" >
        {makePipelineURLs(pipeline).map((url: any) => (
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">
                <Link target="_blank" href={url.url}>
                  {url.title}
                </Link>
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    );
  };

  const PipelinesAccordian = () => {
    return (
      <React.Fragment>
        {filteredPipelines.map((pipeline: any, key: any) => (
          <Accordion>
            <AccordionSummary
              key={`${key}-summary`}
              expandIcon={<ExpandMoreIcon />}
            >
              <PipelineHeader pipeline={pipeline} />
            </AccordionSummary>
            <AccordionDetails key={`${key}-details`} style={{ padding: '0px' }}>
              <PipelineBody pipeline={pipeline} />
            </AccordionDetails>
          </Accordion>
        ))}
      </React.Fragment>
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

  if (filteredPipelines.length === 0  ) {
    return null
  }

  return (
    <InfoCard title={title} noPadding>
      <PipelinesAccordian />
    </InfoCard>
  );
};
