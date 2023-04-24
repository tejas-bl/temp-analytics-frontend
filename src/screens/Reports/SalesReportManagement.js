import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction } from '../../actions';
import PageHeader from "../../components/PageHeader";
import { convertDateTOLocale, convertNumbertoCurrencyFormat, getCurrentUser, getMonthAndYear, getYear } from "../../helper/Utils";
import { Toast } from "react-bootstrap";
import { getAllClientsSalesReportData } from "../../api/Dashboard/Reports";
import RefreshButton from "../../helper/Component/RefreshButton";
import DataTableExpandableTest from "../../helper/Component/DataTableSalesReport";
import { endOfMonth, format, startOfMonth, subDays, subMonths } from "date-fns";
import MonthPicker from "../../helper/MonthPicker";

class SalesReportManagement extends React.Component {
    constructor(props) {
        super(props);
        const currentDate = subMonths(new Date(), 1);
        let startDate = startOfMonth(currentDate)
        let endDate = endOfMonth(currentDate)
        let comparestartDate = startOfMonth(currentDate);
        let compareendDate = endOfMonth(currentDate);
        comparestartDate.setFullYear(startDate.getFullYear() - 1)
        compareendDate.setFullYear(endDate.getFullYear() - 1)
        let startDateYTD = new Date(new Date().getFullYear(), 0, 1)
        let comparestartDateYTD = new Date(new Date().getFullYear() - 1, 0, 1)
        startDate = convertDateTOLocale(startDate)
        endDate = convertDateTOLocale(endDate)
        comparestartDate = convertDateTOLocale(comparestartDate)
        compareendDate = convertDateTOLocale(compareendDate)
        startDateYTD = convertDateTOLocale(startDateYTD)
        comparestartDateYTD = convertDateTOLocale(comparestartDateYTD)


        this.state = {
            isLoading: true,
            reports: [],
            loadingModal: false,
            showCreateReportModal: false,
            showEditReportModal: false,
            editModalData: {},
            showDeleteModal: false,
            deleteData: {},
            newReportdata: {},
            isNewReportdataLoading: true,
            loadToaster: false,
            toasterMessage: null,
            salesReportData: [],
            salesReportDataLoading: true,
            salesReportDataHeading: [],
            salesReportDataHeadingLoading: true,
            monthDetail: {
                startDateYTD,
                comparestartDateYTD,
                startDate,
                endDate,
                comparestartDate,
                compareendDate
            }
        }
        this.handleOnRefreshData = this.handleOnRefreshData.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.onClickHandleMonthChange = this.onClickHandleMonthChange.bind(this);

    }


    async handleDateChange(dateDetail) {

        let startDate = startOfMonth(new Date(dateDetail))
        let endDate = endOfMonth(new Date(dateDetail))
        let comparestartDate = startOfMonth(new Date(dateDetail));
        let compareendDate = endOfMonth(new Date(dateDetail));
        comparestartDate.setFullYear(startDate.getFullYear() - 1)
        compareendDate.setFullYear(endDate.getFullYear() - 1)
        let startDateYTD = new Date(new Date(startDate).getFullYear(), 0, 1)
        let comparestartDateYTD = new Date(new Date(comparestartDate).getFullYear(), 0, 1)
        startDate = convertDateTOLocale(startDate)
        endDate = convertDateTOLocale(endDate)
        comparestartDate = convertDateTOLocale(comparestartDate)
        compareendDate = convertDateTOLocale(compareendDate)
        startDateYTD = convertDateTOLocale(startDateYTD)
        comparestartDateYTD = convertDateTOLocale(comparestartDateYTD)

        let monthDetail = {
            startDateYTD,
            comparestartDateYTD,
            startDate,
            endDate,
            comparestartDate,
            compareendDate
        }

        return monthDetail;

    }

    async componentDidMount() {
        await this.getSalesReportLists(this.state.monthDetail);
    }

    async handleOnRefreshData() {
        await this.getSalesReportLists(this.state.monthDetail);
    }

