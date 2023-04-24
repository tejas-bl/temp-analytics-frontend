import React from "react";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
} from "../../../actions";
import { addPersonaData } from "../../../api/Engage/Persona";

class AddPersonaModalCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { title, onClose, size, show, switchOutBoardSwitch, isOutdoorDropdown } = this.props;
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
                                    <Formik
                                        validate={(values) => {
                                            let errors = {};
                                            // if (values.name === "") {
                                            //     errors.name = "name is required";
                                            // }
                                            // if (values.short_code === "") {
                                            //     errors.short_code = "short_code is required";
                                            // }

                                            // if (values.code === "") {
                                            //     errors.code = "code is required";
                                            // }
                                            // if (values.site_id === "") {
                                            //     errors.site_id = "site_id is required";
                                            // }

                                            // if (values.valid_from === "") {
                                            //     errors.valid_from = "valid_from is required";
                                            // }

                                            // if (values.valid_to === "") {
                                            //     errors.valid_to = "valid_to is required";
                                            // }
                                            // if (values.status === "") {
                                            //     errors.status = "status is required";
                                            // }
                                            return errors;
                                        }}
                                        initialValues={{ name: "", short_code: "", remarks: ""}}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            await addPersonaData(values);
                                            this.props.onClose(true);
                                            setSubmitting(false);
                                        }}
                                    >
                                        {({ touched, errors, isSubmitting }) => (
                                            <Form>
                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="name">Name</label>
                                                        <Field
                                                            type="text"
                                                            name="name"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.name && errors.name ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="name"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="short_code">Short Code</label>
                                                        <Field
                                                            type="text"
                                                            name="short_code"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.short_code && errors.short_code ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="short_code"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="remarks">Remarks</label>
                                                    <Field
                                                        type="text"
                                                        name="remarks"
                                                        placeholder="Enter Heading"
                                                        className={`form-control ${touched.remarks && errors.remarks ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="remarks"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                           
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-block"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? "Please wait..." : "Submit"}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
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
})(AddPersonaModalCard);

