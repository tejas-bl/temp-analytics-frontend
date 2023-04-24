import React from "react";
import DataTable from "../../helper/Component/DataTable";
import HighlightSection from "../HighlightSection";

class HesitantShopperTopUserDropOff extends React.Component {
    render() {
        return (
            <div className="col-lg-12 col-md-12 pl-0 pr-0 TopPagesWhereUsersDropOff">
                <HighlightSection location={this.props.location} placement="left" highlightSectionId="TopPagesWhereUsersDropOff" target={this.props.locationObject.hash} />
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h2 className="pb-0">
                                Top Pages where Users Drop Off
                            </h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.hasOwnProperty("hesitantTopDropoffPages") && this.props.hesitantTopDropoffPages.Dataset && this.props.hesitantTopDropoffPages.Dataset.length > 0 ?
                            <div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <DataTable customClassName={"pageURLTDFlex"} data={this.props.hesitantTopDropoffPages.Dataset} columns={this.props.hesitantTopDropoffPages.columnConfig} />

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

export default HesitantShopperTopUserDropOff;
