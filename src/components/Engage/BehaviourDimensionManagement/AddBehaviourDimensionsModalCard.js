import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { addBehaviourDimensionsData } from "../../../api/Engage/BehaviourDimensions";

class AddBehaviourDimensionsModalCard extends React.Component {
    render() {
        const { title, onClose, size, show } = this.props;
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
                                        initialValues={{ name: "", code: "", remarks: "" }}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            await addBehaviourDimensionsData(values);
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
                                                        <label htmlFor="code">Code</label>
                                                        <Field
                                                            type="text"
                                                            name="code"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.code && errors.code ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="code"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
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


export default AddBehaviourDimensionsModalCard;

