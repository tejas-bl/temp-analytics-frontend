import React from "react";
import { connect } from "react-redux";
import HighlightSection from "../../../HighlightSection";
import { websiteRecordAction } from "../../../../actions";
class CouponRunnerShopperImpact extends React.Component {
    render() {
        const dayCount = this.props.impactData.dayCount.length && this.props.impactData.dayCount[0].hasOwnProperty('days_with_coupon_runner_count')  ? this.props.impactData.dayCount[0].days_with_coupon_runner_count * 1 : "";
        return (
            <div className="col-lg-12 col-md-12  pl-0 pr-0 CouponQualityMetrics">
                <HighlightSection location={this.props.location} placement="left" highlightSectionId="CouponQualityMetrics" target={this.props.locationObject.hash} />
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0 pl-1">
                            <h2 className="pb-3">{this.props.shopperRecord.epr} Metrics {this.props.impactData.industryStd ? <span className="text-muted industryAvg">Based on Industry Avg.</span> : ""}</h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.impactData.data && this.props.impactData.data.length && !this.props.impactData.industryStd ?
                            <div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>BreakDown</th>
                                            <th>Impact {(dayCount * 1) > 0 ? `for ${dayCount} days` : ""}</th> 
                                            {dayCount >= 30 ? "" : <th>Projected Impact for 30 days</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.impactData.data.map((d, i) => {
                                            if (dayCount < 30 && Object.values(Object.values(d)[0])[0] !== undefined && Object.values(Object.values(d)[0])[0] !== null && Object.values(Object.values(d)[0])[0] != 0) {
                                                return <tr key={i}>
                                                    <td>{Object.keys(d)[0]}</td>
                                                    <td>{Object.values(Object.values(d)[0])[0] !== undefined ? `${Object.values(Object.values(d)[0])[0]}` : "NA"}</td>
                                                    <td>{Object.values(Object.values(d)[0])[1] !== undefined ? `${Object.values(Object.values(d)[0])[1]}` : "NA"}</td>
                                                    </tr>
                                            } else if ( Object.values(Object.values(d)[0])[0] !== undefined && Object.values(Object.values(d)[0])[0] !== null && Object.values(Object.values(d)[0])[0] != 0) {
                                                return <tr key={i}>
                                                    <td>{Object.keys(d)[0]}</td>
                                                    <td>{Object.values(Object.values(d)[0])[0]}</td>
                                                </tr>
                                            }

                                        })}
                                    </tbody></table>
                            </div> :
                            this.props.impactData.data && this.props.impactData.data.length && this.props.impactData.industryStd ?
                                <div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>BreakDown</th>
                                                <th>Projected Impact (30 days)</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {this.props.impactData.data.map((d, i) => {
                                                if (Object.values(Object.values(d)[0])[0] !== undefined && Object.values(Object.values(d)[0])[0] !== null && Object.values(Object.values(d)[0])[0] != 0) {
                                                    return <tr key={i}>
                                                        <td>{Object.keys(d)[0]}</td>
                                                        <td>{Object.values(Object.values(d)[0])[0]} {Object.values(Object.values(d)[0])[1] !== undefined && `(${Object.values(Object.values(d)[0])[1]})`}</td></tr>
                                                } else if (Object.values(Object.values(d)[0])[1] !== undefined && Object.values(Object.values(d)[0])[1] !== null && Object.values(Object.values(d)[0])[1] != 0) {
                                                    return <tr key={i}>
                                                        <td>{Object.keys(d)[0]}</td>
                                                        <td>{Object.values(Object.values(d)[0])[1]}</td></tr>
                                                }

                                            })}
                                        </tbody></table>
                                </div> :
                                <div className="body table-responsive" >
                                    <div className="row no_data_row p-2">
                                        <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                            <h3 className="badge no_data_available">No Data Available</h3>
                                            <table className="table table-striped noDataAvailable">
                                                <tbody>

                                                    <tr>
                                                        <td>---</td>
                                                        <td>---</td>
                                                    </tr>


                                                    <tr>
                                                        <td>---</td>
                                                        <td>---</td>
                                                    </tr>


                                                    <tr>
                                                        <td>---</td>
                                                        <td>---</td>
                                                    </tr>

                                                    <tr>
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
            </div>
        );
    }
}

const mapStateToProps = ({
    websiteRecordReducer
}) => ({
    shopperRecord: websiteRecordReducer.shopperRecord
});

export default connect(mapStateToProps, {
    websiteRecordAction
})(CouponRunnerShopperImpact);
