// components/DataTable.tsx
import React from "react";
import { useTable, Column } from "react-table";

interface DataTableProps<T> {
  data: T[];
}

function DataTable<T extends object>({ data = [] }: DataTableProps<T>) {
  // Define columns
  const columns: Column<T>[] = React.useMemo(
    () =>
      data.length > 0
        ? Object.keys(data[0]).map((key) => ({
            Header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize column header
            accessor: key as keyof T, // The key of the object that will be used as the column
          }))
        : [], // Return an empty array if data is empty
    [data]
  );

  // Create the table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <div className="table-container">
      <table
        {...getTableProps()}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  {...column.getHeaderProps()}
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.id}
                    {...cell.getCellProps()}
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
