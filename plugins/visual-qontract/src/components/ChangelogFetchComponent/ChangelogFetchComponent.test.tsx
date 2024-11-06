import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DenseTable } from './ChangelogFetchComponent';
import { MemoryRouter } from 'react-router-dom';
import * as ReactRouterDom from 'react-router-dom';

// Sample data for testing
const testData = [
  {
    commit: 'abc123',
    merged_at: '2024-10-25T16:14:25.653Z',
    change_types: ['Update', 'Bugfix'],
    error: false,
    apps: ['App1', 'App2'],
  },
  {
    commit: 'def456',
    merged_at: '2024-10-26T12:30:10.123Z',
    change_types: ['Feature'],
    error: true,
    apps: ['App3'],
  },
];

// Mock useNavigate once at the module level
const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock, // Return the mock function
}));

describe('DenseTable component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset the mock before each test
  });

  it('renders the table with correct columns and rows', () => {
    render(
      <MemoryRouter>
        <DenseTable changes={testData} />
      </MemoryRouter>,
    );

    // Check if table columns are present
    expect(screen.getByText('Commit')).toBeInTheDocument();
    expect(screen.getByText('Merged At')).toBeInTheDocument();
    expect(screen.getByText('Change Succeeded')).toBeInTheDocument();
    expect(screen.getByText('Change Types')).toBeInTheDocument();
    expect(screen.getByText('Apps')).toBeInTheDocument();

    // Check if commit links are correct
    const commitLink = screen.getByText('abc123');
    expect(commitLink).toHaveAttribute(
      'href',
      'https://gitlab.cee.redhat.com/service/app-interface/-/commit/abc123',
    );
    expect(commitLink).toHaveStyle('text-decoration: underline');
    expect(commitLink).toHaveStyle('color: #007bff');

    // Check for date presence with regex to handle different formats
    expect(screen.getByText(/Oct 25,? 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Oct 26,? 2024/)).toBeInTheDocument();
  });

  it('renders change types and apps as pills with correct styling', () => {
    render(
      <MemoryRouter>
        <DenseTable changes={testData} />
      </MemoryRouter>,
    );

    // Check for pill elements in the table (not in filter display)
    const changeTypePill = screen.getAllByText(/update/i)[0];
    expect(changeTypePill).toBeInTheDocument();
    expect(changeTypePill).toHaveStyle('text-transform: uppercase');
    expect(changeTypePill).toHaveStyle('padding: 4px 8px');
    expect(changeTypePill).toHaveStyle('border-radius: 12px');

    const appPill = screen.getAllByText(/app1/i)[0];
    expect(appPill).toBeInTheDocument();
    expect(appPill).toHaveStyle('text-transform: uppercase');
    expect(appPill).toHaveStyle('padding: 4px 8px');
    expect(appPill).toHaveStyle('border-radius: 12px');
  });

  it('displays the correct icon for error field', () => {
    render(
      <MemoryRouter>
        <DenseTable changes={testData} />
      </MemoryRouter>,
    );

    // Check for the presence of icons using aria-label
    const succeededIcon = screen.getByLabelText('Change succeeded');
    const failedIcon = screen.getByLabelText('Change failed');

    expect(succeededIcon).toBeInTheDocument();
    expect(failedIcon).toBeInTheDocument();
  });

  it('loads initial filters from the URL query string', () => {
    render(
      <MemoryRouter initialEntries={['/?filters=Update,App1']}>
        <DenseTable changes={testData} />
      </MemoryRouter>,
    );

    // Check if the initial filters are applied based on the URL
    expect(screen.getAllByText(/update/i)[1]).toBeInTheDocument(); // Second occurrence for filter pill
    expect(screen.getAllByText(/app1/i)[1]).toBeInTheDocument(); // Second occurrence for filter pill
  });

  it('updates the URL when a pill is clicked', async () => {
    render(
      <MemoryRouter>
        <DenseTable changes={testData} />
      </MemoryRouter>,
    );

    // Simulate clicking on a change type pill to add it as a filter
    const changeTypePill = screen.getAllByText(/update/i)[0];
    fireEvent.click(changeTypePill);

    // Wait for the navigateMock to be called with the expected arguments
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        { search: 'filters=Update' },
        { replace: true },
      ),
    );
  });
});
