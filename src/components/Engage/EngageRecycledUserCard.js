import React from "react";
import DataTable from "../../helper/Component/DataTable";
import { getColor } from "../../helper/Utils";
import WcAffiliateDetailsModalCard from "./WcAffiliateDetailsModalCard";

class EngageRecycledUserCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: {
                linksData: [],
                labelsData: [],
                graphHeight: '500px'
            },
            affilaiteDetailsTableData: [],
            affilaiteDetailsTableDataLoading: true,
            showAffiliateDetailsModal: false,
            showAffiliateDetailsModalLoading: true
        }

        this.onClickAffiliateDetailsModal = this.onClickAffiliateDetailsModal.bind(this)
    }
    onClickAffiliateDetailsModal(affiliate, affiliatDetails) {
        const affilaiteDetailsTableData = [];
        const affilaiteDetailsSourceFlowLinkData = [];
        const affilaiteDetailsSourceFlowLabelData = [];
        const color = getColor();
        affilaiteDetailsSourceFlowLabelData.push({
            name: affiliate,
            itemStyle: {
                color: color,
                borderColor: color
            }
        })
        if (affiliatDetails !== undefined) {
            affiliatDetails = JSON.parse(affiliatDetails);
            let pubSources = affiliatDetails.pub_sources.split(",");
            let pubSessions = affiliatDetails.pub_sessions.split(",");

            pubSources.map((d, i) => {

                affilaiteDetailsTableData.push({
                    source: affiliate,
                    modalColumn1: d,
                    modalColumn2: pubSessions[i] + "%"
                })

                const color = getColor();
                affilaiteDetailsSourceFlowLinkData.push({
                    source: affiliate,
                    target: d,
                    value: parseInt(pubSessions[i])
                })

                affilaiteDetailsSourceFlowLabelData.push({
                    name: d,
                    itemStyle: {
                        color: color,
                        borderColor: color
                    }
                })
            })
        }

        this.setState({
            showAffiliateDetailsModal: !this.state.showAffiliateDetailsModal,
            affilaiteDetailsTableData,
            details: {
                linksData: affilaiteDetailsSourceFlowLinkData,
                labelsData: affilaiteDetailsSourceFlowLabelData,
                graphHeight: affilaiteDetailsSourceFlowLabelData.length * 30
            }
        })
    }
    render() {
        return (
            <div className="col-lg-12 col-md-12">
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h2 className="pb-0">
                                Affiliate Insights
                            </h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">


                        {this.props.recycledata ?
                            <div className="body table-responsive recycled_user_data_table cardScrollBar m-r-5 clearfix" >
                                <DataTable data={this.props.recycledata.Dataset} columns={[
                                    {
                                        accessor: 'publisher', Header: 'Publisher', Cell: data => {
                                            return <>
                                                {data.cell.value}
                                                <i className="fa fa-info moreInfoIcon" onClick={() => this.onClickAffiliateDetailsModal(data.cell.value, data.row.original.modalDetails)}></i>
                                            </>
                                        }
                                    },
                                    { accessor: 'sessions', Header: 'Total Sessions' },
                                    { accessor: 'ms_sessions', Header: 'Recycled Sessions' },
                                    { accessor: 'percentageRU', Header: '% of Recycled Sessions' },
                                    { accessor: 'total_conversion', Header: 'Total Orders' },
                                    { accessor: 'ms_conversion', Header: 'Recycled Orders' },
                                    { accessor: 'percentageRO', Header: '% of Recycled Orders' },
                                    { accessor: 'modalDetails', Header: 'Recycled User Details' }
                                ]} />
                            </div> :
                            <div className="body table-responsive" >
                                <div className="row no_data_row p-2">
                                    <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                        <h3 className="badge no_data_available">No Data Available</h3>
                                        <table className="table table-striped noDataAvailable"><thead><tr><th>Publisher</th><th>Total Sessions</th><th>First Page Affiliates Session</th><th>First Page Affiliates Conversion</th><th>Total Conversions</th><th>Percentage Recycled Users</th><th>Percentage Recycled Orders</th></tr></thead><tbody>

                                            <tr><td>No Data Available</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td><td>---</td></tr>


                                            <tr><td>No Data Available</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td><td>---</td></tr>

                                            <tr><td>No Data Available</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td><td>---</td></tr>

                                            <tr><td>No Data Available</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td>

                                                <td>---</td><td>---</td></tr></tbody></table>

                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                </div>

                <WcAffiliateDetailsModalCard
                    key={"wc_affiliate_details"}
                    size={"lg"}
                    title={this.state.details.labelsData.length ? `TruSource Insight for ${this.state.details.labelsData[0].name}` : "TruSource Insight"}
                    tableHeading = {{head1 : "Top Sources", head2: "Total Sessions"}}
                    data={this.state.affilaiteDetailsTableData}
                    sourceFlowData={this.state.showAffiliateDetailsModal && this.state.details}
                    show={this.state.showAffiliateDetailsModal}
                    onClose={(flag) => this.onClickAffiliateDetailsModal(flag)}
                />
            </div>
        );
    }
}

export default EngageRecycledUserCard;
