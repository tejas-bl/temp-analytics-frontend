import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction, onPressSideMenuTab, onLoggedin } from '../../actions';
import PageHeader from "../../components/PageHeader";
import { convertDateTOLocale, getCurrentUser } from "../../helper/Utils";
import { Button, FormCheck, Toast } from "react-bootstrap";
import { getDataTableConfig } from "../../helper/GetDatatableConfig";
import DataTable from "../../helper/Component/DataTable";
import { getMTDReportClientEmails, getMTDReportClients, sendMTDReportEmail, updateReportApprove } from "../../api/Engage/OldDB";
import MonthPicker from "../../helper/MonthPicker";
import { endOfMonth, format, startOfMonth } from "date-fns";
import ConfirmSendEmailModal from "../../helper/ConfirmSendEmailModal";
import Loader from "../../helper/Loader";
import EmailSentToClientsModal from "../../helper/EmailSentToClientsModal";
import ConfirmBoxModal from "../../helper/ConfirmBoxModal";
import { createAllReport } from "../../api/Dashboard/Reports";


class MTDReports extends React.Component {
    constructor(props) {
        super(props);
        const currentDate = new Date();
        this.state = {
            isLoading: true,
            reports: [],
            showConfirmSendEmailModal: false,
            showEmailSentToModal: false,
            showConfirmBoxModal: false,
            loadingModal: false,
            monthDetail: {
                startDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
                endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 0, 0),
                startDateMonthName: format(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1), 'LLLL')
            },
            clientDetails: [],
            clientDetailsLoading: true,
            sentEmailToClientDetails: [],
            sentEmailToClientDetailsLoading: true,
            approveClientReportDetails: {},
            approveClientReportDetailsLoading: false,
            sendingEmail: false,
            newReportdata: {},
            isNewReportdataLoading: true,
            loadToaster: false,
            toasterMessage: null,
            reportApprovedStatus: false,
        }
        this.pickAMonth = React.createRef()
        this.props.onPressSideMenuTab(4);
        this.onClickSendEmailMTDReport = this.onClickSendEmailMTDReport.bind(this);
        this.onClickHandleMonthChange = this.onClickHandleMonthChange.bind(this);
        this.onClickConfirmSendEmailModal = this.onClickConfirmSendEmailModal.bind(this);
        this.onClickEmailSentToClients = this.onClickEmailSentToClients.bind(this);
        this.onClickApproveClientReport = this.onClickApproveClientReport.bind(this);
        this.onCloseSendEmailModal = this.onCloseSendEmailModal.bind(this);
        this.handleOnGenerateAllClientReports = this.handleOnGenerateAllClientReports.bind(this);
    }

    async handleOnGenerateAllClientReports() {
        let startDate = convertDateTOLocale(this.state.monthDetail.startDate);
        let endDate = convertDateTOLocale(this.state.monthDetail.endDate);
        let startDateMonthName = format(new Date(startDate), 'LLLL');

        let monthDetail = {
            startDate: startDate,
            endDate: endDate,
            startDateMonthName: startDateMonthName
        }

        let currentUser = await getCurrentUser();
        if (currentUser && currentUser.hasOwnProperty('data')) {
            currentUser = currentUser.data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: `Bearer ${currentUser.refresh_token}`,
            }
        }
        await createAllReport(monthDetail, headerConfig);
    }

    async onClickConfirmSendEmailModal(data) {
        let currentUser = await getCurrentUser();
        if (currentUser && currentUser.hasOwnProperty('data')) {
            currentUser = currentUser.data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: `Bearer ${currentUser.refresh_token}`,
            }
        }
        const cleintEmailReponse = await getMTDReportClientEmails(data.web_account_id, headerConfig);
        if (cleintEmailReponse !== undefined && cleintEmailReponse.hasOwnProperty('data') && cleintEmailReponse.data.length) {
            data.email = cleintEmailReponse.data;
        }
        this.setState({
            clientDetails: data,
            clientDetailsLoading: false,
            showConfirmSendEmailModal: true,
        });
    }

    async onClickEmailSentToClients(value) {
        this.setState({
            showEmailSentToModal: true,
            sentEmailToClientDetails: value,
            sentEmailToClientDetailsLoading: false,
        });
    }

    async onClickApproveClientReport(e, value) {
        value.updateReportApproved = e.target.checked;
        this.setState({
            showConfirmBoxModal: true,
            approveClientReportDetails: value,
            approveClientReportDetailsLoading: false
        });
    }

    async onCloseApproveClientReport(status) {
        let currentUser = await getCurrentUser();
        if (currentUser && currentUser.hasOwnProperty('data')) {
            currentUser = currentUser.data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: `Bearer ${currentUser.refresh_token}`,
            }
        }
        this.setState({
            showConfirmBoxModal: false,
            approveClientReportDetailsLoading: true
        });
        if (status && this.state.approveClientReportDetails !== null) {
            const updateReportApproveReponse = await updateReportApprove(this.state.approveClientReportDetails, headerConfig);
            if (updateReportApproveReponse !== undefined && updateReportApproveReponse.hasOwnProperty('statuscode') && updateReportApproveReponse.statuscode === 200) {
                
                let startDate = convertDateTOLocale(this.state.monthDetail.startDate);
                let endDate = convertDateTOLocale(this.state.monthDetail.endDate);
                let startDateMonthName = format(new Date(startDate), 'LLLL');

                let monthDetail = {
                    startDate: startDate,
                    endDate: endDate,
                    startDateMonthName: startDateMonthName
                }
                await this.getClientMTDReportLists(monthDetail);
            } else {
                this.setState({
                    loadToaster: true,
                    toasterMessage: "Something went Wrong!"
                });
            }

        }
    }
    async onCloseSendEmailModal(status) {
        this.setState({
            showConfirmSendEmailModal: false,
            clientDetailsLoading: true,
            sendingEmail: true
        });
        if (status && this.state.clientDetails !== null) {
            const sentEmailReponse = await this.onClickSendEmailMTDReport(this.state.clientDetails);
            if (sentEmailReponse !== undefined && sentEmailReponse.hasOwnProperty('data') && sentEmailReponse.data.length) {
                const status = sentEmailReponse.data[0]
                sentEmailReponse.data.map((status) => {
                    if (status.alreadySent) {
                        this.setState({
                            loadToaster: true,
                            toasterMessage: sentEmailReponse.data
                        });
                    } else if (status.success) {
                        this.setState({
                            loadToaster: true,
                            toasterMessage: sentEmailReponse.data
                        });
                    } else {
                        this.setState({
                            loadToaster: true,
                            toasterMessage: sentEmailReponse.data
                        });
                    }
                })
            } else {
                this.setState({
                    loadToaster: true,
                    toasterMessage: null
                });
            }

        }
        this.setState({
            sendingEmail: false
        });
    }

    emailSentConfirmationToastMessage(emailList) {
        let emailListStatus = [];
        if (emailList !== null && Array.isArray(emailList)) {
            emailList.map((status, i) => {
                if (status.alreadySent) {
                    emailListStatus.push(<li key={i}>
                        Already Sent
                        <span className="alreadySentEmailToastSpan">
                            {status.sentTo}
                        </span>
                    </li>)
                } else if (status.success) {
                    emailListStatus.push(<li key={i}>
                        Successfully Sent
                        <span className="successfullySentEmailToastSpan">
                            {status.sentTo}
                        </span>
                    </li>)
                } else {
                    emailListStatus.push(<li key={i}>
                        Couldn't Sent
                        <span className="failedSendingEmailToastSpan">
                            {status.sentTo}
                        </span>
                    </li>)
                }
            })
            return <ul>{emailListStatus}</ul>;
        } else {
            emailListStatus.push(<li key={1}>
                Something went wrong!
            </li>)
            return <ul>{emailListStatus}</ul>
        }
    }

    async componentDidMount() {
        const siteIdInput = this.props.sessionClient.web_id;

        let startDate = convertDateTOLocale(this.state.monthDetail.startDate);
        let endDate = convertDateTOLocale(this.state.monthDetail.endDate);
        let startDateMonthName = format(new Date(startDate), 'LLLL');

        let monthDetail = {
            startDate: startDate,
            endDate: endDate,
            startDateMonthName: startDateMonthName
        }

        await this.getClientMTDReportLists(monthDetail);
    }

    async componentDidUpdate(prevProps) {
        if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
            const siteIdInput = this.props.sessionClient.web_id;
            let startDate = convertDateTOLocale(this.state.monthDetail.startDate);
            let endDate = convertDateTOLocale(this.state.monthDetail.endDate);
            let startDateMonthName = format(new Date(startDate), 'LLLL');

            let monthDetail = {
                startDate: startDate,
                endDate: endDate,
                startDateMonthName: startDateMonthName
            }
            await this.getClientMTDReportLists(monthDetail);
        }
    }

    async onClickSendEmailMTDReport(data) {
        let currentUser = await getCurrentUser();
        if (currentUser && currentUser.hasOwnProperty('data')) {
            currentUser = currentUser.data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: `Bearer ${currentUser.refresh_token}`,
            }
        }

        let emailReportData = {
            site_id: data.web_id,
            web_account_id: data.web_account_id,
            report_date: this.state.monthDetail.startDate,
            report_month: this.state.monthDetail.startOfMonth,
            web_url: data.web_url,
            client_email: data.email,
            report_sent_on: format(new Date(), 'yyyy-MM-dd'),
            report_sent_url: data.report_url,
            is_engage: true
        }

        let sendEmailReport = await sendMTDReportEmail(emailReportData, headerConfig)
        return sendEmailReport;
    }

    async onClickHandleMonthChange(date) {
        const siteIdInput = this.props.sessionClient.web_id;
        let startDate = convertDateTOLocale(startOfMonth(new Date(date)))
        let endDate = convertDateTOLocale(endOfMonth(new Date(date)))
        let startDateMonthName = format(new Date(startDate), 'LLLL');
        let monthDetail = {
            siteIdInput: siteIdInput,
            startDate: startDate,
            endDate: endDate,
            startDateMonthName: startDateMonthName
        }
        await this.getClientMTDReportLists(monthDetail);
    }

    async getClientMTDReportLists(monthDetail) {
        const siteIdInput = this.props.sessionClient.web_id;
        const webAccountId = this.props.sessionClient.web_account_id;
        this.setState({
            isLoading: true,
            monthDetail: {
                startDate: monthDetail.startDate,
                endDate: monthDetail.endDate,
                startOfMonth: monthDetail.startDateMonthName
            }
        });
        let currentUser = await getCurrentUser();
        if (currentUser && currentUser.hasOwnProperty('data')) {
            currentUser = currentUser.data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: `Bearer ${currentUser.refresh_token}`,
            }
        }
        try {
            const reportList = await getMTDReportClients({ siteIdInput, startDate: monthDetail.startDate, endDate: monthDetail.endDate, webAccountId: webAccountId }, headerConfig);
            if (reportList !== undefined && reportList.hasOwnProperty('data') && reportList.data.length) {
                await this.createMTDReportDataTable(reportList.data, monthDetail);
                this.setState({
                    isLoading: false,
                    reports: reportList.data
                });
            } else {
                await this.createMTDReportDataTable([], monthDetail);
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



    async createMTDReportDataTable(mtdReportData, monthDetail) {
        let mainMtdReportData = [];
        mtdReportData.map((e, i) => {
            let engage_platform = null;
            let is_engage = false;
            if (e.engage) {
                is_engage = true
            }
            let is_affiliate = false;
            if (e.engage_analytics === 'affiliate') {
                is_affiliate = true
                engage_platform = 'Affiliate'
            } else if (e.engage_analytics === 'analytics') {
                engage_platform = 'Google Analytics'
            } else {
                engage_platform = 'NA'
            }
            const data = {
                no: ++i,
                web_url: e.web_url,
                email_sent: e.email_sent ? 'Yes' : 'No',
                send_email: e,
                analytics_screenshot: Math.abs(e.ab_perc) !== 100 ? `http://debuficgraftb.cloudfront.net/mtd_report/images/client_images/${monthDetail.startDate}/analytics/${e.web_id}_analytics.png` : 'NA',
                engage_screenshot: is_engage ? `http://debuficgraftb.cloudfront.net/mtd_report/images/client_images/${monthDetail.startDate}/analytics/${e.web_id}_engage_ab.png` : 'NA',
                revenue_breakdown_screenshot: is_engage ? `http://debuficgraftb.cloudfront.net/mtd_report/images/client_images/${monthDetail.startDate}/analytics/${e.web_id}_persona_revenue_breakdown.png` : 'NA',
                affiliate_screenshot: is_affiliate ? `http://debuficgraftb.cloudfront.net/mtd_report/images/client_images/${monthDetail.startDate}/analytics/${e.web_id}_affiliate.png` : 'NA',
                client_email: e.client_email,
                sent_on: e.sent_on ? e.sent_on : "-",
                ab_perc: e.ab_status || e.engage_ab ? Math.abs(e.ab_perc) : 'NA',
                engage_platform: engage_platform !== null ? engage_platform : "NA",
                //download_url: `https://debuficgraftb.cloudfront.net/mtd_report/images/client_images/${monthDetail.startDate}/pdf/${e.web_url}_${monthDetail.startDateMonthName}_results.pdf#zoom=100,1100,0`
                download_url: e.report_url !== null && e.report_url !== '' ? e.report_url : 'http://debuficgraftb.cloudfront.net/mtd_report/images/client_images/' + monthDetail.startDate + '/html/' + e.web_id + '_' + e.web_url + '.html',
                report_created_status: e.hasOwnProperty('report_type') && e.report_type !== null && e.report_type !== '' ? 'yes' : 'no',
                data_matched: e.data_matched ? 'yes' : 'no',
                report_approved: e
            }
            mainMtdReportData.push(data);
        });
        const reportdata = await getDataTableConfig(mainMtdReportData, /* User Table */
            [
                { accessor: 'no', Header: '#', width: 50 },
                { accessor: 'web_url', Header: 'Client' },
                { accessor: 'ab_perc', Header: `${this.props.shopperRecord.shield} Split`, width: 100 },
                {
                    accessor: 'analytics_screenshot', Header: `${this.props.shopperRecord.shield} Analytics SS`, width: 100, Cell: ({ value }) => {
                        if (value !== 'NA') {
                            return <a download href={value} style={{ cursor: "pointer" }} className="text-center" target="_blank"> <i className="badge badge-danger fa fa-download"> </i> </a>
                        } else {
                            return "NA"
                        }
                    }
                },
                {
                    accessor: 'engage_screenshot', Header: 'Engage Total Revenue (GA)', width: 100, Cell: ({ value }) => {
                        if (value !== 'NA') {
                            return <a download href={value} style={{ cursor: "pointer" }} className="text-center" target="_blank"> <i className="badge badge-danger fa fa-download"> </i> </a>
                        } else {
                            return "NA"
                        }
                    }
                },
                {
                    accessor: 'revenue_breakdown_screenshot', Header: 'Engage Per Persona Revenue', width: 100, Cell: ({ value }) => {
                        if (value !== 'NA') {
                            return <a download href={value} style={{ cursor: "pointer" }} className="text-center" target="_blank"> <i className="badge badge-danger fa fa-download"> </i> </a>
                        } else {
                            return "NA"
                        }
                    }
                },
                {
                    accessor: 'affiliate_screenshot', Header: 'Engage Total Revenue (Affiliate)', width: 100, Cell: ({ value }) => {
                        if (value !== 'NA') {
                            return <a download href={value} style={{ cursor: "pointer" }} className="text-center" target="_blank"> <i className="badge badge-danger fa fa-download"> </i> </a>
                        } else {
                            return "NA"
                        }
                    }
                },
                { accessor: 'email_sent', Header: 'Email Sent', width: 100 },
                { accessor: 'sent_on', Header: 'Email Sent On' },
                { accessor: 'engage_platform', Header: 'Engage Default Platform' },
                {
                    accessor: 'send_email', Header: 'Send Email', Cell: ({ value }) => {
                        return <div>
                            {value.hasOwnProperty('report_type') && value.report_type !== null && value.report_type !== '' && value.data_matched && value.report_approved ? 
                            <span style={{ cursor: "pointer" }} onClick={() => this.onClickConfirmSendEmailModal(value)}>{this.state.loadingModal === true ?
                                <i className="fa fa-spinner fa-spin text-info"></i>
                                : <i className="badge badge-info fa fa-send-o"> </i>
                            }</span>
                             : ""}

                            <span style={{ cursor: "pointer" }} onClick={() => this.onClickEmailSentToClients(value)}>{this.state.loadingModal === true ?
                                <i className="fa fa-spinner fa-spin text-info"></i>
                                : <i className="badge badge-info fa fa-info"> </i>
                            }</span>


                        </div>
                    }
                },
                {
                    accessor: 'download_url', Header: 'Report', Cell: ({ value }) => {
                        return <a download href={value} style={{ cursor: "pointer" }} className="" target="_blank"> <i className="badge badge-danger fa fa-download"> </i> </a>
                    }
                },
                {
                    accessor: 'report_created_status', Header: 'Report Generated', Cell: ({ value }) => {
                        return value === 'yes' ? <i className={"fa fa-check text-green greenCheck"}></i> : <i className="fa fa-close text-danger"></i>
                    }
                },
                {
                    accessor: 'data_matched', Header: 'Data Matching', Cell: ({ value }) => {
                        return value === 'yes' ? <i className={"fa fa-check text-green greenCheck"}></i> : <i className="fa fa-close text-danger"></i>
                    }
                },
                {
                    accessor: 'report_approved', Header: 'Approve Report', Cell: ({ value }) => {
                        return value.hasOwnProperty('report_type') && value.report_type !== null && value.report_type !== '' ?
                            <FormCheck checked={value.report_approved} onChange={(e) => this.onClickApproveClientReport(e, value)}></FormCheck>
                            : <i className="fa fa-close text-danger"></i>
                    }
                }
            ]);

        this.setState({
            newReportdata: reportdata,
            isNewReportdataLoading: false,
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-4">
                        <PageHeader
                            HeaderText="List of Clients"
                            Breadcrumb={[{ name: "List of Clients" }]}
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
                        className="toast-primary toast-top-right"
                        autohide={true}
                        delay={10000}
                    >
                        <Toast.Header className="toast-info mb-0">
                            {/* {this.state.toasterMessage} */}                            <>
                                {this.emailSentConfirmationToastMessage(this.state.toasterMessage)}
                            </>
                        </Toast.Header>
                    </Toast>
                    <div className="card col-lg-12 col-md-12">
                        <div className="body">
                            <div className="">
                                <MonthPicker onClickHandleMonthChange={(date) => { this.onClickHandleMonthChange(date) }} />
                                <Button className="btn btn-outline-info btn-info text-white float-left ml-4" onClick={() => {
                                    if (window.confirm('Generate report for all clients?')) {
                                        this.handleOnGenerateAllClientReports()
                                    };
                                }
                                } >Generate All Client MTD Reports</Button>

                            </div>
                            <div className="body pt-0">
                                {!this.state.isLoading ?
                                    <div className="main-content body table-responsive scrollableUserTableFixedHeader cardScrollBar m-r-5 clearfix" style={{ overflowX: "visible" }}>

                                        {/* Add DataTable Here 
                                        */}
                                        {this.state.reports.length > 0 && !this.state.isNewReportdataLoading ?
                                            <DataTable data={this.state.newReportdata.Dataset} columns={this.state.newReportdata.columnConfig} searchBoxStyle={true} />
                                            :
                                            <div className="row no_data_row p-2">
                                                <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                                    <h3 className="badge no_data_available">No Reports Available</h3>
                                                    <table className="table table-striped noDataAvailable"><thead><tr><th>#</th><th>Name</th><th>Description</th><th>Code</th><th>Valid From</th><th>Valid To</th><th>Is Active</th><th>Remarks</th><th>Created On</th><th>Modified On</th><th>Edit</th><th>Delete</th></tr></thead><tbody>


                                                        <tr><td scope="row" className="text-center">1</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>


                                                        <tr><td scope="row" className="text-center">2</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>

                                                        <tr><td scope="row" className="text-center">3</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr><tr><td scope="row" className="text-center">4</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr></tbody></table>
                                                </div>
                                            </div>
                                        }
                                    </div> :
                                    <Loader width="col-md-12 col-lg-12" height="350px" />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmSendEmailModal
                    key={"confirmSendEmailModal"}
                    size={"lg"}
                    title={"Mail Approval"}
                    clientDetails={!this.state.clientDetailsLoading && this.state.clientDetails}
                    show={this.state.showConfirmSendEmailModal}
                    onClose={(flag) => this.onCloseSendEmailModal(flag)}
                    handleOnClose={(flag) => this.onCloseSendEmailModal(flag)}
                />

                <EmailSentToClientsModal
                    key={"emailSentToClientsModal"}
                    size={"lg"}
                    title={"Client Emails"}
                    clientDetails={!this.state.sentEmailToClientDetailsLoading && this.state.sentEmailToClientDetails}
                    show={this.state.showEmailSentToModal}
                    onClose={() => {
                        this.setState({
                            showEmailSentToModal: !this.state.showEmailSentToModal
                        })
                    }}
                />
                <ConfirmBoxModal
                    key={"confirmBoxModal"}
                    size={"lg"}
                    title={"Confirm Box Modal"}
                    message={{ title: "Please Confirm Report Approval", body_title: "" }}
                    show={this.state.showConfirmBoxModal}
                    onClose={() => {
                        this.setState({
                            showConfirmBoxModal: !this.state.showConfirmBoxModal
                        })
                    }}
                    handleConfirmBoxClose={(flag) => this.onCloseApproveClientReport(flag)}
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
})(MTDReports);