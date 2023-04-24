import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updatePromoBoxConfigData } from "../../../api/Engage/PromoBoxConfig";
class EditPromoBoxConfigModalCard extends React.Component {
    render() {
        const { onClose, size, show } = this.props;
        return (
            <Modal size={size} show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.data.name}</Modal.Title>
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
                                        initialValues={{ id: this.props.data.id, site_id: this.props.data.site_id, logo: this.props.data.logo, remarks: this.props.data.remarks }}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            await updatePromoBoxConfigData(values);
                                            this.props.onClose(true);
                                            setSubmitting(false);
                                        }}
                                    >
                                        {({ touched, errors, isSubmitting }) => (
                                            <Form>
                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="site_id">Site Id</label>
                                                        <Field
                                                            type="text"
                                                            name="site_id"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.site_id && errors.site_id ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="site_id"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="logo">Short Code</label>
                                                        <Field
                                                            type="text"
                                                            name="logo"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.logo && errors.logo ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="logo"
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


export default EditPromoBoxConfigModalCard;
