import React from "react";
class TopCompetitorsProducts extends React.Component {
  render() {
    const data = this.props.topCompetitorsProducts.data;
    return (
      <div className="col-lg-12 col-md-12 mb-3 card pt-3">
        <h6 className="card-title mb-2">Top Competitors Products on Your Site</h6>
        <div className="body table-responsive">

          {data !== undefined && data.length > 0 ?
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Competitor's Name</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => {
                  return (
                    <tr key={i++}>
                      <td><img alt={d.product} src={d.img} height="30px" /></td>
                      <td>{d.product}</td>
                    </tr>)
                })}
              </tbody>
            </table> :
            <div className="row no_data_row p-2">
              <div className="col-md-12 col-lg-12 no_data_avl_md12">
                <h3 className="badge no_data_available">No Data Available</h3>
                <table className="table table-striped noDataAvailable"><thead><tr><th>#</th><th>Competitor's Name</th></tr></thead><tbody>

                  <tr><td>
                    <i className="icon-ban" ></i>
                  </td><td>No Data Available</td></tr>

                  <tr><td>
                    <i className="icon-ban" ></i>
                  </td><td>No Data Available</td></tr>

                  <tr><td>
                    <i className="icon-ban" ></i>
                  </td><td>No Data Available</td></tr></tbody></table>
              </div>
            </div>

          }
          {/* <div className="row no_data_row">
                    <h3 className="badge no_data_available">No Data Available</h3>
                    <img src={no_data_available} width="auto" height="300px" alt="No data available" />
                  </div> */}
        </div>
      </div>
    );
  }
}

export default TopCompetitorsProducts;
