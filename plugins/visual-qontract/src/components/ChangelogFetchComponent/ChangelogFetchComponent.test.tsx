import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChangeTable } from './ChangeTable';
import { MemoryRouter } from 'react-router-dom';

// Sample data for testing
const testData = [
  {
    commit: 'abc123',
    merged_at: '2024-10-21T16:14:25.653Z',
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
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );

    // Check if table columns are present
    expect(screen.getByText('Commit')).toBeInTheDocument();
    expect(screen.getByText('Merged At')).toBeInTheDocument();
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
    expect(screen.getByText(/Oct 21,? 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Oct 26,? 2024/)).toBeInTheDocument();
  });

  it('shows instructional text when no filters are applied', () => {
    render(
      <MemoryRouter>
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );

    // Check for the instructional message
    expect(
      screen.getByText('Click on the app or change type labels to add filters.'),
    ).toBeInTheDocument();
  });

  it('conditionally displays "Clear Filters" button when filters or dates are active', () => {
    render(
      <MemoryRouter initialEntries={['/?filters=type%3AUpdate']}>
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );

    // Expect the clear button to be visible when filters are present
    expect(screen.getByTestId('clear-all-filters')).toBeInTheDocument();

    // Clear all filters
    fireEvent.click(screen.getByTestId('clear-all-filters'));

    // Expect the clear button to disappear
    expect(screen.queryByTestId('clear-all-filters')).not.toBeInTheDocument();
  });

  it('filters data by date range', () => {
    render(
      <MemoryRouter>
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );

    // Set date range to only show items from Oct 26, 2024
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);
    fireEvent.change(startDateInput, { target: { value: '2024-10-25' } });
    fireEvent.change(endDateInput, { target: { value: '2024-10-27' } });

    // Verify that only the relevant row is displayed
    expect(screen.queryByText('abc123')).not.toBeInTheDocument();
    expect(screen.getByText('def456')).toBeInTheDocument();
  });

  it('clears the search text when the clear button is clicked', () => {
    render(
      <MemoryRouter>
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText('Search the changelog');
    fireEvent.change(searchInput, { target: { value: 'Update' } });
    expect(searchInput).toHaveValue('Update');

    // Locate the clear button within the search input field
    const clearButton = screen.getByRole('button', { name: '' }); // Using an empty name as placeholder might not have an aria-label
    fireEvent.click(clearButton);
    expect(searchInput).toHaveValue(''); // Ensure search text is cleared
  });

  it('removes a filter when the "x" icon is clicked on a filter pill', async () => {
    render(
      <MemoryRouter initialEntries={['/?filters=type%3AUpdate,app%3AApp1']}>
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );

    // Ensure both filter pills are present initially in the filter box
    expect(
      screen.getByTestId('active-filter-app-pill-App1'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('active-filter-type-pill-Update'),
    ).toBeInTheDocument();

    // Click the "×" button on the "App1" filter pill to remove it
    fireEvent.click(screen.getByTestId('active-filter-remove-app-pill-App1'));

    // Verify "App1" filter is removed and URL is updated accordingly
    await waitFor(() =>
      expect(navigateMock).toHaveBeenLastCalledWith(
        { search: 'filters=type%3AUpdate' },
        { replace: true },
      ),
    );

    // Verify the "App1" pill is no longer in the document
    expect(
      screen.queryByTestId('active-filter-app-pill-App1'),
    ).not.toBeInTheDocument();
  });

  it('renders change types and apps as pills with correct styling', () => {
    render(
      <MemoryRouter>
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );

    // Find the change type pill by its text content
    const changeTypePill = screen.getByText(/update/i);
    expect(changeTypePill).toBeInTheDocument();

    // Find the app pill by its text content
    const appPill = screen.getByText(/app1/i);
    expect(appPill).toBeInTheDocument();
  });

  it('displays the correct icon for error field', () => {
    render(
      <MemoryRouter>
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );
  });

  it('loads initial filters from the URL query string', () => {
    render(
      <MemoryRouter initialEntries={['/?filters=type%3AUpdate,app%3AApp1']}>
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );

    // Check if the initial filters are applied based on the URL
    expect(screen.getAllByText(/update/i)[1]).toBeInTheDocument(); // Second occurrence for filter pill
    expect(screen.getAllByText(/app1/i)[1]).toBeInTheDocument(); // Second occurrence for filter pill
  });

  it('updates the URL with field-based filters when multiple pills are clicked', async () => {
    render(
      <MemoryRouter>
        <ChangeTable changes={testData} />
      </MemoryRouter>,
    );

    // Simulate clicking on a change type pill to add it as a filter
    const changeTypePill = screen.getAllByText(/update/i)[0];
    fireEvent.click(changeTypePill);

    // Simulate clicking on an app pill to add another field-based filter
    const appPill = screen.getAllByText(/app1/i)[0];
    fireEvent.click(appPill);

    // Wait for the navigateMock to be called with the final, full query string
    await waitFor(() =>
      expect(navigateMock).toHaveBeenLastCalledWith(
        { search: 'filters=type%3AUpdate%2Capp%3AApp1' },
        { replace: true },
      ),
    );
  });
});
