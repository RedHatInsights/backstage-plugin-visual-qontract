import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { ChangeTable } from './ChangeTable';

const mockChangelogData = [
  {
    commit: "CHANGELOG_DATA_1",
    merged_at: "2025-01-01T06:25:11.197Z",
    change_types: [
      "saas-file-promotion",
      "progressive-delivery"
    ],
    error: false,
    apps: ["App1", "App2"]
  },
  {
    commit: "CHANGELOG_DATA_2",
    merged_at: "2025-01-01T08:16:31.588Z",
    change_types: [
      "user-updates"
    ],
    error: false,
    apps: ["App1", "App2"]
  },
  {
    commit: "CHANGELOG_DATA_3",
    merged_at: "2025-01-02T00:38:11.670Z",
    change_types: [
      "docs"
    ],
    error: false,
    apps: ["App2"]
  },
  {
    commit: "CHANGELOG_DATA_4",
    merged_at: "2025-01-02T01:55:20.475Z",
    change_types: [
      "app-metadata"
    ],
    error: false,
    apps: ["App1", "App2", "App3"]
  },
  {
    commit: "CHANGELOG_DATA_5",
    merged_at: "2025-01-02T07:26:33.912Z",
    change_types: [
      "resource-updates"
    ],
    error: false,
    apps: ["App1", "App3"]
  },
  {
    commit: "CHANGELOG_DATA_6",
    merged_at: "2025-01-03T15:13:46.076Z",
    change_types: [
      "cluster-upgrade"
    ],
    error: false,
    apps: ["App1"]
  },
  {
    commit: "CHANGELOG_DATA_7",
    merged_at: "2025-01-03T16:20:57.323Z",
    change_types: [
      "Quarkus",
      "dev-file-registry"
    ],
    error: false,
    apps: ["App2", "App4"]
  }
];

// Mock useNavigate once at the module level
const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock, // Return the mock function
}));

