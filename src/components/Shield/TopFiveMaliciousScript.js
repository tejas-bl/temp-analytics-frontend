import React from "react";
import { convertNumbertoCurrencyFormat } from "../../helper/Utils";
import HighlightSection from "../HighlightSection";
class TopFiveMaliciousScript extends React.Component {
  render() {
    const data = this.props.topMaliciousPages.data;
    // console.log(data);
    return (
      <div className="card col-lg-12 col-md-12 pt-3 TopFiveMaliciousScript" id={"TopFiveMaliciousScript"}>
        <HighlightSection location={this.props.location} placement="left" highlightSectionId="TopFiveMaliciousScript" target={this.props.locationObject.hash}/>
        <div className="">
          <div className="col-lg-12 col-md-12 p-0">
            <h6 className="card-title mb-2">Top 5 pages with Malicious Scripts Injected</h6>
            <div className="body table-responsive">
              {data !== undefined && data.length > 0 ? <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Pages</th>
                    <th>Scripts</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => {
                    return (
                      <tr key={i}>

                        <td>{d.page_url}</td>
                        <td>{convertNumbertoCurrencyFormat(d.is_blocked, '')}</td>
                      </tr>)
                  })
                  }
                </tbody>
              </table> :

                <div className="row no_data_row p-2">
                  <div className="col-md-12 col-lg-12 no_data_avl_md12">
                    <h3 className="badge no_data_available">No Data Available</h3>
                    <table className="table table-striped noDataAvailable"><thead><tr><th>Pages</th><th>Scripts</th></tr></thead><tbody>


                      <tr><td>No Data Available</td><td>---</td></tr>

                      <tr><td>No Data Available</td><td>---</td></tr>

                      <tr><td>No Data Available</td><td>---</td></tr><tr><td>No Data Available</td><td>---</td></tr></tbody></table>

                  </div>
                </div>
              }
              {/* <div className="row no_data_row">
              <h3 className="badge no_data_available">No Data Available</h3>
              <img src={no_data_available} width="auto" height="300px" alt="No data available" />
            </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TopFiveMaliciousScript;
