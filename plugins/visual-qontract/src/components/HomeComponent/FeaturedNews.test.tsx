import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { FeaturedNews } from './FeaturedNews';
import { useApi, fetchApiRef, configApiRef } from '@backstage/core-plugin-api';

// Mock useApi to return fetchApi and configApi
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

describe('<FeaturedNews />', () => {
  const mockFetch = jest.fn(); // Mock fetchApi.fetch

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useApi based on the reference being requested
    useApi.mockImplementation((apiRef) => {
      if (apiRef === fetchApiRef) {
        return { fetch: mockFetch }; // Mock fetchApi
      }
      if (apiRef === configApiRef) {
        return { getString: () => 'http://localhost:7000' }; // Mock configApi
      }
    });
  });

  it('displays a loading message initially', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Simulate loading

    render(<FeaturedNews />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays an error message if fetching data fails', async () => {
    mockFetch.mockRejectedValue(new Error('Fetch error')); // Simulate error

    render(<FeaturedNews />);
    await waitFor(() => {
      expect(screen.getByText('Error fetching news...')).toBeInTheDocument();
    });
  });

  it('displays featured news stories when data is available', async () => {
    const mockNewsData = [
      {
        section: 'Technology',
        stories: [
          {
            key: 1,
            featured: true,
            title: 'Tech News',
            body: 'Latest in tech...',
            image: 'tech.jpg',
            link: { url: 'http://tech-news.com' },
          },
          {
            key: 2,
            featured: false,
            title: 'General News',
            body: 'General news...',
            image: 'general.jpg',
            link: { url: 'http://general-news.com' },
          },
        ],
      },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockNewsData,
    });

    render(<FeaturedNews />);

    await waitFor(() => {
      expect(screen.getByText('Tech News')).toBeInTheDocument();
      expect(screen.getByText('Latest in tech...')).toBeInTheDocument();
    });
  });
});