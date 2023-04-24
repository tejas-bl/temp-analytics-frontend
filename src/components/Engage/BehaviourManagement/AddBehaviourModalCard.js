import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { addBehaviourData } from "../../../api/Engage/Behaviour";

class AddBehaviourModalCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            behaviourDimensions: {},
            bdIsLoading: true,
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.behaviourDimensionData !== prevProps.behaviourDimensionData) {
            this.setState({
                bdIsLoading: false,
                behaviourDimensions: this.props.behaviourDimensionData
            })
        }
    }

    render() {
        const { title, onClose, size, show } = this.props;
        const { bdIsLoading } = this.state;

        const options = [];
        if (!bdIsLoading) {
            for (let [key, value] of Object.entries(this.state.behaviourDimensions)) {
                options.push(
                    <option key={key} value={value.id}>
                        {value.name}
                    </option>
                );
            }
        }
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
                                            return errors;
                                        }}
                                        initialValues={{ behaviour: "", definition: "", behaviourDimensions: "", operator: "", value: "", platform: "", remarks: "" }}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            await addBehaviourData(values);
                                            this.props.onClose(true);
                                            setSubmitting(false);
                                        }}
                                    >   
                                        {({ touched, errors, isSubmitting }) => (
                                            <Form>
                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="behaviour">Behaviour</label>
                                                        <Field
                                                            type="text"
                                                            name="behaviour"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.behaviour && errors.behaviour ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="behaviour"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="definition">Definition</label>
                                                        <Field
                                                            type="text"
                                                            name="definition"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.definition && errors.definition ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="definition"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="behaviourDimensions">Behaviour Dimension Id</label>
                                                        <Field
                                                            className="form-control"
                                                            as="select"
                                                            name="behaviourDimensions"
                                                        >
                                                            {options}
                                                        </Field>
                                                        <ErrorMessage
                                                            component="div"
                                                            name="behaviourDimensions"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="operator">Operator</label>
                                                        <Field
                                                            type="text"
                                                            name="operator"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.operator && errors.operator ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="operator"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-group col-md-4 col-lg-4">
                                                        <label htmlFor="platform">Platform</label>
                                                        <Field
                                                            type="text"
                                                            name="platform"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.platform && errors.platform ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="platform"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                     <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="value">Value</label>
                                                        <Field
                                                            type="text"
                                                            name="value"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.value && errors.value ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="value"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6 col-lg-6">
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

export default AddBehaviourModalCard;

