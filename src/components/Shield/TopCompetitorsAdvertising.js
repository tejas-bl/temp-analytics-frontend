import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { connect } from "react-redux";

import {
  websiteRecordAction
} from "../../actions";

class TopCompetitorsAdvertising extends React.Component {
  render() {
    const data = this.props.topCompetitorsAdvertising.data;
    return (
      <div className="card  col-lg-12 col-md-12 mb-3 pt-3">
        <h6 className="card-title mb-2">Top Competitors Advertising on Your Site</h6>
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
                      <td>{i}</td>
                      <td>{this.props.sessionClient.web_url === d.brand ? <> {d.brand}
                        <OverlayTrigger
                          trigger={["hover", "focus"]}
                          key="right"
                          placement="right"
                          overlay={
                            <Popover className="col-md-7 col-lg-7" style={{ width: "5300px" }} id={`popover-positioned-right`}>
                              {/* <Popover.Title as="h3">{`Q. How do you identify a winner of an A/B test when the sample sizes are Uneven?`}</Popover.Title>
                    */} <Popover.Content>
                                Your own affiliate link has been injected to your page!
                              </Popover.Content>
                            </Popover>
                          }
                        >
                          <Button className="infoIcon" variant="default">
                            <span className="info_icon"><i className="fa fa-info text-white"></i></span>
                          </Button>
                        </OverlayTrigger>
                      </> : d.brand}</td>
                    </tr>)
                })
                }
              </tbody>
            </table> :
            <div className="row no_data_row p-2">
              <div className="col-md-12 col-lg-12 no_data_avl_md12">
                <h3 className="badge no_data_available">No Data Available</h3>
                <table className="table table-striped noDataAvailable"><thead><tr><th>#</th><th>Competitor's Name</th></tr></thead><tbody><tr><td>1</td><td>No Data Available</td></tr>

                  <tr><td>2</td><td>No Data Available</td></tr>

                  <tr><td>3</td><td>No Data Available</td></tr>


                </tbody></table>
              </div>
            </div>
          }
          {/* <div className="row no_data_row">
            <h3 className="badge no_data_available">No Data Available</h3>
            <img src={no_data_available} width="auto" height="300px" alt="No data available" />
          </div>
*/}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  websiteRecordReducer
}) => ({
  sessionClient: websiteRecordReducer.sessionClient,
});

export default connect(mapStateToProps, {
  websiteRecordAction
})(TopCompetitorsAdvertising);