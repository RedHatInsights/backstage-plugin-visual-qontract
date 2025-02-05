import React from 'react';
import { WebRCAComponent } from './WebRCAComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { configApiRef, fetchApiRef } from '@backstage/core-plugin-api';

//mock useEntity
jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useEntity: jest.fn().mockReturnValue({ starredEntities: [] }),
}));


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
  getOptionalConfig: jest.fn(),
};

const mockFetchApi = {
  fetch: jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue([]),
  }),
};

describe('WebRCAComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  registerMswTestHooks(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    await renderInTestApp(
    <TestApiProvider apis={[[configApiRef, mockConfigApi],[fetchApiRef, mockFetchApi],]}>
      <WebRCAComponent />
    </TestApiProvider>,
    );
    expect(screen.getByText('Welcome to web-rca!')).toBeInTheDocument();
  });
});
