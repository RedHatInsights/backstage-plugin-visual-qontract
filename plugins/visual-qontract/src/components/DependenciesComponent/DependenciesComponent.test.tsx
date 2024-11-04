import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DependenciesComponent } from './DependenciesComponent';
import QueryQontract from '../../common/QueryAppInterface';

// Mock the QueryQontract function
jest.mock('../../common/QueryAppInterface', () => jest.fn());

describe('<DependenciesComponent />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('displays a loading message initially', async () => {
    // Simulate loading state
    QueryQontract.mockReturnValue({
      result: null,
      loaded: false,
      error: null,
    });

    render(<DependenciesComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays an error message if fetching data fails', async () => {
    // Simulate error state
    QueryQontract.mockReturnValue({
      result: null,
      loaded: true,
      error: new Error('Failed to fetch'),
    });

    render(<DependenciesComponent />);

    expect(screen.getByText('Error loading the dependency information.')).toBeInTheDocument();
  });

  it('renders nothing if there are no dependencies', async () => {
    // Simulate empty data state
    QueryQontract.mockReturnValue({
      result: { apps_v1: [{ dependencies: [] }] },
      loaded: true,
      error: null,
    });

    const { container } = render(<DependenciesComponent />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a table of dependencies if data is available', async () => {
    // Simulate successful data fetch
    QueryQontract.mockReturnValue({
      result: {
        apps_v1: [
          {
            dependencies: [
              {
                path: '/dependency1',
                name: 'Dependency 1',
                statusPage: 'http://statuspage1.com',
                SLA: '99.9%',
              },
              {
                path: '/dependency2',
                name: 'Dependency 2',
                statusPage: 'http://statuspage2.com',
                SLA: '99.5%',
              },
            ],
          },
        ],
      },
      loaded: true,
      error: null,
    });

    render(<DependenciesComponent />);

    // Verify table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status Page')).toBeInTheDocument();
    expect(screen.getByText('SLO')).toBeInTheDocument();

    // Verify table data
    expect(screen.getByText('Dependency 1')).toBeInTheDocument();
    expect(screen.getByText('http://statuspage1.com')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();

    expect(screen.getByText('Dependency 2')).toBeInTheDocument();
    expect(screen.getByText('http://statuspage2.com')).toBeInTheDocument();
    expect(screen.getByText('99.5%')).toBeInTheDocument();
  });
});