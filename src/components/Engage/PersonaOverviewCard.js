import React from "react";
import { connect } from "react-redux";

class PersonaOverviewCard extends React.Component {
  render() {
    return (
      <div className="card">
        <div className="header pb-0">
{/*           <h2 className="pb-1">
            {this.props.data.heading}
          </h2> */}
{/*           <p>
            {this.props.data.description}
          </p> */}
          {/*           <Dropdown drop="down" className="header-dropdown dropdown">
            <Dropdown.Toggle
              variant="success"
              as="li"
              id="dropdown-basic"
            ></Dropdown.Toggle>

            <Dropdown.Menu as="ul">
              <li>
                <a>Action</a>
              </li>
              <li>
                <a>Another action</a>
              </li>
              <li>
                <a>Something else</a>
              </li>
            </Dropdown.Menu>
          </Dropdown> */}
        </div>
        <div className="body pt-0">

          <h6 className="m-b-5">
            Problem:
          </h6>
          <p>
            {this.props.data.problem}
          </p>
          <h6 className="m-b-5">
            Brandlock Solution:
          </h6>
          <p>
            {this.props.data.solution}
          </p>
          {/*           {this.props.data.points && this.props.data.points.length !== 0 &&
            <>
              <h6 className="mt-4">Key Metric Gains</h6>
              <ul className="list-unstyled basic-list listWithIcon cardScrollBar m-r-5 mt-4 clearfix" style={{ height: "93px" }}>
                {this.props.data.points.map((data, i) => {
                  return (
                    <li key={`persona_overview_card_${i}`} className="d-flex flex-wrap pb-0">
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
            </>
          } */}
        </div>
      </div>
    );
  }
}

PersonaOverviewCard.propTypes = {};

const mapStateToProps = ({ analyticalReducer }) => ({});

export default connect(mapStateToProps, {})(PersonaOverviewCard);
