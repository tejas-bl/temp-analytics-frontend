import React from "react";
import DataTable from "../../../../helper/Component/DataTable";

class RecycleAffiliateSessionsExtensionShopper extends React.Component {
    render() {
        return (
            <div className="col-lg-12 col-md-12">
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h2 className="pb-0">
                                Recycle Affiliate Sessions
                            </h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.impactData && this.props.impactData.hasOwnProperty('Dataset') && this.props.impactData.Dataset.length ?
                            <div className="body table-responsive recycled_user_data_table cardScrollBar m-r-5 clearfix" >
                                <DataTable data={this.props.impactData.Dataset} columns={this.props.impactData.columnConfig} />
                            </div> :
                            <div className="body table-responsive" >
                                <div className="row no_data_row p-2">
                                    <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                        <h3 className="badge no_data_available">No Data Available</h3>
                                        <table className="table table-striped noDataAvailable"><thead><tr><th>Publisher</th><th>Total Sessions</th><th>Sessions with Recycled Users</th><th>% of Recycled Sessions</th><th>Total Orders</th><th>Sessions with Recycled Orders</th><th>% of Recycled Orders</th></tr></thead><tbody>

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
            </div>
        );
    }
}

export default RecycleAffiliateSessionsExtensionShopper;
