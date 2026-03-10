import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Link,
  TableFooter,
  TablePagination,
} from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { useEffect, useState } from 'react';
import { ExternalCoordinationButton } from './ExternalCoordinationButton';
import { IncidentModal } from './IncidentModal';

export interface IncidentRow {
  incident_id: string;
  summary: string;
  severity: string;
  external_coordination?: { label: string; url: string }[];
}

export const IncidentsTable = ({
  incidents,
  maxRows = 5,
}: {
  incidents: IncidentRow[];
  maxRows?: number;
}) => {
  if (incidents?.length === 0) {
    return null;
  }

  const rowsPerPage = maxRows || 5;
  const [page, setPage] = useState(0);
  const [visibleRows, setVisibleRows] = useState<IncidentRow[]>([]);

  useEffect(() => {
    setVisibleRows(
      incidents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    );
  }, [incidents, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    setVisibleRows(
      incidents.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      ),
    );
  };

  return (
    <TableContainer>
      <Table aria-label="incident table" size="small">
        <TableHead>
          <TableRow>
            <TableCell variant="head" align="center">
              <Typography variant="button">View</Typography>
            </TableCell>
            <TableCell variant="head" align="center">
              <Typography variant="button">Summary</Typography>
            </TableCell>
            <TableCell variant="head" align="center">
              <Typography variant="button">Severity</Typography>
            </TableCell>
            <TableCell variant="head" align="center">
              <Typography variant="button">Coordination</Typography>
            </TableCell>
            <TableCell variant="head" align="center">
              <Typography variant="button">AI Summary</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((incident, index) => (
            <TableRow key={index}>
              <TableCell align="center">
                <Link
                  href={`https://web-rca.devshift.net/incident/${incident.incident_id}`}
                  target="_blank"
                >
                  <OpenInNew />
                </Link>
              </TableCell>
              <TableCell  align="center" style={{ maxWidth: '30em' }}>
                {incident.summary}
              </TableCell>
              <TableCell align="center">{incident.severity}</TableCell>
              <TableCell align="center">
                {incident.external_coordination?.map((link: { label: string; url: string }, linkIndex: number) => (
                  <ExternalCoordinationButton link={link} key={linkIndex} />
                ))}
              </TableCell>
              <TableCell align="center">
                <IncidentModal incident={incident} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              count={incidents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={() => {}}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
