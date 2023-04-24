import React from "react";
class AttributeHijackingExtensionShopper extends React.Component {
    render() {
        return (
            <div className="col-lg-12 col-md-12  pl-0 pr-0">
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0 pl-1">
                            <h2 className="pb-3">Attribution Hijacking {this.props.impactData.industryStdAttributeHijacking ? <span className="text-muted industryAvg">Based on Industry Avg.</span> : ""}</h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.impactData.attributeHijacking && this.props.impactData.attributeHijacking.length ?
                            <div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Affiliate metrics for extension users</th>
                                            <th>Sessions</th>
                                            <th>Sessions(%)</th>
                                            <th>Orders</th>
                                            <th>Orders(%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.impactData.attributeHijacking.map((d, i) => {
                                            return <tr key={i}>
                                                <td>{Object.keys(d)[0]}</td>
                                                <td>{Object.values(d)[0]['sessions']}</td>
                                                <td>{Object.values(d)[0]['sessions_perc'] !== "" ? `${parseFloat(Object.values(d)[0]['sessions_perc']).toFixed(2)}%` : ""}</td>
                                                <td>{Object.values(d)[0]['orders']}</td>
                                                <td>{Object.values(d)[0]['orders_perc'] !== "" ? `${parseFloat(Object.values(d)[0]['orders_perc']).toFixed(2)}%` : ""}</td>
                                            </tr>


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

export default AttributeHijackingExtensionShopper;
