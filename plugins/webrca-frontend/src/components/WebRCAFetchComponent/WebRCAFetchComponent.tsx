import React from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useApi, configApiRef, fetchApiRef} from '@backstage/core-plugin-api';
import '@backstage/plugin-user-settings';
import { Typography } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';

interface DenseTableProps {
  incidents?: IncidentList;
  web_rca_url?: string;
  message?: string;
}

interface Incident {
  id?: string;
  kind?: string;
  href?: string;
  incident_id?: string;
  summary?: string;
  description?: string;
}
// jq '{kind, page, size, total, items: [.items[] | {id, kind, href, incident_id, summary, description}]}'
interface IncidentList {
  kind: 'IncidentList';
  page?: number;
  size?: number;
  total?: number;
  items?: Incident[];
  errorMsg?: string;
}

export const DenseTable = ({
  incidents,
  web_rca_url,
  message,
}: DenseTableProps) => {
  if (message) {
    return (
      <InfoCard title="Web RCA Incidents">
        <Typography variant="body1">{"Error fetching incidents: " + message }</Typography>
      </InfoCard>
    );
  }

  if (!incidents || !incidents.items || incidents.items.length === 0) {
    return (
      <InfoCard title="Web RCA Incidents">
        <Typography variant="body1">"Error fetching incidents: No Incidents"</Typography>
      </InfoCard>
    );
  }

  if (!incidents || !incidents.items || incidents.items.length === 0) {
    return (
      <InfoCard title="Web RCA Incidents">
        <Typography variant="body1">{"Error fetching incidents: " + message }</Typography>
      </InfoCard>
    );
  }


  const columns: TableColumn[] = [
    { title: 'ID', field: 'incident_id' },
    { title: 'Summary', field: 'summary' },
    { title: 'Description', field: 'description' },
  ];

  const data = incidents.items.map(inc => {
    return {
      incident_id: (
        <a
          target="_blank"
          rel="noreferrer"
          href={`${web_rca_url}/incident/${inc.incident_id}/details`}
        >
          {inc.incident_id}
        </a>
      ),
      summary: inc.summary,
      description: inc.description,
    };
  });

  return (
    <Table
      title="Web RCA Incidents"
      options={{ search: true, paging: true, pageSize: 10 }}
      columns={columns}
      data={data}
    />
  );
};

const PRODUCT_ANNOTATION_KEY = 'web-rca/product-name';

export const WebRCAFetchComponent = () => {
  const config = useApi(configApiRef);
  // const user = useApi(identityApiRef);
  const entity = useEntity();

  const fetchApi = useApi(fetchApiRef);

  const { value, loading, error } = useAsync(async (): Promise<
    IncidentList | string
  > => {
      // TODO: Should we limit to owner/mine?

      let products = '';

      if (entity) {
        // Default to entity name
        products = entity.entity.metadata.name;

        // Overwrite name with system, if it exists
        if (entity.entity.spec && entity.entity.spec.system && typeof(entity.entity.spec.system) === 'string') {
          products = entity.entity.spec.system;
        }

        // Overwrite name with custom annotation, if it exists
        if (entity.entity.metadata.annotations && PRODUCT_ANNOTATION_KEY in entity.entity.metadata.annotations) {
          products = entity.entity.metadata.annotations[PRODUCT_ANNOTATION_KEY];
        }
      }

      if (products === '') {
        return 'No product based on entity';
      }


      let incidentList = await fetchApi.fetch(
        `${config.getString('backend.baseUrl')}/api/plugin-web-rca-backend/incidents`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({products: products}),
        },
      ).catch(e => e)
       .then(resp => resp.json());

      return incidentList as Promise<IncidentList>;
    }, []);

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ResponseErrorPanel error={error} />;
  }
  if (!value) {
    return (
      <ResponseErrorPanel
        error={{
          name: 'Foo',
          message: 'Foo',
        }}
      />
    );
  }
  
  if (typeof value === 'string') {
    return (
      <DenseTable
        message={value}
        web_rca_url={config.getString('ocm.webRcaUIUrl')}
      />
    );
  }

  return (
    <DenseTable
      incidents={value}
      web_rca_url={config.getString('ocm.webRcaUIUrl')}
    />
  );
};
