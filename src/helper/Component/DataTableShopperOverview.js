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
    const initialState = { hiddenColumns: ['newName'] };

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
                            <tr className={"shopperOverviewTr"} {...row.getRowProps()}>
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

function DataTableShopperOverview(props) {

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
                    if (row.canExpand) {
                        return (<span
                            {...row.getToggleRowExpandedProps({
                                style: {
                                    // We can even use the row.depth property
                                    // and paddingLeft to indicate the depth
                                    // of the row
                                    paddingLeft: `${row.depth * 0.2}rem`,
                                    fontWeight: "bold"
                                }
                            })}
                        >
                            {row.isExpanded ? <><span className="salesReportExapnsion badge-info">-</span>{row.original.client_name}</> : <><span className="salesReportExapnsion badge-info">+{row.original.client_name}</span></>}
                        </span>)
                    } else {
                        return row.original.hasOwnProperty('__status') ? <span style={{ fontWeight: 'bold' }}>{row.original.__status}</span> : null;
                    }
                }
            },
            {
                Header: <div id="shopperOverviewDiv" style={{ textAlign: "center", borderRight: "1px solid" }}>Overview of all tests</div>,
                columns: [

                    {
                        Header: <div className="" style={{ textAlign: "center", borderRight: "1px solid" }}></div>,
                        columns: [
                            {
                                Header: 'Trigger',
                                accessor: 'trigger',
                            },
                            {
                                Header: 'Split',
                                accessor: 'split',
                            },
                            {
                                Header: 'Statistically Significant',
                                accessor: 'statistically_significant',
                            },
                            /* {
                                Header: 'Time Period',
                                accessor: 'time_period',
                            }, */
                            {
                                Header: 'Date Range',
                                accessor: 'split_time',
                            },],
                        id: "shopperOverview_1"
                    },
                    {
                        Header: <div className="shopperOverviewNestColumnHeading">Users</div>,
                        columns: [{
                            Header: 'PG',
                            accessor: 'pg_users',
                        },
                        {
                            Header: 'CG',
                            accessor: 'cg_users',
                        }],
                        id: "users"

                    },
                    {
                        Header: <div className="shopperOverviewNestColumnHeading">Transactions</div>,
                        columns: [{
                            Header: 'PG',
                            accessor: 'pg_transactions',
                        },
                        {
                            Header: 'CG',
                            accessor: 'cg_transactions',
                        }],
                        id: "transactions"

                    },
                    {
                        Header: <div className="shopperOverviewNestColumnHeading">Revenue</div>,
                        columns: [{
                            Header: 'PG',
                            accessor: 'pg_revenue',
                        },
                        {
                            Header: 'CG',
                            accessor: 'cg_revenue',
                        }],
                        id: "revenue"

                    },
                    {
                        Header: <div className="shopperOverviewNestColumnHeading">RPU</div>,
                        columns: [{
                            Header: 'PG',
                            accessor: 'pg_rpu',
                        },
                        {
                            Header: 'CG',
                            accessor: 'cg_rpu',
                        },
                        {
                            Header: 'Lift',
                            accessor: 'rpu_lift',
                            Cell: ({ value }) => {
                                return value < 0 ? <span style={{ color: 'red' }}>{value}%</span> : value > 0 ? `${value}%` : value;
                            }
                        }],
                        id: "rpu"

                    },
                    {
                        Header: <div className="shopperOverviewNestColumnHeading">TPU</div>,
                        columns: [{
                            Header: 'PG',
                            accessor: 'pg_tpu',
                        },
                        {
                            Header: 'CG',
                            accessor: 'cg_tpu',
                        },
                        {
                            Header: 'Lift',
                            accessor: 'tpu_lift',
                            Cell: ({ value }) => {
                                return value < 0 ? <span style={{ color: 'red' }}>{value}%</span> : value > 0 ? `${value}%` : value;
                            }
                        }],
                        id: "tpu"

                    },
                    {
                        Header: <div className="shopperOverviewNestColumnHeading">AOV</div>,
                        columns: [{
                            Header: 'PG',
                            accessor: 'pg_aov',
                        },
                        {
                            Header: 'CG',
                            accessor: 'cg_aov',
                        },
                        {
                            Header: 'Lift',
                            accessor: 'aov_lift',
                            Cell: ({ value }) => {
                                return value < 0 ? <span style={{ color: 'red' }}>{value}%</span> : value > 0 ? `${value}%` : value;
                            }
                        }],
                        id: "aov"

                    },

                ],
                id: "shopperOverview"
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

export default DataTableShopperOverview;