import { useEffect, useMemo, useState } from "react";
import {
  useBlockLayout,
  useColumnOrder,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";

export const Table = ({ data, columns }) => {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );
  const tableInstance = useTable(
    {
      columns,
      data: data.payload,
      defaultColumn,
      initialState: {
        pageIndex: 0,
        columnOrder: data.columns,
      },
    },
    useColumnOrder,
    useBlockLayout,
    useResizeColumns,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setColumnOrder,
    resetResizing,
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

  useEffect(() => {
    setColumnOrder(data.columns);
  }, [data.columns]);
  const moveLeft = (columnOrder, accessor) => {
    console.log(columnOrder);
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
      <button id="resetColumn" onClick={resetResizing}>
        Reset Column Size
      </button>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <button
                    title="Move this column left"
                    onClick={() =>
                      setColumnOrder((columnOrder) =>
                        moveLeft(columnOrder, column.id)
                      )
                    }
                  >
                    {"◄"}
                  </button>
                  <h4>{column.render("Header")}</h4>
                  <button
                    title="Move this column right"
                    onClick={() =>
                      setColumnOrder((columnOrder) =>
                        moveRight(columnOrder, column.id)
                      )
                    }
                  >
                    {"►"}
                  </button>
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? "▲" : "▼") : ""}
                  </span>
                  <span
                    title="Resize column"
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? "isResizing" : ""
                    }`}
                  ></span>
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
        <button
          onClick={() => gotoPage(0)}
          title="Go to first page"
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          onClick={() => previousPage()}
          title="Go to previous page"
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>{" "}
        <button
          onClick={() => nextPage()}
          title="Go to next page"
          disabled={!canNextPage}
        >
          {">"}
        </button>{" "}
        <button
          onClick={() => gotoPage(pageCount - 1)}
          title="Go to last page"
          disabled={!canNextPage}
        >
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
            placeholder={pageIndex + 1}
            title="Type in page number"
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
          title="Select number of rows to be shown"
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
        button#resetColumn,
        .pagination button,
        .pagination select {
          background: #0070f3;
          cursor: pointer;
          border: none;
          outline: none;
          border-radius: 7px;
          padding: 10px;
          margin: 10px;
          color: #fff;
          font-weight: bold;
          font-size: 0.9rem;
        }
        table {
          box-shadow: 1px 1px 20px 0px rgb(33 58 183 / 10%);
          overflow-x: auto;
          overflow-y: hidden;
          background: #e6e8f4;
          border-spacing: 5px;
          border: 5px solid transparent;
          display: block;
          margin: 50px auto;
          margin-top: 0px;
          padding: 10px;
          width: min-content;
          border-radius: 12px;
        }
        thead button {
          background: #d6d7e2;
          cursor: pointer;
          border: none;
          outline: none;
          border-radius: 7px;
          padding: 5px;
          margin: 5px;
          font-weight: bold;
        }
        th {
          display: flex !important;
          flex-direction: row;
          justify-content: space-between;
        }
        th h4 {
          margin: 5px;
          width: max-content;
        }
        tbody {
          background:#d6d7e2;
          border-radius: 12px;
          display: block;
        }
        tbody tr {
          padding: 10px;
          margin: 0 15px;
          border-bottom: 1px solid #e6e8f4;
        }
        td {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        .resizer {
          display: inline-block;
          background: #d6d7e2;
          width: 5px;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          transform: translateX(50%);
          z-index: 1;
          touch-action: none;

          &.isResizing {
            background: red;
          }
        }
        .pagination {
          box-shadow: 1px 1px 20px 0px rgb(33 58 183 / 10%);
          background: #e6e8f4;
          padding: 10px;
          border-radius: 12px;
          width: 80vw;
          margin: 0 auto 50px auto;
          font-size: 1.1rem;
          text-align: center;
        }
        .pagination input {
          border: none;
          outline: none;
          border-radius: 7px;
          padding: 10px;
          margin: 10px;
          margin-left: 0;
          font-weight: bold;
          font-size: 0.9rem;
        }
        .pagination select option {
          background: #fff;
          color: #000;
        }
        @media (max-width: 728px) {
          table {
            width: 100vw !important;
          }
          tbody {
            display: table-row-group;
          }
          .resizer{
            width: 10px;
          }
        }
      `}</style>
    </>
  );
};
