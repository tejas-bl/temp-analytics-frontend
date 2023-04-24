import React from "react";
import { connect } from "react-redux";
import DataTable from "../../helper/Component/DataTable";
import HighlightSection from "../HighlightSection";
import { websiteRecordAction } from "../../actions";
class HesitantShopperTriggerTimings extends React.Component {
    render() {
        return (
            <div className="col-lg-12 col-md-12 pl-0 pr-0 HesitantShopperMetrics">
                <HighlightSection location={this.props.location} placement="left" highlightSectionId="HesitantShopperMetrics" target={this.props.locationObject.hash} />
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h2 className="pb-0">
                                {this.props.shopperRecord.ti3} Metrics {this.props.hasOwnProperty("hesitantTriggerTimings") && this.props.hesitantTriggerTimings.industryStd && <span className="text-muted industryAvg">( Based on Industry Avg.)</span>}
                            </h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.hasOwnProperty("hesitantTriggerTimings") && this.props.hesitantTriggerTimings.tableData.Dataset && this.props.hesitantTriggerTimings.tableData.Dataset.length > 0 ?
                            <div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <DataTable data={this.props.hesitantTriggerTimings.tableData.Dataset} columns={this.props.hesitantTriggerTimings.tableData.columnConfig} searchFilter={false} />

                                {/* <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Extension</th>
                                            <th>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.props.data.map((data, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{++i}</td>
                                                      <td>{data.ext_name}</td>
                                                    <td>{data.percentage}%</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table> */}
                            </div> :
                            <div className="body table-responsive" >
                                <div className="row no_data_row p-2">
                                    <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                        <h3 className="badge no_data_available">No Data Available</h3>
                                        <table className="table table-striped noDataAvailable">
                                            <thead><tr><th>Page Url</th><th>Sessions</th></tr></thead>
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
})(HesitantShopperTriggerTimings);