    async componentDidUpdate(prevProps) {
        if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
            await this.getSalesReportLists(this.state.monthDetail);
        }
    }

    async onClickHandleMonthChange(date) {

        const monthDetail = await this.handleDateChange(date);
        await this.getSalesReportLists(monthDetail);
    }

    async getSalesReportLists(monthDetail) {

        const siteIdInput = this.props.sessionClient.web_id;

        this.setState({
            isLoading: true,
            monthDetail
        });
        let currentUser = getCurrentUser();

        const headerConfig = {
            headers: {
                Authorization: currentUser && currentUser.hasOwnProperty('data') && `Bearer ${currentUser.data.data.refresh_token}`,
            }
        }
        try {
            const salesReportHeaders = {
                ytdHeaders: [],
                mtdHeaders: []
            }
            const salesReport = await getAllClientsSalesReportData({ siteIdInput, monthDetail }, headerConfig);
            if (salesReport.data.hasOwnProperty('data') && salesReport.data.data.getSalesReportData.length) {
                const rawDynamicHeader = salesReport.data.data.salesIntelligenceReportHeaderName
                const rawDynamicRows = salesReport.data.data.getSalesReportData;
                const dynamicRows = [];
                rawDynamicHeader.map((d) => {
                    if (d.ytd_label !== undefined && d.ytd_label !== null && d.ytd_label !== '') {
                        salesReportHeaders.ytdHeaders.push({
                            Header: d.ytd_label,
                            accessor: d.ytd_value,
                            width: 100
                        })
                    }
                    if (d.mtd_label !== undefined && d.mtd_label !== null && d.mtd_label !== '') {
                        salesReportHeaders.mtdHeaders.push({
                            Header: d.mtd_label,
                            accessor: d.mtd_value,
                            width: 100
                        })
                    }
                    return null;
                })
                rawDynamicRows.map((row) => {
                    let process = { subRows: [] };
                    let subRows = [
                        {
                            "__status": `${getMonthAndYear(monthDetail.comparestartDate)}`
                        },
                        {
                            "__status": `${getMonthAndYear(monthDetail.startDate)}`
                        },
                    ];
                    process['client_name'] = row['client_name']
                    rawDynamicHeader.map((d) => {
                        //let row_ytd_value = d['ytd_value'] === 'ytd_revenue' ? convertNumbertoCurrencyFormat(row[d['ytd_value']], this.props.sessionClient.currency) : row[d['ytd_value']];
                        let row_ytd_value = row[d['ytd_value']];
                        let row_mtd_value = row[d['mtd_value']];
                        let old_ytd_data = 0;
                        let old_mtd_data = 0;
                        let new_ytd_data = 0;
                        let new_mtd_data = 0;
                        if (d['ytd_value'] === 'ytd_revenue' || d['ytd_value'] === 'ytd_rps' || d['ytd_value'] === 'ytd_aov') {
                            old_ytd_data = convertNumbertoCurrencyFormat(row[`old_${d['ytd_value']}`], row.currency)
                            new_ytd_data = convertNumbertoCurrencyFormat(row[`new_${d['ytd_value']}`], row.currency)
                        } else if (d['ytd_value'] === 'ytd_cr') {
                            old_ytd_data = `${row[`old_${d['ytd_value']}`]}%`
                            new_ytd_data = `${row[`new_${d['ytd_value']}`]}%`
                        }
                        else {
                            old_ytd_data = row[`old_${d['ytd_value']}`]
                            new_ytd_data = row[`new_${d['ytd_value']}`]
                        }

                        if (d['mtd_value'] === 'mtd_revenue' || d['mtd_value'] === 'mtd_rps' || d['mtd_value'] === 'mtd_aov') {
                            old_mtd_data = convertNumbertoCurrencyFormat(row[`old_${d['mtd_value']}`], row.currency)
                            new_mtd_data = convertNumbertoCurrencyFormat(row[`new_${d['mtd_value']}`], row.currency)
                        } else if (d['mtd_value'] === 'mtd_cr') {
                            old_mtd_data = `${row[`old_${d['mtd_value']}`]}%`
                            new_mtd_data = `${row[`new_${d['mtd_value']}`]}%`
                        } else {
                            old_mtd_data = row[`old_${d['mtd_value']}`]
                            new_mtd_data = row[`new_${d['mtd_value']}`]
                        }
                        process[d['ytd_value']] = row_ytd_value < 0 ? <span style={{ color: "red" }}>{row_ytd_value}%</span> : `${row_ytd_value}%`
                        process[d['mtd_value']] = row_mtd_value < 0 ? <span style={{ color: "red" }}>{row_mtd_value}%</span> : `${row_mtd_value}%`
                        subRows[0] = {
                            ...subRows[0], ...{
                                [d['ytd_value']]: old_ytd_data,
                                [d['mtd_value']]: old_mtd_data
                            }
                        }
                        subRows[1] = {
                            ...subRows[1], ...{
                                [d['ytd_value']]: new_ytd_data,
                                [d['mtd_value']]: new_mtd_data
                            }
                        }
                        return null;
                    })
                    process.subRows = subRows;
                    dynamicRows.push(process)
                    return null;
                })
                this.setState({
                    isLoading: false,
                    salesReportDataHeading: salesReportHeaders,
                    salesReportDataHeadingLoading: false,
                    salesReportData: dynamicRows,
                    salesReportDataLoading: false,
                })
            } else {
                this.setState({
                    isLoading: false,
                    salesReportDataHeading: salesReportHeaders,
                    salesReportDataHeadingLoading: false,
                    salesReportData: [],
                    salesReportDataLoading: false,
                });
            }
        } catch (err) {
            this.setState({
                loadToaster: true,
                toasterMessage: "Something went Wrong!"
            });
        }


    }
    render() {
        return (
            <div className="container-fluid">
                <div className="row clearfix">
                    <div className="col-lg-8 col-md-8">
                        <PageHeader
                            HeaderText="Sales Intelligence Report"
                            Breadcrumb={[{ name: "Sales Intelligence Reports" }]}
                        />
                    </div>
                </div>
                <div className="mian-content">
                    <Toast
                        id="toast-container"
                        show={this.state.loadToaster}
                        onClose={() => {
                            this.setState({
                                loadToaster: false
                            })
                        }}
                        className="toast-info toast-top-right"
                        autohide={true}
                        delay={3500}
                    >
                        <Toast.Header className="toast-info mb-0">
                            {this.state.toasterMessage}
                        </Toast.Header>
                    </Toast>
                    <div className="card col-lg-12 col-md-12">
                        <div className="body">
                            <div className="body pt-0" id="salesReportManagement">
                                <div className="row">
                                    <div className="col-md-3 col-lg-3 mb-2 salesReportMonth">
                                        <MonthPicker onClickHandleMonthChange={(date) => { this.onClickHandleMonthChange(date) }} />
                                        {/* <div><span className="badge badge-info">Compare With</span></div>
                                        <MonthPicker onClickHandleMonthChange={(date) => { this.onClickHandleCompareMonthChange(date) }} /> */}
                                    </div>
                                    <RefreshButton customCSS={{ float: "left", marginTop: "5px", verticalAlign: "-webkit-baseline-middle", verticalAlign: "baseline-middle" }} handleOnRefreshData={() => this.handleOnRefreshData()} />
                                </div>
                                {!this.state.isLoading &&
                                    <div className="main-content body table-responsive scrollableUserTableFixedHeader cardScrollBar m-r-5 clearfix" style={{ overflowX: "visible" }}>
                                        {/* Add DataTable Here 
                                        */}
                                        {this.state.salesReportData.length > 0 && !this.state.salesReportDataLoading && !this.state.salesReportDataHeadingLoading ?
                                            <>
                                                <DataTableExpandableTest monthDetail={this.state.monthDetail} data={this.state.salesReportData} headers={this.state.salesReportDataHeading} columns={this.state.newReportdata.columnConfig} searchBoxStyle={true} />
                                            </>
                                            :
                                            <div className="row no_data_row p-2">
                                                <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                                    <h3 className="badge no_data_available">No Reports Available</h3>
                                                    <table className="table table-striped noDataAvailable"><thead><tr><th>#</th><th>Name</th><th>Description</th><th>Code</th><th>Valid From</th><th>Valid To</th><th>Is Active</th><th>Remarks</th><th>Created On</th><th>Modified On</th><th>Edit</th><th>Delete</th></tr></thead><tbody>


                                                        <tr><td className="text-center">1</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>


                                                        <tr><td className="text-center">2</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>

                                                        <tr><td className="text-center">3</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr><tr><td className="text-center">4</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr></tbody></table>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = ({
    websiteRecordReducer,
}) => ({
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord,
});

export default connect(mapStateToProps, {
    websiteRecordAction
})(SalesReportManagement);