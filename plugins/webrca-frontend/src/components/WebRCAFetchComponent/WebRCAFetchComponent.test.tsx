import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { WebRCAFetchComponent } from './WebRCAFetchComponent';
import { TestApiProvider } from '@backstage/test-utils';
import { configApiRef, fetchApiRef } from '@backstage/core-plugin-api';

//mock config
const mockConfig = {
  getString: (key: string) => {
    if (key === 'backend.baseUrl') {
      return 'http://localhost:3000';
    }
    if (key === 'ocm.webRcaUIUrl') {
      return 'http://localhost:3000';
    }
    throw new Error(`Missing required config value at '${key}'`);
  },
  getOptionalString: (key: string) => {
    if (key === 'app.baseUrl') {
      return 'http://localhost:3000';
    }
    return undefined;
  },
};

const mockFetchApi = {
  fetch: jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      kind: 'IncidentList',
      page: 1,
      size: 1,
      total: 1,
      items: [
        { id: "123456",
          kind: "Incident",
          href: "www.nin.com",
          incident_id: "123456",
          summary: "Site down",
          description: "No good"}
      ],
    }),
  }),
};

//mock useEntity
jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useEntity: jest.fn().mockReturnValue({
    entity: {
      metadata: {
        name: 'ziggy',
        namespace: 'default',
        title: 'Ziggy',
        description: 'My big smelly dog',
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'team-ziggy',
        system: 'ziggy',
      },
    },
  }),
}));

describe('Web RCA Fetch Component', () => {
  it('renders the user table', async () => {
    render(
      <TestApiProvider
        apis={[
          [configApiRef, mockConfig],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        <WebRCAFetchComponent />
      </TestApiProvider>,
    );

    //Expect a progress bar by looking for the word progress
    await waitFor(() => {
      console.log(document.body.innerHTML);
      expect(screen.getByText('Web RCA Incidents')).toBeInTheDocument();
      expect(screen.getByText('123456')).toBeInTheDocument();
    });
  });
});
