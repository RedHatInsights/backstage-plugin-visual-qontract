import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { CodeComponentsComponent } from './CodeComponentsComponent';
import QueryQontract from '../../common/QueryAppInterface';
import { useRelatedEntities } from '@backstage/plugin-catalog-react';

// Mock dependencies
jest.mock('../../common/QueryAppInterface', () => jest.fn());
jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useRelatedEntities: jest.fn(),
  useEntity: () => ({
    entity: {
      metadata: {
        annotations: {},
        labels: {},
      },
    },
  }),
}));

describe('<CodeComponentsComponent />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-entity',
      namespace: 'default',
      annotations: {
        'backstage.io/source-location': 'url:http://github.com/test-repo',
      },
      labels: {},
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
      owner: 'team-a',
    },
  };

  const renderWithEntityProvider = (ui) =>
    render(<EntityProvider entity={mockEntity}>{ui}</EntityProvider>);

  it('displays a loading message initially', async () => {
    QueryQontract.mockReturnValue({
      result: null,
      loaded: false,
      error: null,
    });
    useRelatedEntities.mockReturnValue({
      entities: [],
      loading: true,
      error: null,
    });

    renderWithEntityProvider(<CodeComponentsComponent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays an error message if there is a fetching error', async () => {
    QueryQontract.mockReturnValue({
      result: null,
      loaded: true,
      error: new Error('Failed to fetch data'),
    });
    useRelatedEntities.mockReturnValue({
      entities: [],
      loading: false,
      error: new Error('Failed to fetch related entities'),
    });

    renderWithEntityProvider(<CodeComponentsComponent />);
    expect(
      screen.getByText('Error loading the Code Repos & Build Jobs information.'),
    ).toBeInTheDocument();
  });

  it('renders nothing if there are no code components', async () => {
    QueryQontract.mockReturnValue({
      result: { apps_v1: [{ codeComponents: [] }] },
      loaded: true,
      error: null,
    });
    useRelatedEntities.mockReturnValue({
      entities: [],
      loading: false,
      error: null,
    });

    const { container } = renderWithEntityProvider(<CodeComponentsComponent />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a table of code components if data is available', async () => {
    // Mocking the data
    QueryQontract.mockReturnValue({
      result: {
        apps_v1: [
          {
            codeComponents: [
              {
                path: '/codeComponent1',
                name: 'Component 1',
                url: 'http://github.com/component1',
                SLA: '99.9%',
              },
              {
                path: '/codeComponent2',
                name: 'Component 2',
                url: 'http://gitlab.com/component2',
                SLA: '99.5%',
              },
            ],
          },
        ],
      },
      loaded: true,
      error: null,
    });
  
    useRelatedEntities.mockReturnValue({
      entities: [
        {
          metadata: {
            annotations: {
              'backstage.io/source-location': 'url:http://github.com/component1',
              'visual-qontract/image-build-url': 'http://ci.example.com/build1',
            },
          },
        },
      ],
      loading: false,
      error: null,
    });
  
    renderWithEntityProvider(<CodeComponentsComponent />);
  
    // Verify table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Build Job')).toBeInTheDocument();
  
    // Verify data rows
    expect(screen.getByText('Component 1')).toBeInTheDocument();
    expect(screen.getByText(/build1/i)).toBeInTheDocument(); // Updated matcher for 'build1'
  
    expect(screen.getByText('Component 2')).toBeInTheDocument();
    expect(screen.queryByText(/build2/i)).toBeNull();
  });
});