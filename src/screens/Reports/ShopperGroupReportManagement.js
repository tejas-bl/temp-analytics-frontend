import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction } from '../../actions';
import PageHeader from "../../components/PageHeader";
import { convertDateTOLocale, getCurrentUser } from "../../helper/Utils";
import { Toast } from "react-bootstrap";
import { getAllClientsShopperGroupAllData } from "../../api/Dashboard/Reports";
import RefreshButton from "../../helper/Component/RefreshButton";
import DataTableShopperOverview from "../../helper/Component/DataTableShopperOverview";
import { endOfMonth, startOfMonth } from "date-fns";
import Loader from "../../helper/Loader";

class ShopperGroupReportManagement extends React.Component {
    constructor(props) {
        super(props);
        const currentDate = new Date();
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
            shopperGroupReportData: [],
            shopperGroupReportDataLoading: true,
            shopperGroupReportDataHeading: [],
            shopperGroupReportDataHeadingLoading: true,
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
    }

    async componentDidMount() {
        await this.getClientShopperGroupList(this.state.monthDetail);
    }

    async handleOnRefreshData() {
        await this.getClientShopperGroupList(this.state.monthDetail);
    }

    async componentDidUpdate(prevProps) {
        if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
            await this.getClientShopperGroupList(this.state.monthDetail);
        }
    }



    async getClientShopperGroupList(monthDetail) {
        const siteIdInput = this.props.sessionClient.web_id;
        let dynamicRows = [];

        this.setState({
            isLoading: true
        });
        let currentUser = getCurrentUser();

        const headerConfig = {
            headers: {
                Authorization: currentUser && currentUser.hasOwnProperty('data') && `Bearer ${currentUser.data.data.refresh_token}`,
            }
        }
        try {
            const shopperGroupReport = await getAllClientsShopperGroupAllData({ siteIdInput, monthDetail }, headerConfig);
            if (shopperGroupReport.data.hasOwnProperty('data')) {
                dynamicRows = JSON.parse(shopperGroupReport.data.data);
                this.setState({
                    isLoading: false,
                    shopperGroupReportDataHeadingLoading: false,
                    shopperGroupReportData: dynamicRows,
                    shopperGroupReportDataLoading: false,
                })
            } else {
                this.setState({
                    isLoading: false,
                    shopperGroupReportDataHeadingLoading: false,
                    shopperGroupReportData: [],
                    shopperGroupReportDataLoading: false,
                });
            }
            /*             const shopperGroupReport = await getAllClientsShopperGroupOverviewData({ siteIdInput, monthDetail }, headerConfig);
                        if (shopperGroupReport.data.hasOwnProperty('data')) {
                            let sgr = shopperGroupReport.data.data;
                            while (testCount < 1) {
                                //while (sgr.overviewData.length) {
                                let sgr_data = sgr.overviewData.shift();
                                sgr_data.split_time = `${formatDate(sgr_data.split_time)} - ${formatDate(new Date())}`
                                // sgr_data.pg_revenue = ``
                                // sgr_data.cg_revenue = `${formatDate(sgr_data.split_time)} - ${formatDate(new Date())}`
                                
            
                                sgr_data.statistically_significant = getStatisticalSignificance(sgr_data) === true ? 'Yes' : 'No';
                                sgr_data.subRows = [];
                                let sgrDataTemp = cloneDeep(tempSGRData);
                                // Get client split data
                                const sgrPersonaSplit = await getPersonaSplitDateData(sgr_data, headerConfig);
                                if (sgrPersonaSplit.data.hasOwnProperty('data') && sgrPersonaSplit.data.data.length) {
                                    let sgrPS = sgrPersonaSplit.data.data;
            
                                    sgrDataTemp.subRows = [];
                                    while (sgrPS.length) {
                                        let sgrps_data = sgrPS.shift();
                                        let splitName = sgrps_data.split.split("_");
                                        splitName = splitName[splitName.length - 1];
                                        sgrDataTemp.client_name = splitName;
                                        sgrDataTemp.site_id = sgrps_data.site_id;
                                        sgrDataTemp.persona_id = sgrps_data.persona_id;
            
            
                                        // create month heading object here 
                                        let monthHeadingObj = cloneDeep(tempSGRData);
                                        monthHeadingObj.client_name = "Month";
                                        monthHeadingObj.subRows = [];
            
                                        // create month heading object here 
                                        let weekHeadingObj = cloneDeep(tempSGRData);
                                        weekHeadingObj.client_name = "Week";
                                        weekHeadingObj.subRows = [];
            
                                        // Add Month Object to split object here 
                                        // craete month data object here 
                                        let monthPostData = {
                                            site_id: sgrps_data.site_id,
                                            split: splitName,
                                            persona_id: sgrps_data.persona_id,
                                            start_date: sgrps_data.start_date,
                                            end_date: sgrps_data.end_date,
                                        }
            
                                        // Get Monthly Data for specific split data
                                        const shopperGroupMonthwiseData = await getShopperGroupMonthwiseData(monthPostData, headerConfig);
                                        if (shopperGroupMonthwiseData.data.hasOwnProperty('data') && shopperGroupMonthwiseData.data.data.length) {
                                            let sgrMW = shopperGroupMonthwiseData.data.data;
                                            let sgrMWTemp = {};
                                            sgrMWTemp.subRows = [];
                                            while (sgrMW.length) {
                                                let sgrmw_data = sgrMW.shift();
                                                sgrmw_data.client_name = sgrmw_data.month;
                                                sgrmw_data.statistically_significant = getStatisticalSignificance(sgrmw_data) === true ? 'Yes' : 'No';
            
                                                let splitMonthStrByDash = sgrmw_data.month.split('-')
                                                let monthIndex = splitMonthStrByDash[splitMonthStrByDash.length - 1] - 1
                                                let monthYear = splitMonthStrByDash[0];
                                                let monthFirstandLastDate = getFirstAndLastDayUsingMonthIndex(monthYear, monthIndex)
                                                let weekFirstandLastDate = getFirstAndLastDayUsingWeekIndex(monthYear, monthIndex)
            
            
                                                // create Daily object here;
                                                let dailyHeadingObj = cloneDeep(tempSGRData);
                                                dailyHeadingObj.client_name = "Daily";
                                                dailyHeadingObj.subRows = [];
            
                                                let dayPostData = {
                                                    site_id: sgrps_data.site_id,
                                                    split: splitName,
                                                    persona_id: sgrps_data.persona_id,
                                                    start_date: monthFirstandLastDate.firstDayOfMonth,
                                                    end_date: monthFirstandLastDate.lastDayOfMonth,
                                                }
                                                const shopperGroupDaywiseData = await getShopperGroupDaywiseData(dayPostData, headerConfig);
                                                if (shopperGroupDaywiseData.data.hasOwnProperty('data') && shopperGroupDaywiseData.data.data.length) {
                                                    let sgrDW = shopperGroupDaywiseData.data.data;
                                                    let sgrDWTemp = {};
                                                    sgrDWTemp.subRows = [];
                                                    while (sgrDW.length) {
                                                        let sgrdw_data = sgrDW.shift();
                                                        sgrdw_data.client_name = convertDateTOLocale(sgrdw_data.day);
                                                        sgrdw_data.__status = convertDateTOLocale(sgrdw_data.day);
            
                                                        // create Daily object here;
                                                        dailyHeadingObj.subRows.push(sgrdw_data)
            
                                                    }
                                                }
                                                // create Daily object here;
                                                let weeklyHeadingObj = cloneDeep(tempSGRData);
                                                weeklyHeadingObj.client_name = "Weekly";
                                                weeklyHeadingObj.subRows = [];
            
                                                const shopperGroupWeekwiseData = await getShopperGroupWeekwiseData(dayPostData, headerConfig);
                                                if (shopperGroupWeekwiseData.data.hasOwnProperty('data') && shopperGroupWeekwiseData.data.data.length) {
                                                    let sgrWW = shopperGroupWeekwiseData.data.data;
                                                    let sgrWWTemp = {};
                                                    sgrWWTemp.subRows = [];
                                                    while (sgrWW.length) {
                                                        let sgrww_data = sgrWW.shift();
                                                        sgrww_data.client_name = sgrww_data.week;
                                                        let weekFirstandLastDate = getFirstAndLastDayUsingWeekIndex(monthYear, sgrww_data.week)
            
                                                        sgrww_data.__status = `${convertDateTOLocale(weekFirstandLastDate.firstDayOfWeek)} - ${convertDateTOLocale(weekFirstandLastDate.lastDayOfWeek)}`;
            
                                                        // create Daily object here;
                                                        weeklyHeadingObj.subRows.push(sgrww_data)
            
                                                    }
                                                }
            
                                                // add daily and weekly object in subrows here;
                                                sgrmw_data.subRows = [
                                                    dailyHeadingObj,
                                                    weeklyHeadingObj
                                                ];
            
                                                // add month data to month object here
                                                monthHeadingObj.subRows.push(sgrmw_data)
                                            }
                                        }
                                        sgrDataTemp.subRows.push(
                                            monthHeadingObj,
                                        );
                                        sgr_data.subRows.push(sgrDataTemp)
            
                                        sgrDataTemp = cloneDeep(tempSGRData);
                                        sgrDataTemp.subRows = [];
                                    }
                                }
                                dynamicRows.push(sgr_data);
                                testCount++;
                            }
            
                            this.setState({
                                isLoading: false,
                                shopperGroupReportDataHeading: shopperGroupReportHeaders,
                                shopperGroupReportDataHeadingLoading: false,
                                shopperGroupReportData: dynamicRows,
                                shopperGroupReportDataLoading: false,
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                shopperGroupReportDataHeading: shopperGroupReportHeaders,
                                shopperGroupReportDataHeadingLoading: false,
                                shopperGroupReportData: [],
                                shopperGroupReportDataLoading: false,
                            });
                        } */
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
                            HeaderText="Sales Overview"
                            Breadcrumb={[{ name: "Sales Overview" }]}
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
                            <div className="body pt-0" id="shopperOverviewReportManagement">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <RefreshButton customCSS={{ float: "right", marginTop: "5px", marginBottom: "10px", verticalAlign: "-webkit-baseline-middle", verticalAlign: "baseline-middle" }} handleOnRefreshData={() => this.handleOnRefreshData()} />
                                    </div>
                                </div>
                                {!this.state.isLoading ?
                                    <div className="main-content body table-responsive scrollableUserTableFixedHeader cardScrollBar m-r-5 clearfix" style={{ overflowX: "visible", maxHeight: "680px" }}>
                                        {/* Add DataTable Here cardScrollBar
                                        */}
                                        {this.state.shopperGroupReportData.length > 0 && !this.state.shopperGroupReportDataLoading && !this.state.shopperGroupReportDataHeadingLoading ?
                                            <>
                                                <DataTableShopperOverview data={this.state.shopperGroupReportData} headers={this.state.shopperGroupReportDataHeading} columns={this.state.newReportdata.columnConfig} searchBoxStyle={true} />
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
                                    : <Loader width="col-md-12 col-lg-12" height="150px" />
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
})(ShopperGroupReportManagement);