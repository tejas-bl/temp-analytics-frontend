import React from "react";
import { connect } from "react-redux";
import DataTable from "../../helper/Component/DataTable";
import HighlightSection from "../HighlightSection";
import { websiteRecordAction } from "../../actions";
class EngageTopCodesCard extends React.Component {
    render() {
        return (
            <div className="col-lg-12 col-md-12  pl-0 pr-0 TopWrongCouponCodes">
                <HighlightSection location={this.props.location} placement="left" highlightSectionId="TopWrongCouponCodes" target={this.props.locationObject.hash} />
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h2 className="pb-0">
                                Top {this.props.shopperRecord.wc} Codes
                            </h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {/* <div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Code</th>
                                            <th>Session Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.props.data.map((data, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{++i}</td>
                                                      <td><div style={{width:"150px"}}> {data.code_lower}</div></td>
                                                    <td>{data.sessions}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div> */}
                        {this.props.wrongcoupondata.Dataset && this.props.wrongcoupondata.Dataset.length > 0 ?
                            <div className="scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <DataTable data={this.props.wrongcoupondata.Dataset} columns={this.props.wrongcoupondata.columnConfig} />
                            </div> :
                            <div className="body table-responsive" >
                                <div className="row no_data_row p-2">
                                    <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                        <h3 className="badge no_data_available">No Data Available</h3>
                                        <table className="table table-striped noDataAvailable">
                                            <thead><tr><th>Code</th><th>Session Count</th></tr></thead>
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
})(EngageTopCodesCard);
