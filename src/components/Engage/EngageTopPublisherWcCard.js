import React from "react";
import { Link } from "react-router-dom";
import DataTable from "../../helper/Component/DataTable";
import { getColor } from "../../helper/Utils";
import HighlightSection from "../HighlightSection";
import WcAffiliateDetailsModalCard from "./WcAffiliateDetailsModalCard";

class EngageTopPublisherWcCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: {},
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
            let wcCode = affiliatDetails.wc_code.split(",");
            let wcCount = affiliatDetails.wc_count.split(",");

            wcCode.map((d, i) => {
                const color = getColor();
                affilaiteDetailsTableData.push({
                    source: affiliate,
                    modalColumn1: d,
                    modalColumn2: wcCount[i]
                })

                affilaiteDetailsSourceFlowLinkData.push({
                    source: affiliate,
                    target: d,
                    value: parseInt(wcCount[i])
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
            <div className="col-lg-12 col-md-12  pl-0 pr-0 WrongCouponByAffiliateId">
                <HighlightSection location={this.props.location} placement="left" highlightSectionId="WrongCouponByAffiliateId" target={this.props.locationObject.hash} />
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h2 className="pb-0">Wrong Coupon by Affiliate ID</h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.wrongcouponaffilatedata.Dataset && this.props.wrongcouponaffilatedata.Dataset.length > 0 ?
                            <><div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <DataTable data={this.props.wrongcouponaffilatedata.Dataset} columns={[
                                    { accessor: 'no', Header: '#', width: 50 },
                                    {
                                        accessor: 'affiliate', Header: 'Affiliate', Cell: data => {
                                            return <>
                                                {data.cell.value}
                                                <i className="fa fa-info moreInfoIcon" onClick={() => this.onClickAffiliateDetailsModal(data.cell.value, data.row.original.modalDetails)}></i>
                                            </>
                                        }
                                    },
                                    { accessor: 'wrong_coupon_count', Header: 'Wrong Coupon Code Count' },
                                    { accessor: 'modalDetails', Header: 'affiliate Details' }
                                ]} />
                            </div>
                                <span className="greyMessage affiliateMessage">We can map affiliates with Affiliate Ids to give you better insight. Please send mapping to <Link to='#' onClick={(e) => { window.location.href = 'mailto:support@brandlock.io'; e.preventDefault(); }} >support@brandlock.io</Link></span>

                            </> :
                            <div className="body table-responsive" >
                                <div className="row no_data_row p-2">
                                    <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                        <h3 className="badge no_data_available">No Data Available</h3>
                                        <table className="table table-striped noDataAvailable">
                                            <thead><tr><th>Affiliate</th><th>Wrong Coupon Code Count</th></tr></thead>
                                            <tbody>

                                                <tr><td>No Data Available</td>

                                                    <td>---</td>

                                                    <td>---</td>

                                                </tr>


                                                <tr><td>No Data Available</td>

                                                    <td>---</td>

                                                    <td>---</td>

                                                </tr>


                                                <tr><td>No Data Available</td>

                                                    <td>---</td>

                                                    <td>---</td>

                                                </tr>

                                                <tr><td>No Data Available</td>

                                                    <td>---</td>

                                                    <td>---</td>

                                                </tr>
                                            </tbody></table>

                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                </div>

                <WcAffiliateDetailsModalCard
                    key={"wc_affiliate_details"}
                    size={"lg"}
                    title={"Affiliate WC codes"}
                    tableHeading={{ head1: "Top Code", head2: "Total Sessions" }}
                    data={this.state.affilaiteDetailsTableData}
                    sourceFlowData={this.state.showAffiliateDetailsModal && this.state.details}
                    show={this.state.showAffiliateDetailsModal}
                    onClose={(flag) => this.onClickAffiliateDetailsModal(flag)}
                />
            </div>
        );
    }
}

export default EngageTopPublisherWcCard;