describe('ChangelogFetch component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset the mock before each test
  });

  it('renders the table with correct columns and rows', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    // Check if table columns are present
    expect(screen.getByText('Commit')).toBeInTheDocument();
    expect(screen.getByText('Merged At')).toBeInTheDocument();
    expect(screen.getByText('Change Types')).toBeInTheDocument();
    expect(screen.getByText('Apps')).toBeInTheDocument();
  });

  it('renders the specified logs for a given date range', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    // Check if commit links are correct
    const commitLink = screen.getByText('CHANGELOG_DATA_1');
    expect(commitLink).toHaveAttribute(
      'href',
      'https://gitlab.cee.redhat.com/service/app-interface/-/commit/CHANGELOG_DATA_1',
    );
    expect(commitLink).toHaveStyle('text-decoration: underline');
    expect(commitLink).toHaveStyle('color: #007bff');
  });

  it('renders the timestamp for the changelog in UTC and local time format', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    const utcButton = screen.getByText("UTC");
    const localButton = screen.getByText("Local");

    // Verify UTC time format toggle works
    fireEvent.click(utcButton);
    expect(screen.getByText("2025-01-01T06:25:11.197Z")).toBeInTheDocument();

    // Verify local time format toggle works
    fireEvent.click(localButton);
    expect(screen.getByText("Jan 1, 2025, 6:25:11 AM UTC")).toBeInTheDocument();
  });

  it('should hide time filtering fields and update date filtering fields to text inputs when UTC mode is enabled', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    let startDateInput;
    let endDateInput;

    startDateInput = screen.getByLabelText(/Start Date/i);
    endDateInput = screen.getByLabelText(/End Date/i);

    // Start and end time inputs should be displayed
    // on the screen by default
    expect(screen.queryByText(/Start Time/)).toBeInTheDocument();
    expect(screen.queryByText(/End Time/)).toBeInTheDocument();

    // Start and end fields should have HTML5 date
    // input types
    expect(startDateInput).toHaveAttribute("type", "date");
    expect(endDateInput).toHaveAttribute("type", "date");

    // Toggle on UTC mode
    const utcButton = screen.getByText("UTC");
    fireEvent.click(utcButton);

    // Start and end date inputs should be hidden
    expect(screen.queryByText(/Start Time/)).not.toBeInTheDocument();
    expect(screen.queryByText(/End Time/)).not.toBeInTheDocument();

    startDateInput = screen.getByLabelText(/Start Date/i);
    endDateInput = screen.getByLabelText(/End Date/i);

    // Start and end fields should have default text
    // input types
    expect(startDateInput).toHaveAttribute("type", "text");
    expect(endDateInput).toHaveAttribute("type", "text");

    const localButton = screen.getByText("Local");
    fireEvent.click(localButton);

    startDateInput = screen.getByLabelText(/Start Date/i);
    endDateInput = screen.getByLabelText(/End Date/i);

    // Start and end fields should revert back to
    // HTML5 date input types
    expect(startDateInput).toHaveAttribute("type", "date");
    expect(endDateInput).toHaveAttribute("type", "date");

    // Start and end time fields should reppear on screen
    expect(screen.queryByText(/Start Time/)).toBeInTheDocument();
    expect(screen.queryByText(/End Time/)).toBeInTheDocument();
  });

  it('should filter changelog entries in UTC mode', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    const utcButton = screen.getByText("UTC");
    fireEvent.click(utcButton);

    let startDateInput;
    let endDateInput;

    startDateInput = screen.getByLabelText(/Start Date/i);
    endDateInput = screen.getByLabelText(/End Date/i);

    fireEvent.change(startDateInput, { target: { value: "2025-01-01T06:00:00.000Z" } });
    fireEvent.change(endDateInput, { target: { value: "2025-01-02T01:30:00.000Z" } });

    expect(screen.queryByText('CHANGELOG_DATA_1')).toBeInTheDocument();
    expect(screen.queryByText('CHANGELOG_DATA_2')).toBeInTheDocument();
    expect(screen.queryByText('CHANGELOG_DATA_3')).toBeInTheDocument();
    expect(screen.queryByText('CHANGELOG_DATA_4')).not.toBeInTheDocument();

    fireEvent.change(endDateInput, { target: { value: "2025-01-02T05:00:00.000Z" } });
    expect(screen.queryByText('CHANGELOG_DATA_4')).toBeInTheDocument();

    // When switching to local mode from UTC mode, the datetime
    // data should persist and be displayed in the start/end
    // date and start/end time fields
    const localButton = screen.getByText("Local");
    fireEvent.click(localButton);

    startDateInput = screen.getByLabelText(/Start Date/i);
    endDateInput = screen.getByLabelText(/End Date/i);

    expect(startDateInput).toHaveValue("2025-01-01");
    expect(endDateInput).toHaveValue("2025-01-02");
  });

  it('shows instructional text when no filters are applied', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    // Check for the instructional message
    expect(
      screen.getByText('Click on the app or change type labels to add filters.'),
    ).toBeInTheDocument();
  });

  // TODO: This test currently fails due to renderInTestApp not properly handling URL query parameters.
  // The filters from routeEntries aren't being parsed by the component.
  // This needs to be revisited with a different testing approach.
  it.skip('conditionally displays "Clear Filters" button when filters or dates are active', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />, {
      routeEntries: ['/?filters=type:Update'],
    });

    // Expect the clear button to be visible when filters are present
    await waitFor(() => {
      expect(screen.getByTestId('clear-all-filters')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Clear all filters
    fireEvent.click(screen.getByTestId('clear-all-filters'));

    // Expect the clear button to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('clear-all-filters')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);

  it('filters changelog entries by date', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);

    fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-01-01' } });

    expect(screen.queryByText('CHANGELOG_DATA_1')).toBeInTheDocument();
    expect(screen.queryByText('CHANGELOG_DATA_2')).toBeInTheDocument();
    expect(screen.queryByText('CHANGELOG_DATA_3')).not.toBeInTheDocument();
  });

  it('filters changelog data via both date and time', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);

    const startTimeInput = screen.getByLabelText(/Start Time/i);
    const endTimeInput = screen.getByLabelText(/End Time/i);

    fireEvent.change(startDateInput, { target: { value: '2025-01-02' } });
    fireEvent.change(endDateInput, { target: { value: '2025-01-02' } });

    fireEvent.change(startTimeInput, { target: { value: '00:00' } });
    fireEvent.change(endTimeInput, { target: { value: '05:00' } });

    expect(screen.queryByText('CHANGELOG_DATA_3')).toBeInTheDocument();
    expect(screen.queryByText('CHANGELOG_DATA_4')).toBeInTheDocument();
    expect(screen.queryByText('CHANGELOG_DATA_5')).not.toBeInTheDocument();

    fireEvent.change(endTimeInput, { target: { value: '07:30' } });
    expect(screen.queryByText('CHANGELOG_DATA_5')).toBeInTheDocument();
  });

  it('clears the search text when the clear button is clicked', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    const searchInput = screen.getByPlaceholderText('Search the changelog');
    fireEvent.change(searchInput, { target: { value: 'Update' } });
    expect(searchInput).toHaveValue('Update');

    // Locate the clear button within the search input field
    const clearButton = screen.getByRole('button', { name: '' }); // Using an empty name as placeholder might not have an aria-label
    fireEvent.click(clearButton);
    expect(searchInput).toHaveValue(''); // Ensure search text is cleared
  });

  // TODO: This test currently fails due to renderInTestApp not properly handling URL query parameters.
  it.skip('removes a filter when the "x" icon is clicked on a filter pill', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />, {
      routeEntries: ['/?filters=type:Update,app:App1'],
    });

    // Ensure both filter pills are present initially in the filter box
    await waitFor(() => {
      expect(
        screen.getByTestId('active-filter-app-pill-App1'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('active-filter-type-pill-Update'),
      ).toBeInTheDocument();
    }, { timeout: 5000 });

    // Click the "×" button on the "App1" filter pill to remove it
    fireEvent.click(screen.getByTestId('active-filter-remove-app-pill-App1'));

    // Verify "App1" filter is removed and URL is updated accordingly
    await waitFor(() => {
      expect(navigateMock).toHaveBeenLastCalledWith(
        { search: 'filters=type%3AUpdate' },
        { replace: true },
      );
    }, { timeout: 5000 });

    // Verify the "App1" pill is no longer in the document
    await waitFor(() => {
      expect(
        screen.queryByTestId('active-filter-app-pill-App1'),
      ).not.toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);

  it('renders change types and apps as pills with correct styling', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    // Find the change type pill by its text content
    const changeTypePill = screen.getByText(/progressive-delivery/i);
    expect(changeTypePill).toBeInTheDocument();

    // Find the app pill by its text content
    const appPill = screen.getAllByText(/App1/i)[0];
    expect(appPill).toBeInTheDocument();
  });

  it('displays the correct icon for error field', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);
  });

  // TODO: This test currently fails due to renderInTestApp not properly handling URL query parameters.
  it.skip('loads initial filters from the URL query string', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />, {
      routeEntries: ['/?filters=type:progressive-delivery,app:App1'],
    });

    // Check if the initial filters are applied based on the URL
    await waitFor(() => {
      expect(screen.getAllByText(/progressive-delivery/i)[1]).toBeInTheDocument(); // Second occurrence for filter pill
      expect(screen.getAllByText(/App1/i)[0]).toBeInTheDocument(); // Second occurrence for filter pill
    }, { timeout: 5000 });
  }, 10000);

  it('updates the URL with field-based filters when multiple pills are clicked', async () => {
    await renderInTestApp(<ChangeTable changes={mockChangelogData} />);

    // Simulate clicking on a change type pill to add it as a filter
    const changeTypePill = screen.getAllByText(/progressive-delivery/i)[0];
    fireEvent.click(changeTypePill);

    // Simulate clicking on an app pill to add another field-based filter
    const appPill = screen.getAllByText(/App1/i)[0];
    fireEvent.click(appPill);

    // Wait for the navigateMock to be called with the final, full query string
    await waitFor(() =>
      expect(navigateMock).toHaveBeenLastCalledWith(
        { search: 'filters=type%3Aprogressive-delivery%2Capp%3AApp1' },
        { replace: true },
      ),
    );
  });
});
