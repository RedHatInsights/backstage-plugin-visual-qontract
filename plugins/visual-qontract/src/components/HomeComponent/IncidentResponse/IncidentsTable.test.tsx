import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IncidentsTable } from './IncidentsTable';
import '@testing-library/jest-dom';

// Mock ExternalCoordinationButton component
jest.mock('./ExternalCoordinationButton', () => ({
  ExternalCoordinationButton: ({ link }) => (
    <a href={link.url} target="_blank" rel="noopener noreferrer">
      {link.label}
    </a>
  ),
}));

// Mock TablePaginationActions
jest.mock('@material-ui/core/TablePagination/TablePaginationActions', () => ({
  __esModule: true,
  default: ({ onPageChange, page }) => (
    <div>
      <button onClick={() => onPageChange({}, page - 1)} aria-label="previous page">Previous</button>
      <button onClick={() => onPageChange({}, page + 1)} aria-label="next page">Next</button>
    </div>
  ),
}));

describe('<IncidentsTable />', () => {
  const incidentsMock = Array.from({ length: 8 }, (_, i) => ({
    name: `Incident ${i + 1}`,
    incident_id: `id-${i + 1}`,
    summary: `Summary of incident ${i + 1}`,
    severity: 'High',
    external_coordination: [{ label: 'Coordination Link', url: 'http://example.com' }],
  }));

  it('renders the incidents table with data', () => {
    render(<IncidentsTable incidents={incidentsMock} />);
    
    expect(screen.getByRole('table', { name: /incident table/i })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(7); // 5 incidents + 1 header row
  });

  it('renders incident details correctly', () => {
    render(<IncidentsTable incidents={incidentsMock} />);
  
    incidentsMock.slice(0, 5).forEach((incident) => {
      // Check that at least one instance of the summary text is in the document
      expect(screen.queryAllByText(incident.summary).length).toBeGreaterThan(0);
  
      // Check that at least one instance of the severity text is in the document
      expect(screen.queryAllByText(incident.severity).length).toBeGreaterThan(0);
  
      // Check that at least one instance of the coordination link is in the document with correct href
      expect(
        screen.getAllByRole('link', { name: /coordination link/i }).some((link) => 
          link.getAttribute('href') === 'http://example.com'
        )
      ).toBe(true);
    });
  });

  it('displays pagination controls', () => {
    render(<IncidentsTable incidents={incidentsMock} />);
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('paginates incidents when clicking next page', () => {
    render(<IncidentsTable incidents={incidentsMock} />);
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));

    incidentsMock.slice(5, 8).forEach((incident) => {
      expect(screen.getByText(incident.summary)).toBeInTheDocument();
    });
    expect(screen.queryByText(incidentsMock[0].summary)).not.toBeInTheDocument();
  });

  it('returns null if incidents array is empty', () => {
    const { container } = render(<IncidentsTable incidents={[]} />);
    expect(container.firstChild).toBeNull();
  });
});