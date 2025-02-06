import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { IncidentResponseCard } from './IncidentResponseCard';
import { configApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import {
  renderInTestApp,
  TestApiProvider,
} from '@backstage/frontend-test-utils';

const mockFetchApi = {
  fetch: jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      kind: 'IncidentList',
      total: 3,
      ok: true,
      code: 200,
      items: [
        { incident_id: '1', summary: 'Incident 1', severity: 'High' },
        { incident_id: '2', summary: 'Incident 2', severity: 'Medium' },
        { incident_id: '3', summary: 'Incident 3', severity: 'Low' },
      ],
    }),
  }),
};

const mockFailedFetchApi = {
  fetch: jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      kind: 'Error',
      total: 3,
      ok: false,
      code: 500,
      items: jest.fn().mockResolvedValue({}),
    }),
  }),
};

const mockFailedWebRCABackendFetchApi = {
  fetch: jest.fn().mockResolvedValue({
    ok: false,
    json: jest.fn().mockResolvedValue({
      kind: 'response',
      total: 3,
      ok: true,
      code: 200,
      json: jest
        .fn()
        .mockResolvedValue({
          error: { name: 'AuthenticationError', message: 'Illegal token' },
          request: {
            method: 'GET',
            url: '/api/proxy/web-rca/incidents?status=ongoing&invalid=false&public=true&order_by=created_at%20desc',
          },
          response: { statusCode: 401 },
        }),
    }),
  }),
};

const mockConfigApi = {
  getString: (key: string) => {
    if (key === 'backend.baseUrl') {
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

describe('<IncidentResponseCard />', () => {
  it('displays loading spinner initially', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, mockConfigApi],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        <IncidentResponseCard />
      </TestApiProvider>,
    );
    // Assert that the loading spinner is visible initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Wait for the fetch to complete and the loading spinner to disappear
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('displays fetched data correctly', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, mockConfigApi],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        <IncidentResponseCard />
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('There are 3 Ongoing Incidents'),
      ).toBeInTheDocument();
      expect(screen.getByText('Incident 1')).toBeInTheDocument();
      expect(screen.getByText('Incident 2')).toBeInTheDocument();
      expect(screen.getByText('Incident 3')).toBeInTheDocument();
    });
  });

  it('displays error message if fetch fails', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, mockConfigApi],
          [fetchApiRef, mockFailedFetchApi],
        ]}
      >
        <IncidentResponseCard />
      </TestApiProvider>,
    );
    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred while fetching incidents/i),
      ).toBeInTheDocument();
    });
  });

  it('displays error message if talking to webrca backend fails ', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, mockConfigApi],
          [fetchApiRef, mockFailedWebRCABackendFetchApi],
        ]}
      >
        <IncidentResponseCard />
      </TestApiProvider>,
    );
    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred while fetching incidents/i),
      ).toBeInTheDocument();
    });
  });

  it('re-fetches data when Refresh button is clicked', async () => {
    const mockFetchApiCopy = mockFetchApi as typeof mockFetchApi;

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, mockConfigApi],
          [fetchApiRef, mockFetchApiCopy],
        ]}
      >
        <IncidentResponseCard />
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('There are 3 Ongoing Incidents'),
      ).toBeInTheDocument();
    });

    mockFetchApiCopy.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        kind: 'IncidentList',
        total: 2,
        ok: true,
        code: 200,
        items: [
          { incident_id: '1', summary: 'Incident 1', severity: 'High' },
          { incident_id: '2', summary: 'Incident 2', severity: 'Medium' },
        ],
      }),
    });

    await fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() => {
      expect(
        screen.getByText('There are 2 Ongoing Incidents'),
      ).toBeInTheDocument();
    });
  });
});
