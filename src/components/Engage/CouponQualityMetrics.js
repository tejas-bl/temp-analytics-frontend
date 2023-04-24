import React from "react";
import DataTable from "../../helper/Component/DataTable";

class CouponQualityMetrics extends React.Component {
    render() {
        return (
            <div className="col-lg-12 col-md-12  pl-0 pr-0">
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h2 className="pb-0">Coupon Quality Metrics {/* <span className="cqm_overll_score">{this.props.couponQualityMetricsOverallScore !== undefined && this.props.couponQualityMetricsOverallScore !== false && `Overall Score ${this.props.couponQualityMetricsOverallScore}/10`}</span> */}</h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.couponQualityMetrics !== undefined && this.props.couponQualityMetrics.Dataset && this.props.couponQualityMetrics.Dataset.length > 0 ?
                            <><div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <DataTable searchFilter={false} data={this.props.couponQualityMetrics.Dataset} columns={this.props.couponQualityMetrics.columnConfig} />
                            </div>
                            </> :
                            <div className="body table-responsive" >
                                <div className="row no_data_row p-2">
                                    <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                        <h3 className="badge no_data_available">No Data Available</h3>
                                        <table className="table table-striped noDataAvailable">
                                            <thead><tr><th>Coupon</th><th>Quality</th><th>Total Sessions</th><th>Total Orders</th></tr></thead>
                                            <tbody>

                                                <tr>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                </tr>
                                                <tr>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                </tr>
                                                <tr>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                </tr>
                                                <tr>
                                                    <td>---</td>
                                                    <td>---</td>
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

export default CouponQualityMetrics;
