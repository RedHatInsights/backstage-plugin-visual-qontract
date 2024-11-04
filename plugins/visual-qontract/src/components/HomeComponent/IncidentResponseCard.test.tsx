import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { IncidentResponseCard } from './IncidentResponseCard';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightTheme } from '@backstage/theme';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

// Mock the configApiRef to provide the backend URL
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

// Set up a mock fetch response
const mockFetchResponse = (data, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    })
  );
};

// Utility to render with providers
const renderWithProviders = (ui) => {
  render(
    <ThemeProvider theme={lightTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('<IncidentResponseCard />', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the config API
    useApi.mockReturnValue({
      getString: () => 'http://localhost:7000',
    });
  });

  it('displays loading spinner initially', async () => {
    // Set up a fetch mock that delays response
    global.fetch = jest.fn(() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({ total: 0, items: [] }),
          });
        }, 100); // Delay of 100ms
      })
    );
  
    await act(async () => {
      renderWithProviders(<IncidentResponseCard />);
    });
  
    // Assert that the loading spinner is visible initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  
    // Wait for the fetch to complete and the loading spinner to disappear
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('displays fetched data correctly', async () => {
    mockFetchResponse({
      total: 2,
      items: [
        { incident_id: '1', summary: 'Incident 1', severity: 'High' },
        { incident_id: '2', summary: 'Incident 2', severity: 'Medium' },
      ],
    });

    await act(async () => {
      renderWithProviders(<IncidentResponseCard />);
    });

    await waitFor(() => {
      expect(screen.getByText('There are 2 Ongoing Incidents')).toBeInTheDocument();
      expect(screen.getByText('Incident 1')).toBeInTheDocument();
      expect(screen.getByText('Incident 2')).toBeInTheDocument();
    });
  });

  it('displays error message if fetch fails', async () => {
    mockFetchResponse({}, false);

    await act(async () => {
      renderWithProviders(<IncidentResponseCard />);
    });

    await waitFor(() => {
      expect(screen.getByText(/An error occurred while fetching incidents/i)).toBeInTheDocument();
    });
  });

  it('re-fetches data when Refresh button is clicked', async () => {
    mockFetchResponse({
      total: 1,
      items: [{ incident_id: '1', summary: 'Incident 1', severity: 'High' }],
    });

    await act(async () => {
      renderWithProviders(<IncidentResponseCard />);
    });

    await waitFor(() => {
      expect(screen.getByText('There are 1 Ongoing Incidents')).toBeInTheDocument();
    });

    mockFetchResponse({
      total: 3,
      items: [
        { incident_id: '1', summary: 'Incident 1', severity: 'High' },
        { incident_id: '2', summary: 'Incident 2', severity: 'Medium' },
        { incident_id: '3', summary: 'Incident 3', severity: 'Low' },
      ],
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('There are 3 Ongoing Incidents')).toBeInTheDocument();
    });
  });
});