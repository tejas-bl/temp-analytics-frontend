import React from "react";
import DataTable from "../../helper/Component/DataTable";

class CheckoutPageConversionRateCard extends React.Component {
    render() {
        return (
            <div className="col-lg-12 col-md-12  pl-0 pr-0">
                <div className="card d-flex flex-row flex-wrap">
                    <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h2 className="pb-0">Checkout page - Conversion rate</h2>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        {this.props.checkoutPageConversionRateData.Dataset && this.props.checkoutPageConversionRateData.Dataset.length > 0 ?
                            <div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                <DataTable searchFilter={false} data={this.props.checkoutPageConversionRateData.Dataset} columns={this.props.checkoutPageConversionRateData.columnConfig} />

                                {/* <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Publisher</th>
                                            <th> Code Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.props.data.map((data, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{++i}</td>
                                                      <td><div style={{width:"150px"}}> {data.publisher !== "" ? data.publisher : "Unmapped Publisher"}</div></td>
                                                    <td>{data.wrong_coupon_count}</td>
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
                                            <thead><tr><th>Codes</th><th>Codes Used</th><th>Codes Conv.Rate</th></tr></thead>
                                            <tbody>

                                                <tr>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                </tr>


                                                <tr>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                </tr>


                                                <tr>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                </tr>

                                                <tr>
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

export default CheckoutPageConversionRateCard;
