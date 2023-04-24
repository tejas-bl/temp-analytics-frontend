import React from "react";
import DataTable from "../../helper/Component/DataTable";
import HighlightSection from "../HighlightSection";

class EngageExtensionPublisherBreakdown extends React.Component {
    render() {
        return (
            <div className="col-lg-12 col-md-12 pl-0 pr-0 PublisherAttributionBreakdown">
                <HighlightSection location={this.props.location} placement="left" highlightSectionId="PublisherAttributionBreakdown" target={this.props.locationObject.hash} />
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h2 className="pb-0">
                                Publisher Attribution Breakdown
                            </h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.hasOwnProperty("publisherBreakdown") && this.props.publisherBreakdown.Dataset && this.props.publisherBreakdown.Dataset.length > 0 ?
                            <div className="body table-responsive scrollableTableFixedHeader cardScrollBar clearfix">
                                <DataTable data={this.props.publisherBreakdown.Dataset} columns={this.props.publisherBreakdown.columnConfig} />

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
                                            <thead><tr><th>Extension</th><th>Percentage</th></tr></thead>
                                            <tbody>

                                                <tr><td>No Data Available</td><td>No Data Available</td></tr>
                                                <tr><td>No Data Available</td><td>No Data Available</td></tr>
                                                <tr><td>No Data Available</td><td>No Data Available</td></tr>
                                                <tr><td>No Data Available</td><td>No Data Available</td></tr>
                                                <tr><td>No Data Available</td><td>No Data Available</td></tr>
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

export default EngageExtensionPublisherBreakdown;
