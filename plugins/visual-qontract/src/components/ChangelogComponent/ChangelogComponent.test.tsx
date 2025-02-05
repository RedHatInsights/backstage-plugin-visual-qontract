import React from 'react';
import { screen } from '@testing-library/react';
import {
  renderInTestApp,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { ChangelogComponent } from './ChangelogComponent';
import { configApiRef, fetchApiRef } from '@backstage/core-plugin-api';


describe('Changelog', () => {
  it('Should render the component', async () => {
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
        json: jest.fn().mockResolvedValue({ items: [] }),
      }),
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, mockConfigApi],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        <ChangelogComponent />
      </TestApiProvider>,
    );

    await expect(
      screen.findByText('App Interface'),
    ).resolves.toBeInTheDocument();
  });
});
