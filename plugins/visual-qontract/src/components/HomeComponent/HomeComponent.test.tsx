import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomeComponent } from './HomeComponent';
import { useApi } from '@backstage/core-plugin-api';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightTheme } from '@backstage/theme';
import { act, waitFor } from '@testing-library/react';

// This is a minimal test because the functionality is all basically in the children

// Mock useApi to return the necessary config methods
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

// Mock useStarredEntities
jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useStarredEntities: jest.fn(() => ({
    starredEntities: [], // Mocked starred entities, can add actual entities if needed
  })),
}));

describe('<HomeComponent />', () => {
  beforeEach(() => {
    // Mock fetch to return a resolved promise with JSON response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]), // Empty array or add mock data if needed
      }),
    );

    // Mock useApi
    useApi.mockReturnValue({
      getString: () => 'http://localhost:7000',
      getOptionalString: () => 'http://localhost:7000',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = ui =>
    render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);


  it('displays an error message if fetching links fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderWithProviders(<HomeComponent />);

    await waitFor(() =>
      expect(screen.getByText('Error fetching news...')).toBeInTheDocument(),
    );
  });

  it('renders HomeComponent without providers', async () => {
    await act(async () => {
      renderWithProviders(<HomeComponent />);
    });
    expect(screen.getByText('inScope')).toBeInTheDocument();
  });
});
