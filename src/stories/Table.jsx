import { useColumnOrder, usePagination, useTable } from "react-table";

export const Table = ({ data, columns }) => {
  const tableInstance = useTable(
    {
      columns,
      data: data.payload,
      initialState: {
        pageIndex: 0,
        columnOrder: data.columns,
      },
    },
    useColumnOrder,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setColumnOrder,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const moveLeft = (columnOrder, accessor) => {
    const currentLocation = columnOrder.indexOf(accessor);
    if (currentLocation !== 0) {
      return [
        ...columnOrder.slice(0, currentLocation - 1),
        accessor,
        columnOrder[currentLocation - 1],
        ...columnOrder.slice(currentLocation + 1, columnOrder.length),
      ];
    } else return columnOrder;
  };
  const moveRight = (columnOrder, accessor) => {
    const currentLocation = columnOrder.indexOf(accessor);
    if (currentLocation !== columnOrder.length - 1) {
      return [
        ...columnOrder.slice(0, currentLocation),
        columnOrder[currentLocation + 1],
        accessor,
        ...columnOrder.slice(currentLocation + 2, columnOrder.length),
      ];
    } else return columnOrder;
  };

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <button
                    onClick={() =>
                      setColumnOrder((columnOrder) =>
                        moveLeft(columnOrder, column.id)
                      )
                    }
                  >
                    {"<"}
                  </button>
                  {column.render("Header")}
                  <button
                    onClick={() =>
                      setColumnOrder((columnOrder) =>
                        moveRight(columnOrder, column.id)
                      )
                    }
                  >
                    {">"}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>{" "}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            min={1}
            max={pageOptions.length}
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value
                ? Number(e.target.value) - 1
                : pageIndex;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <style jsx="true">{`
        .table {
          background-image: linear-gradient(45deg, red 45%, blue 55%);
          background-origin: border-box;
          border-spacing: 5px; /* space between each cell */
          border: 5px solid transparent; /* optional */
        }
        td {
          background: #fff;
          max-width: 20vw;
          overflow-wrap: break-word;
          word-wrap: break-word;
          border: 1px solid #222;
        }
      `}</style>
    </>
  );
};
