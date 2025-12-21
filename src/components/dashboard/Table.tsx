import type { ReactNode } from 'react';

export type TableColumn<T> = {
  header: string;
  align?: 'left' | 'right';
  render: (row: T) => ReactNode;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  emptyMessage: string;
};

const Table = <T,>({ columns, rows, emptyMessage }: TableProps<T>) => {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={`header-${index}`} className={column.align ? `align-${column.align}` : ''}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="table-empty" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {columns.map((column, columnIndex) => (
                  <td
                    key={`cell-${rowIndex}-${columnIndex}`}
                    className={column.align ? `align-${column.align}` : ''}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
