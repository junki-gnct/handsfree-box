import './loglist.scss';

import React from 'react';
import { LogListProps } from './interface';
import {
  Container,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableContainer,
} from '@material-ui/core';

import { database } from '../../../utils/Firebase';

interface Column {
  id: 'id' | 'action' | 'date';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'id', label: '名前', minWidth: 100 },
  { id: 'action', label: '操作', minWidth: 50 },
  { id: 'date', label: '日時', minWidth: 170 },
];

const LogList: React.FunctionComponent<LogListProps> = ({ user, logs }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [nameBuffer, setNameBuffer] = React.useState<{
    [key: string]: string;
  }>({});

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getDeviceName = (id: string): string => {
    if (nameBuffer[id]) {
      return nameBuffer[id];
    }
    const ref = database.ref(`/${user?.uid}/${id}/name`);
    ref.on('value', (snapshot) => {
      const val = snapshot.val();
      if (val != null && nameBuffer[id] != val) {
        const newList = { ...nameBuffer };
        newList[id] = val;
        setNameBuffer(newList);
      }
    });
    return id;
  };

  return (
    <Container maxWidth="md" className="loglist">
      <Paper>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {logs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        let value = row[column.id];
                        if (column.id == 'id') {
                          value = getDeviceName(value);
                        } else if (column.id == 'action') {
                          value = value == 'close' ? '施錠' : '開錠';
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={logs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default LogList;
