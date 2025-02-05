import React from 'react';
import { screen } from '@testing-library/react';
import { HomeComponent } from './HomeComponent';
import { configApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import {
  renderInTestApp,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { waitFor } from '@testing-library/react';

// This is a minimal test because the functionality is all basically in the children

jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useStarredEntities: jest.fn().mockReturnValue({ starredEntities: [] }),
}));
describe('Home component', () => {
  it('should render the Home page', async () => {
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

    const mockFetchApi = {
      fetch: jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      }),
    };

    renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, mockConfigApi],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        <HomeComponent />
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('inScope')).toBeInTheDocument();
    });
  });
});
