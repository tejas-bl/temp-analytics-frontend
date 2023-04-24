import React from "react";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import Select from "react-dropdown-select";
import CouponPersonaSwitchBoard from "./CouponManagement/CouponPersonaSwitchBoard";
import {
    onPressSecuritySystem,
    onPressMainGate,
    onPressSwitchBordButton,
    onPressOutSwitchBordButton,
    onPressAppliencesSwitchBordButton,
    onPressSwitchBordDropDown,
    onPressOutdoorDropDown,
    onPressSwithOnAllOut,
    onPressAllOffLightOut,
    onPressSwithOnAllIn,
    onPressAllOffLightIn
  } from "../../actions";

import { personaCouponTableData } from "../../Data/EngageCouponData";
class AddCouponModalCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            headingInput: "",
            subHeadingInput: "",
            codeInput: "",
            siteIdInput: "",
            ValidFromInput: "",
            validToInput: "",
            statusInput: "",
            isActiveInput: "",
            remarksInput: "",
            submeet: false,
        }
    }
  render() {
    const { title, onClose, size, show, switchOutBoardSwitch, isOutdoorDropdown } = this.props;
    const { headingInput, subHeadingInput, codeInput, siteIdInput, ValidFromInput, validToInput, statusInput, isActiveInput, remarksInput, submeet } = this.state;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return (
      <Modal size={size} show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
      
        <div className="d-flex flex-row justify-content-between flex-wrap">

            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="">
                <div className="body">
                    <form className="ng-untouched ng-dirty ng-invalid d-flex flex-row justify-content-between flex-wrap">
                      
                      
                        <div className="form-group col-md-6 col-lg-6">
                            <label>Heading</label>
                            <input
                            className={`form-control ${
                                headingInput === "" && submeet && "parsley-error"
                            }`}
                            value={headingInput}
                            name="text"
                            required=""
                            onChange={(e) => {
                                this.setState({
                                headingInput: e.target.value,
                                submeet: false,
                                });
                            }}
                            />
                            {headingInput === "" && submeet ? (
                            <ul className="parsley-errors-list filled" id="parsley-id-1">
                                <li className="parsley-required">
                                This value is required.
                                </li>
                            </ul>
                            ) : null}
                        </div>


                        <div className="form-group col-md-6 col-lg-6">
                            <label>SubHeading</label>
                            <input
                            className={`form-control ${
                                subHeadingInput === "" && submeet && "parsley-error"
                            }`}
                            value={subHeadingInput}
                            name="text"
                            required=""
                            onChange={(e) => {
                                this.setState({
                                subHeadingInput: e.target.value,
                                submeet: false,
                                });
                            }}
                            />
                            {subHeadingInput === "" && submeet ? (
                            <ul className="parsley-errors-list filled" id="parsley-id-2">
                                <li className="parsley-required">
                                This value is required.
                                </li>
                            </ul>
                            ) : null}
                        </div>



                        <div className="form-group col-md-6 col-lg-6">
                            <label>SubHeading</label>
                            <input
                            className={`form-control ${
                                codeInput === "" && submeet && "parsley-error"
                            }`}
                            value={codeInput}
                            name="text"
                            required=""
                            onChange={(e) => {
                                this.setState({
                                    codeInput: e.target.value,
                                submeet: false,
                                });
                            }}
                            />
                            {codeInput === "" && submeet ? (
                            <ul className="parsley-errors-list filled" id="parsley-id-2">
                                <li className="parsley-required">
                                This value is required.
                                </li>
                            </ul>
                            ) : null}
                        </div>



                        <div className="form-group col-md-6 col-lg-6">
                            <label>SubHeading</label>
                            <input
                            className={`form-control ${
                                subHeadingInput === "" && submeet && "parsley-error"
                            }`}
                            value={subHeadingInput}
                            name="text"
                            required=""
                            onChange={(e) => {
                                this.setState({
                                subHeadingInput: e.target.value,
                                submeet: false,
                                });
                            }}
                            />
                            {subHeadingInput === "" && submeet ? (
                            <ul className="parsley-errors-list filled" id="parsley-id-2">
                                <li className="parsley-required">
                                This value is required.
                                </li>
                            </ul>
                            ) : null}
                        </div>



                        <div className="form-group col-md-6 col-lg-6">
                            <label>SubHeading</label>
                            <input
                            className={`form-control ${
                                subHeadingInput === "" && submeet && "parsley-error"
                            }`}
                            value={subHeadingInput}
                            name="text"
                            required=""
                            onChange={(e) => {
                                this.setState({
                                subHeadingInput: e.target.value,
                                submeet: false,
                                });
                            }}
                            />
                            {subHeadingInput === "" && submeet ? (
                            <ul className="parsley-errors-list filled" id="parsley-id-2">
                                <li className="parsley-required">
                                This value is required.
                                </li>
                            </ul>
                            ) : null}
                        </div>



                        <div className="form-group col-md-6 col-lg-6">
                            <label>SubHeading</label>
                            <input
                            className={`form-control ${
                                subHeadingInput === "" && submeet && "parsley-error"
                            }`}
                            value={subHeadingInput}
                            name="text"
                            required=""
                            onChange={(e) => {
                                this.setState({
                                subHeadingInput: e.target.value,
                                submeet: false,
                                });
                            }}
                            />
                            {subHeadingInput === "" && submeet ? (
                            <ul className="parsley-errors-list filled" id="parsley-id-2">
                                <li className="parsley-required">
                                This value is required.
                                </li>
                            </ul>
                            ) : null}
                        </div>



                        <div className="form-group col-md-6 col-lg-6">
                            <label>SubHeading</label>
                            <input
                            className={`form-control ${
                                subHeadingInput === "" && submeet && "parsley-error"
                            }`}
                            value={subHeadingInput}
                            name="text"
                            required=""
                            onChange={(e) => {
                                this.setState({
                                subHeadingInput: e.target.value,
                                submeet: false,
                                });
                            }}
                            />
                            {subHeadingInput === "" && submeet ? (
                            <ul className="parsley-errors-list filled" id="parsley-id-2">
                                <li className="parsley-required">
                                This value is required.
                                </li>
                            </ul>
                            ) : null}
                        </div>



                    <div className="form-group col-md-6 col-lg-6">
                        <label>Order Value</label>
                        <input
                        className={`form-control ${
                            !reg.test(emailInput) && submeet && "parsley-error"
                        }`}
                        value={emailInput}
                        name="email"
                        pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                        required=""
                        type="email"
                        onChange={(e) => {
                            this.setState({ emailInput: e.target.value });
                        }}
                        />
                        {submeet && !reg.test(emailInput) ? (
                        <ul className="parsley-errors-list filled" id="parsley-id-3">
                            <li className="parsley-required">
                            This value is required.
                            </li>
                        </ul>
                        ) : null}
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label>Expiry Date</label>
                        <input
                        className={`form-control ${
                            !reg.test(emailInput) && submeet && "parsley-error"
                        }`}
                        value={emailInput}
                        name="email"
                        pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                        required=""
                        type="email"
                        onChange={(e) => {
                            this.setState({ emailInput: e.target.value });
                        }}
                        />
                        {submeet && !reg.test(emailInput) ? (
                        <ul className="parsley-errors-list filled" id="parsley-id-4">
                            <li className="parsley-required">
                            This value is required.
                            </li>
                        </ul>
                        ) : null}
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label>Coupon Type</label>
                        <br />
                        <Select
                        className="js-states"
                        placeholder=""
                        options={[
                            { label: "1", value: "1" },
                            { label: "2", value: "2" },
                            { label: "3", value: "3" },
                            { label: "4", value: "4" },
                        ]}
                        disabled={false}
                        onChange={(values) => {}}
                        />
                    </div>
                    <div className="form-group col-md-12 col-lg-12">
                        <label>Description</label>
                        <textarea
                        className={`form-control ${
                            remarksInput === "" && submeet && "parsley-error"
                        }`}
                        value={remarksInput}
                        cols="30"
                        name="textarea"
                        required=""
                        rows="5"
                        onChange={(e) => {
                            this.setState({ remarksInput: e.target.value });
                        }}
                        ></textarea>
                        {remarksInput === "" && submeet ? (
                        <ul className="parsley-errors-list filled" id="parsley-id-5">
                            <li className="parsley-required">
                            This value is required.
                            </li>
                        </ul>
                        ) : null}
                    </div>
                    <br />
                    <div className="form-group col-md-12 col-lg-12 col-sm-12 d-flex flex-wrap flex-row pl-0 pr-0">
                        
                    <CouponPersonaSwitchBoard
                        onPressDropDown={() => { this.props.onPressOutdoorDropDown() }}
                        isDropdownShow={isOutdoorDropdown}
                        onPressAllOnLight={() => { this.props.onPressSwithOnAllOut() }}
                        onPressAllOffLight={() => { this.props.onPressAllOffLightOut() }}
                        Buttons={personaCouponTableData}
                        IsSwitch={switchOutBoardSwitch}
                        OnPressSwitch={index =>
                        this.props.onPressOutSwitchBordButton(index)
                        }
                    />
                    </div>
                </form>

                <div className="col-md-12 text-center">
                    <button
                        className="btn btn-info text-center"
                        onClick={() => {
                            this.setState({ submeet: true });
                        }}
                        >
                        Add
                    </button>
                </div>
            </div>
            </div>
        </div>


        
      </div>
        </Modal.Body>
      </Modal>
    );
  }
}


const mapStateToProps = ({ ioTReducer }) => ({
    isSecuritySystem: ioTReducer.isSecuritySystem,
    isMaingate: ioTReducer.isMaingate,
    switchBoardSwitch: ioTReducer.switchBoardSwitch,
    switchOutBoardSwitch: ioTReducer.switchOutBoardSwitch,
    switchAppliencesBoardSwitch: ioTReducer.switchAppliencesBoardSwitch,
    isIndoorDropdown: ioTReducer.isIndoorDropdown,
    isOutdoorDropdown: ioTReducer.isOutdoorDropdown
  });
  
  export default connect(mapStateToProps, {
    onPressSecuritySystem,
    onPressMainGate,
    onPressSwitchBordButton,
    onPressOutSwitchBordButton,
    onPressAppliencesSwitchBordButton,
    onPressSwitchBordDropDown,
    onPressOutdoorDropDown,
    onPressSwithOnAllOut,
    onPressAllOffLightOut,
    onPressSwithOnAllIn,
    onPressAllOffLightIn
  })(AddCouponModalCard);

