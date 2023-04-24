import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction } from "../../../../actions";
class WrongCouponMetrics extends React.Component {
    render() {
        return (
            <div className="col-lg-12 col-md-12  pl-0 pr-0">
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0 pl-1">
                            <h2 className="pb-3">{this.props.shopperRecord.wc} Metrics {this.props.impactData.impactIndStdStatus ? <span className="text-muted industryAvg">Based on Industry Avg.</span> : ""}</h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.impactData.data.impact && this.props.impactData.data.impact.length ?
                            <div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>BreakDown</th>
                                            <th>Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.props.impactData.data.impact.map((d,i)=>{
                                            if(Object.values(d)[0] !== undefined && Object.values(d)[0] !== null && Object.values(d)[0] != 0){
                                                return <tr key={i}>
                                                <td>{Object.keys(d)[0]}</td>
                                                <td>{Object.values(d)[0]}</td></tr>
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
})(WrongCouponMetrics);