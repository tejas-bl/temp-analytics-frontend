import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction, onPressSideMenuTab, onLoggedin } from '../../actions';
import PageHeader from "../../components/PageHeader";
import { Button } from "react-bootstrap";
import DeleteReportModal from "../../components/reports/DeleteReportModal";
import { formatDate, getCurrentUser } from "../../helper/Utils";
import { Toast } from "react-bootstrap";
import { getDataTableConfig } from "../../helper/GetDatatableConfig";
import DataTable from "../../helper/Component/DataTable";
import { logoutUserAsync } from "../../api/authentication";
import CreateReportModal from "../../components/reports/CreateReportModal";
import { getClientReports, getShopperScreenshotsCount } from "../../api/Dashboard/Reports";
import RefreshButton from "../../helper/Component/RefreshButton";

class ReportManagement extends React.Component {
    constructor(props) {
        super(props);
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
            toasterMessage: null
        }
        this.onClickEditReportModal = this.onClickEditReportModal.bind(this);
        this.onClickAddClientReportModal = this.onClickAddClientReportModal.bind(this);
        this.onCloseAddReportModal = this.onCloseAddReportModal.bind(this);
        this.onCloseEditReportModal = this.onCloseEditReportModal.bind(this);
        this.onCloseDeleteReportModal = this.onCloseDeleteReportModal.bind(this);
        this.props.onPressSideMenuTab(4);
        this.onClickDeleteCouponModal = this.onClickDeleteCouponModal.bind(this);
        this.handleOnRefreshData = this.handleOnRefreshData.bind(this);
    }
    async componentDidMount() {
        await this.getReportLists();
    }

    async handleOnRefreshData() {
        await this.getReportLists();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
            await this.getReportLists();
        }
    }

    onClickEditReportModal(data) {
        this.setState({
            editModalData: data,
            showEditReportModal: true
        });
    }

    onClickAddClientReportModal() {
        this.setState({
            showCreateReportModal: true
        });
    }

    async onCloseAddReportModal(status) {

        if (status !== undefined) {
            if (status) {
                this.setState({
                    showCreateReportModal: false,
                    loadToaster: true,
                    toasterMessage: "Created Successfully"
                });
                await this.getReportLists();

            } else {
                this.setState({
                    showCreateReportModal: false,
                    loadToaster: true,
                    toasterMessage: "Something went Wrong!"
                });
            }
        } else {
            this.setState({
                showCreateReportModal: false
            });
        }

    }

    async onCloseEditReportModal(status) {

        if (status !== undefined) {
            if (status) {
                this.setState({
                    showEditReportModal: false,
                    loadToaster: true,
                    toasterMessage: "Updated Successfully"
                });
                await this.getReportLists();
            } else {
                this.setState({
                    showEditReportModal: false,
                    loadToaster: true,
                    toasterMessage: "Something went Wrong!"
                })
            }
        } else {
            this.setState({
                showEditReportModal: false
            });
        }
    }

    onClickDeleteCouponModal(data) {
        this.setState({
            showDeleteModal: true,
            deleteData: data
        });
    }

    async onCloseDeleteReportModal(flag) {
        if (flag !== undefined) {
            if (flag) {
                this.setState({
                    showDeleteModal: false,
                    loadToaster: true,
                    toasterMessage: "Deleted Successfully"
                });
                await this.getReportLists();
            } else {
                this.setState({
                    showDeleteModal: false,
                    loadToaster: true,
                    toasterMessage: "Something went Wrong!"
                });
            }
        } else {
            this.setState({
                showDeleteModal: false
            });
        }
    }

    async getReportLists() {

        const siteIdInput = this.props.sessionClient.web_id;

        this.setState({
            isLoading: true
        });
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${currentUser.refresh_token}`,
            }
        }
        try {

            const reports = await getClientReports({ siteIdInput }, headerConfig);
            if (reports.data.hasOwnProperty('data') && reports.data.data.length) {
                await this.createReportDataTable(reports.data.data, headerConfig);
                this.setState({
                    isLoading: false,
                    reports: reports.data.data
                });
            } else {
                this.setState({
                    isLoading: false,
                    reports: []
                });
            }
        } catch (err) {
            this.setState({
                loadToaster: true,
                toasterMessage: "Something went Wrong!"
            });
        }
    }



    async createReportDataTable(reportData, headerConfig) {
        let mainReportData = [];
        let indepthProblemSS = await getShopperScreenshotsCount({ siteIdInput: this.props.sessionClient.web_id, screenshotType: 'problem', reportType: 'indepth' }, headerConfig)
        let indepthSolutionSS = await getShopperScreenshotsCount({ siteIdInput: this.props.sessionClient.web_id, screenshotType: 'solution', reportType: 'indepth' }, headerConfig)
        if (indepthProblemSS !== undefined && indepthProblemSS.hasOwnProperty('data') && indepthProblemSS.data.hasOwnProperty('data') && indepthProblemSS.data.data.length) {
            indepthProblemSS = indepthProblemSS.data.data;
        }
        if (indepthSolutionSS !== undefined && indepthSolutionSS.hasOwnProperty('data') && indepthSolutionSS.data.hasOwnProperty('data') && indepthSolutionSS.data.data.length) {
            indepthSolutionSS = indepthSolutionSS.data.data;
        }
        reportData.map((e, i) => {
            const data = {
                no: ++i,
                from_date: e.from_date ? formatDate(e.from_date) : "",
                to_date: e.to_date ? formatDate(e.to_date) : "",
                report_url: e.report_url,
                report_type_name: e.report_type_name,
                report_type: e.report_type,
                report_name: e.report_name,
                report_screenshots_problem: indepthProblemSS.length ? indepthProblemSS : null,
                report_screenshots_solution: indepthSolutionSS.length ? indepthSolutionSS : null,
                //deleted_on: e.deleted_on ? formatDate(e.deleted_on) : "",
                delete: e

            }
            mainReportData.push(data);
        });
        const userdata = await getDataTableConfig(mainReportData, /* User Table */
            [
                { accessor: 'no', Header: '#', width: 50 },
                { accessor: 'from_date', Header: 'From Date' },
                { accessor: 'to_date', Header: 'To Date' },
                {
                    accessor: 'report_url', Header: 'Download URL',
                    Cell: ({ value }) => {
                        return <a download href={value} style={{ cursor: "pointer" }} rel="noopener noreferrer" className="" target="_blank"> <i className="badge badge-danger fa fa-download"> </i> </a>
                    }
                },
                { accessor: 'report_type_name', Header: 'Report Type' },
                {
                    accessor: 'report_screenshots_problem', Header: 'Problem SS Available', Cell: ({ value }) => {
                        let icon = '';
                        let color = '';
                        let screenshotHtml = [];
                        if (value !== undefined && value !== null) {
                            return value.map((ss, i) => {
                                if ((ss.shopper_id === 7 && parseInt(ss.count) < 8) || (ss.shopper_id !== 7 && parseInt(ss.count) < 4)) {
                                    //icon = 'fa fa-times text-red redCross';
                                    icon = '';
                                    color = 'colorRed';
                                } else {
                                    icon = 'fa fa-check text-green greenCheck';
                                    color = 'colorGreen';
                                }
                                if (ss.shopper_id !== 7) {
                                    if (ss.shopper_id === 1 && parseInt(ss.count) < 1) {
                                        icon = '';
                                        color = 'colorRed';
                                    } else if (ss.shopper_id === 1 && parseInt(ss.count) >= 1) {
                                        icon = 'fa fa-check text-green greenCheck';
                                        color = 'colorGreen';
                                    }

                                    if (ss.shopper_id === 5 && parseInt(ss.count) < 1) {
                                        icon = '';
                                        color = 'colorRed';
                                    } else if ((ss.shopper_id === 5 && parseInt(ss.count) >= 1)) {
                                        icon = 'fa fa-check text-green greenCheck';
                                        color = 'colorGreen';
                                    }
                                }

                                return <p key={i}> {ss.name} - <span className={color}><strong>{ss.count}</strong></span> <i className={icon}></i></p>
                            })
                        }
                        return screenshotHtml;
                    }, width: 200
                }, {
                    accessor: 'report_screenshots_solution', Header: 'Solution SS Available', Cell: ({ value }) => {
                        let icon = '';
                        let color = '';
                        let screenshotHtml = [];
                        if (value !== undefined && value !== null) {
                            return value.map((ss, i) => {
                                if (parseInt(ss.count) < 1) {
                                    icon = '';
                                    color = 'colorRed';
                                } else if (parseInt(ss.count) >= 1) {
                                    icon = 'fa fa-check text-green greenCheck';
                                    color = 'colorGreen';
                                }

                                return <p key={i}> {ss.name} - <span className={color}><strong>{ss.count}</strong></span> <i className={icon}></i></p>
                            })
                        }
                        return screenshotHtml;
                    }, width: 200
                },
                /* { accessor: 'deleted_on', Header: 'Deleted' }, */
                {
                    accessor: 'delete', Header: 'Delete', Cell: ({ value }) => {
                        return !value.deleted_on ? <span style={{ cursor: "pointer" }} className="" onClick={(e) => { this.onClickDeleteCouponModal(value); }}> <i className="badge badge-danger fa fa-trash"> </i> </span> : "NA"
                    }
                }
            ]);

        this.setState({
            newReportdata: userdata,
            isNewReportdataLoading: false,
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-4">
                        <PageHeader
                            HeaderText="List of Reports"
                            Breadcrumb={[{ name: "List of Reports" }]}
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
                            <div className="body pt-0" id="addCouponBody">
                                <div className="row">
                                    <div className="col-md-6 col-lg-6">
                                    </div>
                                    <div className="col-md-8 col-lg-8 mb-2">
                                        <Button onClick={() => { this.onClickAddClientReportModal(); }} className="btn btn-outline-info btn-info text-white float-left"><span>Create Report +</span></Button>
                                        <RefreshButton customCSS={{ float: "left", marginTop: "5px", verticalAlign: "-webkit-baseline-middle", verticalAlign: "baseline-middle" }} handleOnRefreshData={() => this.handleOnRefreshData()} />
                                    </div>
                                </div>
                                {!this.state.isLoading &&
                                    <div className="main-content body table-responsive scrollableUserTableFixedHeader cardScrollBar m-r-5 clearfix">

                                        {/* Add DataTable Here 
                                        */}
                                        {this.state.reports.length > 0 && !this.state.isNewReportdataLoading ?
                                            <DataTable data={this.state.newReportdata.Dataset} columns={this.state.newReportdata.columnConfig} searchBoxStyle={true} />
                                            :
                                            <div className="row no_data_row p-2">
                                                <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                                    <h3 className="badge no_data_available">No Reports Available</h3>
                                                    <table className="table table-striped noDataAvailable"><thead><tr><th>#</th><th>Name</th><th>Description</th><th>Code</th><th>Valid From</th><th>Valid To</th><th>Is Active</th><th>Remarks</th><th>Created On</th><th>Modified On</th><th>Edit</th><th>Delete</th></tr></thead><tbody>


                                                        <tr><td  className="text-center">1</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>


                                                        <tr><td  className="text-center">2</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>

                                                        <tr><td  className="text-center">3</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr><tr><td  className="text-center">4</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr></tbody></table>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <CreateReportModal
                    key={"createReportModal_001"}
                    size={"lg"}
                    title={"Create Report"}
                    show={this.state.showCreateReportModal}
                    onClose={(flag) => this.onCloseAddReportModal(flag)}
                />

                <DeleteReportModal
                    key={"DeleteReportModal_002"}
                    size={"lg"}
                    title={"Delete User"}
                    data={this.state.deleteData}
                    show={this.state.showDeleteModal}
                    onClose={(flag) => this.onCloseDeleteReportModal(flag)}
                />
            </div>
        )
    }

}

const mapStateToProps = ({
    websiteRecordReducer,
    loginReducer
}) => ({
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord,
    isLoggedin: loginReducer.isLoggedin
});

export default connect(mapStateToProps, {
    websiteRecordAction,
    onPressSideMenuTab,
    onLoggedin
})(ReportManagement);