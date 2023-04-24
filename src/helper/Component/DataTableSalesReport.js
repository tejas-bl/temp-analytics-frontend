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
    useExpanded,
    useFlexLayout
} from "react-table";
import { getMonthAndYear, getYear } from "../Utils";

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
function Table({ columns, data, searchFilter, searchBoxStyle }) {

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
    const initialState = {};

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
        useExpanded, // Use the useExpanded plugin hook
        useFlexLayout
    );
    return (
        <>
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
                showSearchFilter={false}
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
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
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
            </BTable>
        </>
    );
}

function DataTableSalesReport(props) {

    let ytdHeaders = [];

    //ytdHeaders = [{...ytdHeaders}, {Filter: NumberRangeColumnFilter, filter: "between"}]
    props.headers.ytdHeaders.map((y) => {
        ytdHeaders.push(y);
    })
    const columns = React.useMemo(
        () => [
            {
                // Build our expander column
                id: "expander", // Make sure it has an ID
                Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                    <span {...getToggleAllRowsExpandedProps()}>
                        {isAllRowsExpanded ? <><span className="salesReportExapnsion badge-info">-</span>ALL</> : <><span className="salesReportExapnsion badge-info">+</span>ALL</>}
                    </span>
                ),
                Cell: ({ row }) => {
                    // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
                    // to build the toggle for expanding a row
                    return row.canExpand ? (
                        <span
                            {...row.getToggleRowExpandedProps({
                                style: {
                                    // We can even use the row.depth property
                                    // and paddingLeft to indicate the depth
                                    // of the row
                                    paddingLeft: `${row.depth * 2}rem`,
                                    fontWeight: "bold"
                                }
                            })}
                        >
                            {row.isExpanded ? <><span className="salesReportExapnsion badge-info">-</span>{row.original.client_name}</> : <><span className="salesReportExapnsion badge-info">+</span>{row.original.client_name}</>}
                        </span>
                    ) : row.original.hasOwnProperty('__status') ? <span style={{fontWeight: 'bold'}}>{row.original.__status}</span> : null
                }
            },
            {
                Header: <div id="ytdHeader" style={{textAlign: "center", borderRight: "1px solid"}}>YTD({getYear(props.monthDetail.comparestartDateYTD)}-{getYear(props.monthDetail.startDateYTD)})</div>,
                columns: ytdHeaders,
                id: "ytdHeader"
            },
            {
                Header: <div id="monthHeader" style={{textAlign: "center"}}>Month({getMonthAndYear(props.monthDetail.comparestartDate)} - {getMonthAndYear(props.monthDetail.startDate)})</div>,
                columns: props.headers.mtdHeaders,
                id: "monthHeader"
            }
        ],
        []
    );

    const data = React.useMemo(
        () => props.data,
        []
    );


    return (
        <Styles>
            <Table columns={columns} data={data} searchFilter={props.searchFilter} searchBoxStyle={props.searchBoxStyle} />
        </Styles>
    );
}

export default DataTableSalesReport;