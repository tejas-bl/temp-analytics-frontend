import React from "react";
import GoogleAnalytics from "../../assets/images/google_analytics_transparent.png";
import AdobeAnalytics from "../../assets/images/adobe-analytics.png";
import { connect } from "react-redux";
import { websiteRecordAction } from "../../actions";
import { convertNumbertoCurrencyFormat, convertSecondsToReadableFormat } from "../../helper/Utils";

class ShieldMetricTableCard extends React.Component {
  render() {
    return (
      <div className="col-lg-12 col-md-12">
        <div className="card d-flex flex-row flex-wrap pt-3 pb-3">
          <div className="col-lg-12 col-md-12">
            <div className="header pb-0 pt-0">
              <h2>
                KPI Overview {this.props.industryStd !== null && this.props.industryStd ? <span className="text-muted industryAvg"> (Based on Industry Avg.)</span> : ""}
              </h2>
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <div className="body table-responsive">
              {this.props.data && this.props.data.length > 0 ?
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Brandlock Script Off</th>
                      <th>Brandlock Script On</th>
                      <th>Improvement</th>
                    </tr>
                  </thead>
                  <tbody>

                    {this.props.data.map((data, i, allData) => {
                      if (data.hasOwnProperty("difference") && data.difference > 0) {
                        return (
                          <tr key={`shield_metric_table_${i}`}>
                            <td>{data.name}</td>
                            <td>{`${allData[i]["name"] === "Session Duration" && data.cg !== undefined && data.cg !== null && data.cg !== 0 ? convertSecondsToReadableFormat(data.cg) : data.currency === true ? convertNumbertoCurrencyFormat(data.cg, this.props.sessionClient.currency, 2, 2) : `${parseFloat(data.cg).toFixed(2)}` + data.unit}`}</td>
                            <td>{`${allData[i]["name"] === "Session Duration" && data.pg !== undefined && data.pg !== null && data.pg !== 0 ? convertSecondsToReadableFormat(data.pg) : data.currency === true ? convertNumbertoCurrencyFormat(data.pg, this.props.sessionClient.currency, 2, 2) : `${parseFloat(data.pg).toFixed(2)}` + data.unit}`}</td>
                            <td><i style={{ fontSize: "12px" }} className={data.icon}></i>{`${parseFloat(data.difference).toFixed(2)}%`}</td>
                          </tr>
                        );
                      }
                    })
                    }
                  </tbody>
                </table> :
                <div className="row no_data_row p-2">
                  <div className="col-md-12 col-lg-12 no_data_avl_md12">
                    <h3 className="badge no_data_available">No Data Available</h3>
                    <table className="table table-striped noDataAvailable"><thead><tr><th>Metric</th><th>Brandlock Script On</th><th>Brandlock Script Off</th><th>Improvement</th></tr></thead><tbody>

                      <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr>

                      <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr>

                      <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr><tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr></tbody></table>
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

        <div className="text-right">
          <span> Data From your </span>
          {this.props.platform === "GA" || (this.props.industryStd !== null && this.props.industryStd) ? <img style={{ width: "auto", height: "30px" }} alt="source google analytics" src={GoogleAnalytics} /> : <img style={{ width: "auto", height: "45px" }} alt="source Adobe analytics" src={AdobeAnalytics} />}

        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  websiteRecordReducer
}) => ({
  shopperRecord: websiteRecordReducer.shopperRecord,
  sessionClient: websiteRecordReducer.sessionClient
});

export default connect(mapStateToProps, {
  websiteRecordAction
})(ShieldMetricTableCard);