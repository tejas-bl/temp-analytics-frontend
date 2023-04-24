import React from "react";
import { connect } from "react-redux";

import { onPressSwitchBordButton } from "../../../actions";



import { Dropdown, Toast } from "react-bootstrap";

class CouponPersonaSwitchBoard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            couponActionMessage : "",
            showCouponMessage : false
        }
        this.onCouponPersonaCheck = this.onCouponPersonaCheck.bind(this)
    }

    onCouponPersonaCheck(index){

        if(this.props.IsSwitch[index]){
            this.setState({
                couponActionMessage : `${this.props.Buttons[index].persona} has been Deactivated`,
                showCouponMessage : true
            })
        }else{
            this.setState({
                couponActionMessage : `${this.props.Buttons[index].persona} has been Activated`,
                showCouponMessage : true
            })
        }

        this.props.OnPressSwitch(index)

    }

    render() {
    const {
      Buttons,
      IsSwitch,
      onPressAllOnLight,
      onPressAllOffLight,
    } = this.props;
    return (
      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="card">
        {this.state.showCouponMessage ? (
                <Toast
                    id="toast-container"
                    show={this.state.showCouponMessage}
                    onClose={() => {
                        this.setState({
                            showCouponMessage : false
                        })
                    }}
                    className="toast-primary toast-top-right"
                    autohide={true}
                    delay={5000}
                >
                    <Toast.Header className="toast-info mb-0">
                        {this.state.couponActionMessage}
                    </Toast.Header>
                </Toast>
                ) : null}
          <div className="header">
            <h2>Persona List</h2>
            <Dropdown as="ul" className="header-dropdown">
              <Dropdown.Toggle variant="success" as="li" id="dropdown-basic">
                <Dropdown.Menu
                  as="ul"
                  className="dropdown-menu dropdown-menu-right"
                >
                  <li>
                    <a href="javascript:vaoid(0);" onClick={onPressAllOnLight}>All On</a>
                  </li>
                  <li>
                    <a href="javascript:vaoid(0);" onClick={onPressAllOffLight}>All Off</a>
                  </li>
                </Dropdown.Menu>
              </Dropdown.Toggle>
            </Dropdown>
            <div className="body">
              <ul className="list-unstyled basic-list ng-star-inserted">
                {Buttons.map((Button, index) => {
                  return (
                    <li
                      key={index}
                      className="couponPersonaList d-flex"
                    >
                        <div><i className={`fa fa-circle mr-2 ${
                            IsSwitch[index] === true ? "text-success"
                            : "text-danger"}`}> </i>
                            {Button.persona}
                        </div>
                        <div className="m-checkbox m-checkbox--switch">
                            <input
                            type="checkbox"
                            className="m-checkbox__input m-checkbox--switch__input"
                            ref={el => (this.selector = el)}
                            onChange={() => this.onCouponPersonaCheck(index)}
                            checked = {IsSwitch[index] === true ? true : false }
                            id={`${Button.persona+index}`}
                            />
                        </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CouponPersonaSwitchBoard.propTypes = {};

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps, {
  onPressSwitchBordButton,
})(CouponPersonaSwitchBoard);
