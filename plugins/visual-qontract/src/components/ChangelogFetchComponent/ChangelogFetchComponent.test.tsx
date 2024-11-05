import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DenseTable } from './ChangelogFetchComponent'; // Ensure this path is correct

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

describe('DenseTable component', () => {
  it('renders the table with correct columns and rows', () => {
    render(<DenseTable changes={testData} />);

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
      'https://gitlab.cee.redhat.com/service/app-interface/-/commit/abc123'
    );
    expect(commitLink).toHaveStyle('text-decoration: underline');
    expect(commitLink).toHaveStyle('color: #007bff');

    // Check for date presence with regex to handle different formats
    expect(screen.getByText(/Oct 25,? 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Oct 26,? 2024/)).toBeInTheDocument();
  });

  it('renders change types and apps as pills with correct styling', () => {
    render(<DenseTable changes={testData} />);

    // Check for pill elements by using a partial text match to avoid case-sensitivity issues
    const changeTypePill = screen.getByText(/update/i); // 'i' flag makes it case-insensitive
    expect(changeTypePill).toBeInTheDocument();
    expect(changeTypePill).toHaveStyle('text-transform: uppercase');
    expect(changeTypePill).toHaveStyle('padding: 4px 8px');
    expect(changeTypePill).toHaveStyle('border-radius: 12px');

    const appPill = screen.getByText(/app1/i);
    expect(appPill).toBeInTheDocument();
    expect(appPill).toHaveStyle('text-transform: uppercase');
    expect(appPill).toHaveStyle('padding: 4px 8px');
    expect(appPill).toHaveStyle('border-radius: 12px');
  });

  it('displays the correct icon for error field', () => {
    render(<DenseTable changes={testData} />);
  
    // Check for the presence of icons using aria-label
    const succeededIcon = screen.getByLabelText('Change succeeded');
    const failedIcon = screen.getByLabelText('Change failed');
  
    expect(succeededIcon).toBeInTheDocument();
    expect(failedIcon).toBeInTheDocument();
  });

});