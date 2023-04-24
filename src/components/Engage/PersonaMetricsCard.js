import React from "react";
import GoogleAnalytics from "../../assets/images/google_analytics_transparent.png"
import AdobeAnalytics from "../../assets/images/adobe-analytics.png"
import { connect } from "react-redux";
import { websiteRecordAction } from "../../actions";
import { convertNumbertoCurrencyFormat } from "../../helper/Utils";
class PersonaMetricsCard extends React.Component {
  dataToDisplay = [];
  render() {
    const { data } = this.props;
    if (data && data.length > 0) {
      data.map((e) => {
        if (e.hasOwnProperty('gain')) {
          e.gain *= 1;
        }
        if (e.hasOwnProperty('brandlock_on')) {
          e.brandlock_on *= 1;
        }
        if (e?.gain > 0 && e?.brandlock_on > 0 && e?.show !== false) {
          this.dataToDisplay.push(e);
        }
      })
    }
    if (this.props.personaData.personaPhase !== 'post') {
      if (this.props.personaData.hasOwnProperty("no_data") && this.props.personaData.no_data === true) {
        return (
          <div className="card">
            <div className="header">
              <h2>
                {this.props.personaData.personaStatus ? "Metrics" : "Projected A/B Metrics"}  <span style={{ fontSize: "10px" }} className="badge-info">Based on Industry Avg.</span>
                {/* <span className="float-right">
                  <span style={{ fontSize: "10px" }}> Data From your </span>
                  <img style={{ width: "auto", height: "18px" }} src={GoogleAnalytics} />
                </span> */}
              </h2>
            </div>
            <div className="body pt-0 pb-0">

              <div className="row">

                <div className="col-lg-6 col-md-6">

                  <div className="shadowBoxWithNoMargin">
                    <h6 className="mt-1">Typical Results</h6>
                    <ul className="list-unstyled basic-list listWithIcon ">
                      <li key={"metrics_cr_lift"} className="d-flex flex-wrap align-items-center pb-2">
                        <div className="feeds-left" style={{ border: `1px solid #eee` }} >
                          <i className="fa fa-line-chart"></i>
                        </div>
                        <div className="feeds-body ml-2">
                          <h6 className="title mb-0">
                            {!this.props.personaData.personaMetricsResultLoading ? this.props.personaData.personaPotentialCRLift + "%" : 0 + "%"} Lift
                          </h6>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/*           <h6 className="m-b-15">
                            {!this.props.personaData.personaMetricsResultLoading && this.props.data.subHeading}
                          </h6>
                          <p>
                            {!this.props.personaData.personaMetricsResultLoading && this.props.data.description}
                          </p>
                */}

                <div className="col-lg-6 col-md-6">
                  {this.props.personaData.personaOverview.points && this.props.personaData.personaOverview.points.length !== 0 &&
                    <div className="shadowBoxWithNoMargin">
                      <h6 className="mt-1">Key Metric Gains</h6>
                      <ul className="list-unstyled basic-list listWithIcon">
                        {this.props.personaData.personaOverview.points.map((data, i) => {
                          return (
                            <li key={`persona_overview_card_${i}`} className="d-flex flex-wrap pb-0 pt-1">
                              <div className="feeds-left" style={{ width: "30px", textAlign: "center" }}>
                                <i className={data.icon}></i>
                              </div>
                              <div className="feeds-body">
                                <h6 style={{ fontSize: "14px" }} className="title">
                                  {data.data}
                                </h6>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  }
                </div>
              </div>
              <div className="row no_data_row mt-3">
                <div className="col-md-12 col-lg-12 no_data_avl_md12">
                  <h3 className="badge no_data_available">No Data Available</h3>
                  <table className="table table-striped noDataAvailable"><thead><tr><th>Metrics</th><th>Brandlock Script Off</th><th>Brandlock Script On</th><th>Gain</th></tr></thead><tbody>

                    <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr>

                    <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr><tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr></tbody></table>
                </div>
                {/*  <div className="no_data_row">
                    <h3 className="badge no_data_available">Enable To Start Tracking</h3>
                    <img src={no_data_available} width="auto" alt="Enable To Start Tracking" />
                  </div> */}
              </div>
              {/*             <ul className="listWithIconMetrics cardScrollBar m-r-5 clearfix" style={{ height: "250px" }}>
                <li key={"metrics_cr_lift"} className="d-flex flex-wrap align-items-center pb-2">
                  <div className="feeds-left" style={{ border: `1px solid #eee` }} >
                    <i className="fa fa-line-chart"></i>
                  </div>
                  <div className="feeds-body ml-2">
                    <h6 className="title mb-0">
                      +{!this.props.personaData.personaMetricsResultLoading ? this.props.personaData.personaPotentialCRLift : 0} CR Lift
                    </h6>
                  </div>
                </li>
              </ul> */}
            </div>
          </div>
        )
      } else {

        return (
          <div className="card">
            <div className="header">
              <h2>
                {this.props.personaData.personaStatus ? "Metrics" : "Projected A/B Metrics"} {/* <small>{!this.props.personaData.personaMetricsResultLoading && this.props.data.perText}</small> */}
                <span className="float-right">
                  <span style={{ fontSize: "10px" }}> Data From your </span>
                  {this.props.platform === "adobe" && (this.props.industryStd === null || !this.props.industryStd) ?
                    <img style={{ width: "auto", height: "30px" }} alt="source Adobe analytics" src={AdobeAnalytics} /> : <img style={{ width: "auto", height: "18px" }} alt="source google analytics" src={GoogleAnalytics} />}
                </span>
              </h2>
            </div>
            <div className="body pt-0 mt-2">
              {/*           <h6 className="m-b-15">
                            {!this.props.personaData.personaMetricsResultLoading && this.props.data.subHeading}
                          </h6>
                          <p>
                            {!this.props.personaData.personaMetricsResultLoading && this.props.data.description}
                          </p>
                */}
              {this.props.personaData && this.dataToDisplay?.length > 0 && !this.props.personaData.personaMetricsResultLoading && this.props.data.length > 0 ?
                <><ul className="listWithIconMetrics cardScrollBar m-r-5 clearfix" style={{ height: "auto" }}>
                  {/* <li key={"metrics_cr_lift"} className="d-flex flex-wrap align-items-center pb-2">
                    <div className="feeds-left" style={{ border: `1px solid #eee` }} >
                      <i className="fa fa-line-chart"></i>
                    </div>
                    <div className="feeds-body ml-2">
                      <h6 className="title mb-0">
                        {!this.props.personaData.personaMetricsResultLoading ? this.props.personaData.personaPotentialCRLift + "%" : 0 + "%"} CR Lift
                      </h6>
                    </div>
                  </li> */}
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Metrics</th>
                        <th>Brandlock Script Off</th>
                        <th>Brandlock Script On</th>
                        <th>Gain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.data.map((data, i) => {
                        if (parseFloat(data.gain) > 0 && parseFloat(data.brandlock_on) > 0 && data.show !== false) {
                          return (<tr key={`persona_metrics_card_${i}`}>
                            <td>{data.metricName}</td>
                            <td>{!isNaN(parseFloat(data.brandlock_off)) ? ((data.unit === "%" || data.unit === "") ? `${data.brandlock_off}${data.unit}` : convertNumbertoCurrencyFormat(data.brandlock_off, this.props.currency, 2, 2)) : (data.unit === "%" || data.unit === "") ? `0.00${data.unit}` : `${data.unit}0.00`}</td>
                            <td>{!isNaN(parseFloat(data.brandlock_on)) ? ((data.unit === "%" || data.unit === "") ? `${data.brandlock_on}${data.unit}` : convertNumbertoCurrencyFormat(data.brandlock_on, this.props.currency, 2, 2)) : (data.unit === "%" || data.unit === "") ? `0.00${data.unit}` : `${data.unit}0.00`}</td>
                            <td>{(data.metricName === 'Affiliate Savings') ? convertNumbertoCurrencyFormat(data.gain, this.props.currency, 0, 0) : `${parseFloat(data.gain).toFixed(2)}%`}</td>
                          </tr>)
                        }
                      })}
                      {/* <div className="m-t-15 badge badge-info"> No Data Available</div> */}
                    </tbody>
                  </table>
                </ul>
                  {!this.props.personaData.personaStatus ? <span className="greyMessage metricsMessage">*After persona is activated data will be from your analytics platform. Pre-activation lift data based on industry standards</span> : ""}
                </>
                :
                <div className="row no_data_row mt-3">
                  <div className="col-md-12 col-lg-12 no_data_avl_md12">
                    <h3 className="badge no_data_available">No Data Available</h3>
                    <table className="table table-striped noDataAvailable"><thead><tr><th>Metrics</th><th>Brandlock Script Off</th><th>Brandlock Script On</th><th>Gain</th></tr></thead><tbody>

                      <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr>

                      <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr><tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr></tbody></table>
                  </div>
                  {/*  <div className="no_data_row">
              <h3 className="badge no_data_available">Enable To Start Tracking</h3>
              <img src={no_data_available} width="auto" alt="Enable To Start Tracking" />
            </div> */}
                </div>
              }
            </div>
          </div>
        );
      }
    } else {
      if (this.props.personaData.hasOwnProperty("no_data") && this.props.personaData.no_data === true && this.props.personaData.personaPhase !== 'post') {
        return (
          <div className="card">
            <div className="header">
              <h2>
                {this.props.personaData.personaStatus ? "Metrics" : "Projected A/B Metrics"}  <span style={{ fontSize: "10px" }} className="badge-info">Based on Industry Avg.</span>
                {/* <span className="float-right">
                  <span style={{ fontSize: "10px" }}> Data From your </span>
                  <img style={{ width: "auto", height: "18px" }} src={GoogleAnalytics} />
                </span> */}
              </h2>
            </div>
            <div className="body pt-0 pb-0">

              <div className="row">

                <div className="col-lg-6 col-md-6">

                  <div className="shadowBoxWithNoMargin">
                    <h6 className="mt-1">Typical Results</h6>
                    <ul className="list-unstyled basic-list listWithIcon ">
                      <li key={"metrics_cr_lift"} className="d-flex flex-wrap align-items-center pb-2">
                        <div className="feeds-left" style={{ border: `1px solid #eee` }} >
                          <i className="fa fa-line-chart"></i>
                        </div>
                        <div className="feeds-body ml-2">
                          <h6 className="title mb-0">
                            {!this.props.personaData.personaMetricsResultLoading ? this.props.personaData.personaPotentialCRLift + "%" : 0 + "%"} Lift
                          </h6>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/*           <h6 className="m-b-15">
                            {!this.props.personaData.personaMetricsResultLoading && this.props.data.subHeading}
                          </h6>
                          <p>
                            {!this.props.personaData.personaMetricsResultLoading && this.props.data.description}
                          </p>
                */}

                <div className="col-lg-6 col-md-6">
                  {this.props.personaData.personaOverview.points && this.props.personaData.personaOverview.points.length !== 0 &&
                    <div className="shadowBoxWithNoMargin">
                      <h6 className="mt-1">Key Metric Gains</h6>
                      <ul className="list-unstyled basic-list listWithIcon">
                        {this.props.personaData.personaOverview.points.map((data, i) => {
                          return (
                            <li key={`persona_overview_card_${i}`} className="d-flex flex-wrap pb-0 pt-1">
                              <div className="feeds-left" style={{ width: "30px", textAlign: "center" }}>
                                <i className={data.icon}></i>
                              </div>
                              <div className="feeds-body">
                                <h6 style={{ fontSize: "14px" }} className="title">
                                  {data.data}
                                </h6>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  }
                </div>
              </div>
              <div className="row no_data_row mt-3">
                <div className="col-md-12 col-lg-12 no_data_avl_md12">
                  <h3 className="badge no_data_available">No Data Available</h3>
                  <table className="table table-striped noDataAvailable"><thead><tr><th>Metrics</th><th>Brandlock Script Off</th><th>Brandlock Script On</th><th>Gain</th></tr></thead><tbody>

                    <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr>

                    <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr><tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr></tbody></table>
                </div>
                {/*  <div className="no_data_row">
                    <h3 className="badge no_data_available">Enable To Start Tracking</h3>
                    <img src={no_data_available} width="auto" alt="Enable To Start Tracking" />
                  </div> */}
              </div>
              {/*             <ul className="listWithIconMetrics cardScrollBar m-r-5 clearfix" style={{ height: "250px" }}>
                <li key={"metrics_cr_lift"} className="d-flex flex-wrap align-items-center pb-2">
                  <div className="feeds-left" style={{ border: `1px solid #eee` }} >
                    <i className="fa fa-line-chart"></i>
                  </div>
                  <div className="feeds-body ml-2">
                    <h6 className="title mb-0">
                      +{!this.props.personaData.personaMetricsResultLoading ? this.props.personaData.personaPotentialCRLift : 0} CR Lift
                    </h6>
                  </div>
                </li>
              </ul> */}
            </div>
          </div>
        )
      } else {
        return (
          <div className="card">
            <div className="header">
              <h2>
                {this.props.personaData.personaStatus ? "Metrics" : "Projected A/B Metrics"} {/* <small>{!this.props.personaData.personaMetricsResultLoading && this.props.data.perText}</small> */}
                <span className="float-right">
                  <span style={{ fontSize: "10px" }}> Data From your </span>
                  {this.props.platform === "adobe" && (this.props.industryStd === null || !this.props.industryStd) ?
                    <img style={{ width: "auto", height: "30px" }} alt="source Adobe analytics" src={AdobeAnalytics} /> : <img style={{ width: "auto", height: "18px" }} alt="source google analytics" src={GoogleAnalytics} />}
                </span>
              </h2>
            </div>
            <div className="body pt-0 mt-2">
              {/*           <h6 className="m-b-15">
                            {!this.props.personaData.personaMetricsResultLoading && this.props.data.subHeading}
                          </h6>
                          <p>
                            {!this.props.personaData.personaMetricsResultLoading && this.props.data.description}
                          </p>
                */}
              {
                this.props.personaData && !this.props.personaData.personaMetricsResultLoading && this.props.data.length > 0 ?
                  <ul className="listWithIconMetrics cardScrollBar m-r-5 clearfix" style={{ height: "auto" }}>
                    {/* <li key={"metrics_cr_lift"} className="d-flex flex-wrap align-items-center pb-2">
                    <div className="feeds-left" style={{ border: `1px solid #eee` }} >
                      <i className="fa fa-line-chart"></i>
                    </div>
                    <div className="feeds-body ml-2">
                      <h6 className="title mb-0">
                        {!this.props.personaData.personaMetricsResultLoading ? this.props.personaData.personaPotentialCRLift + "%" : 0 + "%"} CR Lift
                      </h6>
                    </div>
                  </li> */}
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Metrics</th>
                          <th>Brandlock Script Off</th>
                          <th>Brandlock Script On</th>
                          <th>Gain</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.data.map((data, i) => {
                          if (parseFloat(data.gain) > 0 && parseFloat(data.brandlock_on) > 0 && data.show !== false) {
                            return (<tr key={`persona_metrics_card_${i}`}>
                              <td>{data.metricName}</td>
                              <td>{!isNaN(parseFloat(data.brandlock_off)) ? ((data.unit === "%" || data.unit === "") ? `${data.brandlock_off}${data.unit}` : convertNumbertoCurrencyFormat(data.brandlock_off, this.props.currency, 2, 2)) : (data.unit === "%" || data.unit === "") ? `0.00${data.unit}` : `${data.unit}0.00`}</td>
                              <td>{!isNaN(parseFloat(data.brandlock_on)) ? ((data.unit === "%" || data.unit === "") ? `${data.brandlock_on}${data.unit}` : convertNumbertoCurrencyFormat(data.brandlock_on, this.props.currency, 2, 2)) : (data.unit === "%" || data.unit === "") ? `0.00${data.unit}` : `${data.unit}0.00`}</td>
                              <td>{(data.metricName === 'Affiliate Savings') ? convertNumbertoCurrencyFormat(data.gain, this.props.currency, 0, 0) : `${parseFloat(data.gain).toFixed(2)}%`}</td>
                            </tr>)
                          }
                        })}
                        {/* <div className="m-t-15 badge badge-info"> No Data Available</div> */}
                      </tbody>
                    </table>
                  </ul>
                  :
                  <div className="row no_data_row mt-3">
                    <div className="col-md-12 col-lg-12 no_data_avl_md12">
                      <h3 className="badge no_data_available">No Data Available</h3>
                      <table className="table table-striped noDataAvailable"><thead><tr><th>Metrics</th><th>Brandlock Script Off</th><th>Brandlock Script On</th><th>Gain</th></tr></thead><tbody>

                        <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr>

                        <tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr><tr><td>No Data Available</td><td>---</td><td>---</td><td>---</td></tr></tbody></table>
                    </div>
                    {/*  <div className="no_data_row">
              <h3 className="badge no_data_available">Enable To Start Tracking</h3>
              <img src={no_data_available} width="auto" alt="Enable To Start Tracking" />
            </div> */}
                  </div>
              }
            </div>
          </div>
        );
      }
    }

  }
}

const mapStateToProps = ({
  websiteRecordReducer
}) => ({
  shopperRecord: websiteRecordReducer.shopperRecord
});

export default connect(mapStateToProps, {
  websiteRecordAction
})(PersonaMetricsCard);
