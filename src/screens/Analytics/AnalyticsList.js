import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction, onPressSideMenuTab, onLoggedin } from '../../actions';
import { getAnalytics, getExistingAnalyticsClientDetails } from "../../api/Dashboard/OldDB";
import PageHeader from "../../components/PageHeader";
import { Button } from "react-bootstrap";
import AddAnalyticsModal from "../../components/Analytics/AddAnalyticsModal";
import { getCurrentUser } from "../../helper/Utils";
import { Toast } from "react-bootstrap";
import { getDataTableConfig } from "../../helper/GetDatatableConfig";
import DataTable from "../../helper/Component/DataTable";
import EditAnalyticsModal from "../../components/Analytics/EditAnalyticsModal";
import DeleteAnalyticsModal from "../../components/Analytics/DeleteAnalyticsModal";
import RefreshButton from "../../helper/Component/RefreshButton";

class AnalyticsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            analytics: [],
            loadingModal: false,
            showAddAnalyticsModal: false,
            showEditAnalyticsModal: false,
            editModalData: {},
            showDeleteModal: false,
            deleteData: {},
            newUserdata: {},
            isNewUserdataLoading: true,
            existingAnalyticsClientDetails: {
                profile_id: [],
                profile_id_loading: true,

                internal_web_property_id: [],
                internal_web_property_id_loading: true,

                platform: [],
                platform_loading: true,

                event_category: [],
                event_category_loading: true,

                event_action: [],
                event_action_loading: true,

                metrics: [{
                    label: "Engage",
                    value: "ga:users, ga:transactionsPerUser, ga:transactionRevenue, ga:revenuePerTransaction, ga:transactionRevenuePerSession, ga:transactions, ga:sessions, ga:revenuePerUser, ga:transactionsPerSession"
                },
                {
                    label: "Overall",
                    value: "ga:sessions,ga:transactions,ga:transactionsPerSession,ga:transactionRevenue,ga:revenuePerTransaction,ga:transactionRevenuePerSession,ga:pageviews,ga:sessionDuration,ga:users"
                }
                ],
                persona_id: [{ label: `${this.props.shopperRecord.shield}`, value: 7 },
                { label: `${this.props.shopperRecord.ti3}`, value: 2 },
                { label: `${this.props.shopperRecord.epr}`, value: 4 },
                { label: `${this.props.shopperRecord['e-ei']}`, value: 3 },
                { label: `${this.props.shopperRecord.cs}`, value: 5 },
                { label: `${this.props.shopperRecord.wc}`, value: 1 },],

                event_label: [],
                event_label_loading: true,

                persona_group: [],
                persona_group_loading: true,

                product: [],
                product_loading: true,

                segments: [],
                segments_loading: true,

                account_credentials_file: [],
                account_credentials_file_loading: true,

                account_secret_file: [],
                account_secret_file_loading: true,

                ga_web_id: [],
                ga_web_loading: true,

            },
            updateExistingAnalyticsClientDetails: false,
            loadToaster: false,

            toasterMessage: null
        }
        this.onClickEditAnalyticsModal = this.onClickEditAnalyticsModal.bind(this);
        this.onClickAddAnalyticsModal = this.onClickAddAnalyticsModal.bind(this);
        this.onCloseAddUserModal = this.onCloseAddUserModal.bind(this);
        this.onCloseEditAnalyticsModal = this.onCloseEditAnalyticsModal.bind(this);
        this.onCloseDeleteAnalyticsModal = this.onCloseDeleteAnalyticsModal.bind(this);
        this.props.onPressSideMenuTab(4);
        this.onClickDeleteCouponModal = this.onClickDeleteCouponModal.bind(this);
        this.handleOnRefreshData = this.handleOnRefreshData.bind(this);
    }

    async handleOnRefreshData() {
        await this.getAnalyticsList();
    }
    async componentDidMount() {

        await this.existingAnalyticsClientDetails();
        await this.getAnalyticsList();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
            await this.existingAnalyticsClientDetails();
            await this.getAnalyticsList();
        }
    }

    onClickEditAnalyticsModal(data) {
        this.setState({
            editModalData: data,
            showEditAnalyticsModal: true
        });
    }

    onClickAddAnalyticsModal() {
        this.setState({
            showAddAnalyticsModal: true
        });
    }

    async onCloseAddUserModal(status) {

        if (status !== undefined) {
            if (status) {
                this.setState({
                    showAddAnalyticsModal: false,
                    loadToaster: true,
                    updateExistingAnalyticsClientDetails: true,
                    toasterMessage: "Created Successfully"
                });
                await this.existingAnalyticsClientDetails();
                await this.getAnalyticsList();

            } else {
                this.setState({
                    showAddAnalyticsModal: false,
                    loadToaster: true,
                    toasterMessage: "Something went Wrong!"
                });
            }
        } else {
            this.setState({
                showAddAnalyticsModal: false
            });
        }

    }

    async onCloseEditAnalyticsModal(status) {

        if (status !== undefined) {
            if (status) {
                this.setState({
                    showEditAnalyticsModal: false,
                    loadToaster: true,
                    updateExistingAnalyticsClientDetails: true,
                    toasterMessage: "Updated Successfully"
                });
                await this.existingAnalyticsClientDetails();
                await this.getAnalyticsList();
            } else {
                this.setState({
                    showEditAnalyticsModal: false,
                    loadToaster: true,
                    toasterMessage: "Something went Wrong!"
                })
            }
        } else {
            this.setState({
                showEditAnalyticsModal: false
            });
        }
    }

    onClickDeleteCouponModal(data) {
        this.setState({
            showDeleteModal: true,
            deleteData: data
        });
    }

    async onCloseDeleteAnalyticsModal(flag) {
        if (flag !== undefined) {
            if (flag) {
                this.setState({
                    showDeleteModal: false,
                    loadToaster: true,
                    toasterMessage: "Deleted Successfully"
                });
                await this.existingAnalyticsClientDetails();
                await this.getAnalyticsList();
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

    async getAnalyticsList() {

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

            const analytics = await getAnalytics({ siteIdInput }, headerConfig);
            if (analytics.data.hasOwnProperty('data') && analytics.data.data.length) {
                await this.createAnalyticsDataTable(analytics.data.data);
                this.setState({
                    isLoading: false,
                    analytics: analytics.data.data
                });
            }

        } catch (err) {
            this.setState({
                loadToaster: true,
                toasterMessage: "Something went Wrong!"
            });
        }
    }

    async existingAnalyticsClientDetails() {
        const siteIdInput = this.props.sessionClient.web_id;
        this.setState({
            isLoading: true,
            resettingInitialValues: false
        });
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: currentUser && `Bearer ${currentUser.refresh_token}`,
            }
        }
        let formFieldDynamicObject = {};
        let getExistingAnalyticsClientDetailsData = await getExistingAnalyticsClientDetails({ siteIdInput }, headerConfig);
        if (getExistingAnalyticsClientDetailsData.hasOwnProperty('data') && getExistingAnalyticsClientDetailsData.data.hasOwnProperty('data') && getExistingAnalyticsClientDetailsData.data.data.length) {
            const lyticsData = getExistingAnalyticsClientDetailsData.data.data;
            lyticsData.map((ld) => {
                formFieldDynamicObject[ld.column_name] = [];
                if (ld.value !== null) {
                    if (ld.column_name !== 'metrics') {
                        const splitData = ld.value.split(',')
                        splitData.map((sd) => {
                            formFieldDynamicObject[ld.column_name].push({
                                label: sd,
                                value: sd
                            })
                        })
                    }
                }
            })

            this.setState({
                existingAnalyticsClientDetails: {
                    profile_id: formFieldDynamicObject['profile_id'],
                    profile_id_loading: false,
                    internal_web_property_id: formFieldDynamicObject['internal_web_property_id'],
                    platform: formFieldDynamicObject['platform'],
                    event_category: formFieldDynamicObject['event_category'],
                    event_action: formFieldDynamicObject['event_action'],
                    event_label: formFieldDynamicObject['event_label'],
                    persona_group: formFieldDynamicObject['persona_group'],
                    product: formFieldDynamicObject['product'],
                    segments: formFieldDynamicObject['segments'],
                    account_credentials_file: formFieldDynamicObject.hasOwnProperty('account_credentials_file') ? formFieldDynamicObject['account_credentials_file'] : {
                        label: 'account_credentials_file.json',
                        value: 'account_credentials_file.json'
                    },
                    account_secret_file: formFieldDynamicObject.hasOwnProperty('account_secret_file') ? formFieldDynamicObject['account_secret_file'] : {
                        label: 'account_secret_file.json',
                        value: 'account_secret_file.json'
                    },
                    ga_web_id: formFieldDynamicObject['ga_web_id'],
                    metrics: [{
                        label: "Engage",
                        value: "ga:users, ga:transactionsPerUser, ga:transactionRevenue, ga:revenuePerTransaction, ga:transactionRevenuePerSession, ga:transactions, ga:sessions, ga:revenuePerUser, ga:transactionsPerSession"
                    },
                    {
                        label: "Overall",
                        value: "ga:sessions,ga:transactions,ga:transactionsPerSession,ga:transactionRevenue,ga:revenuePerTransaction,ga:transactionRevenuePerSession,ga:pageviews,ga:sessionDuration,ga:users"
                    }],
                    persona_id: [{ label: `${this.props.shopperRecord.shield}`, value: 7 },
                    { label: `${this.props.shopperRecord.ti3}`, value: 2 },
                    { label: `${this.props.shopperRecord.epr}`, value: 4 },
                    { label: `${this.props.shopperRecord['e-ei']}`, value: 3 },
                    { label: `${this.props.shopperRecord.cs}`, value: 5 },
                    { label: `${this.props.shopperRecord.wc}`, value: 1 }]
                }
            }
            )

        }
        else {
            this.setState({
                existingAnalyticsClientDetails: {
                    profile_id: [],
                    internal_web_property_id: [],
                    platform: [],
                    event_category: [],
                    event_action: [],
                    metrics: [{
                        label: "Engage",
                        value: "ga:users, ga:transactionsPerUser, ga:transactionRevenue, ga:revenuePerTransaction, ga:transactionRevenuePerSession, ga:transactions, ga:sessions, ga:revenuePerUser, ga:transactionsPerSession"
                    },
                    {
                        label: "Overall",
                        value: "ga:sessions,ga:transactions,ga:transactionsPerSession,ga:transactionRevenue,ga:revenuePerTransaction,ga:transactionRevenuePerSession,ga:pageviews,ga:sessionDuration,ga:users"
                    }
                    ],
                    persona_id: [{ label: `${this.props.shopperRecord.shield}`, value: 7 },
                    { label: `${this.props.shopperRecord.ti3}`, value: 2 },
                    { label: `${this.props.shopperRecord.epr}`, value: 4 },
                    { label: `${this.props.shopperRecord['e-ei']}`, value: 3 },
                    { label: `${this.props.shopperRecord.cs}`, value: 5 },
                    { label: `${this.props.shopperRecord.wc}`, value: 1 },],
                    event_label: [],
                    persona_group: [],
                    product: [],
                    segments: [],
                    account_credentials_file: [],
                    account_secret_file: [],
                    ga_web_id: [],
                }
            })
        }


    }

    async createAnalyticsDataTable(analyticsData) {
        let mainAnalyticsData = [];
        analyticsData.map((e, i) => {
            const data = {
                no: ++i,
                id: e.id,
                profile_id: e.profile_id,
                internal_web_property_id: e.internal_web_property_id,
                platform: e.platform,
                event_category: e.event_category,
                event_action: e.event_action,
                metrics: e.metrics,
                persona_name: e.name,
                event_label: e.event_label,
                persona_group: e.persona_group,
                product: e.product,
                segments: e.segments,
                account_credentials_file: e.account_credentials_file,
                account_secret_file: e.account_secret_file,
                ga_web_id: e.ga_web_id,
                edit: e,
                delete: e

            }
            mainAnalyticsData.push(data);
        });
        const userdata = await getDataTableConfig(mainAnalyticsData, /* User Table */
            [
                { accessor: 'no', Header: '#', width: 50 },
                { accessor: 'profile_id', Header: 'profile_id' },
                { accessor: 'internal_web_property_id', Header: 'internal_web_property_id' },
                { accessor: 'platform', Header: 'platform' },
                { accessor: 'event_category', Header: 'event_category' },

                { accessor: 'event_action', Header: 'event_action' },

                { accessor: 'metrics', Header: 'metrics' },

                { accessor: 'persona_name', Header: 'Shopper' },

                { accessor: 'event_label', Header: 'event_label' },

                { accessor: 'persona_group', Header: 'persona_group' },

                { accessor: 'product', Header: 'product' },

                { accessor: 'segments', Header: 'segments' },

                { accessor: 'account_credentials_file', Header: 'account_credentials_file' },

                { accessor: 'account_secret_file', Header: 'account_secret_file' },

                { accessor: 'ga_web_id', Header: 'ga_web_id' },

                {
                    accessor: 'edit', Header: 'Edit', Cell: ({ value }) => {
                        return <div>
                            <span style={{ cursor: "pointer" }} onClick={() => this.onClickEditAnalyticsModal(value)}>{this.state.loadingModal === true ?
                                <i className="fa fa-spinner fa-spin text-info"></i>
                                : <i className="badge badge-info fa fa-pencil"> </i>
                            }</span>
                        </div>
                    }
                },
                {
                    accessor: 'delete', Header: 'Delete', Cell: ({ value }) => {
                        return <span style={{ cursor: "pointer" }} className="" onClick={(e) => this.onClickDeleteCouponModal(value)}> <i className="badge badge-danger fa fa-trash"> </i> </span>
                    }
                }
            ]);

        this.setState({
            newUserdata: userdata,
            isNewUserdataLoading: false,
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-4">
                        <PageHeader
                            HeaderText="List of Analytics"
                            Breadcrumb={[{ name: "List of Analytics" }]}
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
                                    <div className="col-md-12 col-lg-12 mb-2">
                                        <Button onClick={() => { this.onClickAddAnalyticsModal(); }} className="btn btn-outline-info btn-info text-white float-left"><span>Add Analytics +</span></Button>
                                        <RefreshButton customCSS={{ float: "left", marginTop: "5px", verticalAlign: "-webkit-baseline-middle", verticalAlign: "baseline-middle" }} handleOnRefreshData={() => this.handleOnRefreshData()} />
                                    </div>
                                </div>
                                {!this.state.isLoading &&
                                    <div className="main-content body table-responsive scrollableUserTableFixedHeader cardScrollBar m-r-5 clearfix" style={{ overflow: "scroll" }}>

                                        {/* Add DataTable Here 
                                        */}
                                        {this.state.analytics.length > 0 && !this.state.isNewUserdataLoading ?
                                            <DataTable data={this.state.newUserdata.Dataset} columns={this.state.newUserdata.columnConfig} searchBoxStyle={true}/>
                                            :
                                            <div className="row no_data_row p-2">
                                                <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                                    <h3 className="badge no_data_available">No Coupons Available</h3>
                                                    <table className="table table-striped noDataAvailable"><thead><tr><th>#</th><th>Name</th><th>Description</th><th>Code</th><th>Valid From</th><th>Valid To</th><th>Is Active</th><th>Remarks</th><th>Created On</th><th>Modified On</th><th>Edit</th><th>Delete</th></tr></thead><tbody>


                                                        <tr><td scope="row" className="text-center">1</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>


                                                        <tr><td scope="row" className="text-center">2</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>

                                                        <tr><td scope="row" className="text-center">3</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr><tr><td scope="row" className="text-center">4</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr></tbody></table>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <AddAnalyticsModal
                    key={"addAnalyticsModal_001"}
                    size={"lg"}
                    title={"Add Analytic"}
                    existingAnalyticsClientDetails={this.state.existingAnalyticsClientDetails}
                    updateExistingAnalyticsClientDetails={this.state.updateExistingAnalyticsClientDetails}
                    show={this.state.showAddAnalyticsModal}
                    onClose={(flag) => this.onCloseAddUserModal(flag)}
                />

                <EditAnalyticsModal
                    key={"editAnalyticsModal_002"}
                    size={"lg"}
                    title={"Edit Analytics Details"}
                    data={this.state.editModalData}
                    existingAnalyticsClientDetails={this.state.existingAnalyticsClientDetails}
                    updateExistingAnalyticsClientDetails={this.state.updateExistingAnalyticsClientDetails}
                    show={this.state.showEditAnalyticsModal}
                    onClose={(flag) => this.onCloseEditAnalyticsModal(flag)}
                />

                <DeleteAnalyticsModal
                    key={"deleteAnalyticsModal_002"}
                    size={"lg"}
                    title={"Delete Analytics"}
                    data={this.state.deleteData}
                    show={this.state.showDeleteModal}
                    onClose={(flag) => this.onCloseDeleteAnalyticsModal(flag)}
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
    shopperRecord: websiteRecordReducer.shopperRecord,
    isLoggedin: loginReducer.isLoggedin
});

export default connect(mapStateToProps, {
    websiteRecordAction,
    onPressSideMenuTab,
    onLoggedin
})(AnalyticsList);