import React from "react";
import BTable from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useBlockLayout,
  useFlexLayout
} from "react-table";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: transparent;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.8rem;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  showSearchFilter,
  searchBoxStyle
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div style={showSearchFilter !== false ? { display: "table-row blockSearchBox" } : { display: "none" }}>
        <span className={searchBoxStyle ? "dataTableSearchBoxTop20" : "dataTableSearchBox"} style={{ display: "inline-block" }}>
          Search:{" "}
          <input
            value={value || ""}
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            //placeholder={`${count} records...`}
            style={{
              fontSize: ".9rem",
              margin: "4px"
            }}
          />
        </span>
    </div>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// Our table component
function Table({ columns, data, searchFilter, searchBoxStyle, customClassName }) {

  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  );
  const initialState = { hiddenColumns: ['modalDetails'] };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    useFlexLayout
  );
  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        showSearchFilter={searchFilter}
        customClassName={customClassName}
        searchBoxStyle={searchBoxStyle}
      />
      <BTable striped hover size="sm" {...getTableProps()} className="mt-3">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                  <span style={{ marginLeft: ".4rem", display: "inline-block" }}>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <i className="fa fa-caret-down" />
                      ) : (
                        <i className="fa fa-caret-up" />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
          {/*           <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: "left"
              }}
            ></th>
          </tr> */}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className={customClassName !== false ? `${customClassName}` : ""} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
      {/*       <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div> */}
    </>
  );
}

function DataTable(props) {
  const columns = React.useMemo(
    () => props.columns,
    []
  );

  const data = React.useMemo(
    () => props.data,
    []
  );


  return (
    <Styles>
      <Table columns={columns} data={data} searchFilter={props.searchFilter} searchBoxStyle={props.searchBoxStyle} customClassName={props.customClassName}/>
    </Styles>
  );
}

export default DataTable;