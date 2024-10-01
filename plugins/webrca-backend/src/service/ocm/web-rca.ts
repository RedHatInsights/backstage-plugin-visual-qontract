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

export async function listIncidents(url: string, token: string, product_id: string): Promise<IncidentList> {
    // TODO: Filter by status?  Add a toggle?
    return fetch(
      `${url}/api/proxy/web-rca/incidents?product_id=${product_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    ).catch(e => e)
    .then(resp => resp.json()) as Promise<IncidentList>;
}

export async function listPublicIncidents(url: string, token: string): Promise<IncidentList> {
  // TODO: Filter by status?  Add a toggle?
  return fetch(
    `${url}/api/proxy/web-rca/incidents?status=ongoing&invalid=false&public=true&order_by=created_at desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  ).catch(e => e)
  .then(resp => resp.json()) as Promise<IncidentList>;
}