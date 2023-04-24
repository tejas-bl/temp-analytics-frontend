import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updatePromoBoxData } from "../../../api/Engage/PromoBox";

class EditPromoBoxModalCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personaData: {},
            pdIsLoading: true,
            promoCodeData: {},
            promoCodeDataIsLoading: true,
        }

        this.createDynamicOptions = this.createDynamicOptions.bind(this);
    }

    createDynamicOptions(loading, data) {
        const options = [];
        if (!loading) {
            for (let [key, value] of Object.entries(data)) {
                if (value.code) {
                    options.push(
                        <option key={key} value={value.id}>
                            {value.code}
                        </option>
                    );
                } else {
                    options.push(
                        <option key={key} value={value.id}>
                            {value.name}
                        </option>
                    );
                }
            }
        }
        return options;
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.personaData !== prevProps.personaData) {
            this.setState({
                pdIsLoading: false,
                personaData: this.props.personaData
            })
        }
        if (this.props.promoCodeData !== prevProps.promoCodeData) {
            this.setState({
                promoCodeDataIsLoading: false,
                promoCodeData: this.props.promoCodeData
            })
        }
    }


    render() {
        const { title, onClose, size, show } = this.props;
        const { pdIsLoading, promoCodeDataIsLoading, personaData, promoCodeData } = this.state;

        const personaIdOptions = this.createDynamicOptions(pdIsLoading, personaData);
        const promoCodeIdOptions = this.createDynamicOptions(promoCodeDataIsLoading, promoCodeData);

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
                                        initialValues={{
                                            id: this.props.data.id,
                                            site_id: this.props.data.site_id,
                                            persona_id: this.props.data.persona_id,
                                            heading: this.props.data.heading,
                                            sub_heading: this.props.data.sub_heading,
                                            footer: this.props.data.footer,
                                            status: this.props.data.status,
                                            message: this.props.data.message,
                                            promo_code: this.props.data.promo_code,
                                            platform: this.props.data.platform,
                                            is_active: this.props.data.is_active,
                                            remarks: this.props.data.remarks
                                        }}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            await updatePromoBoxData(values);
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
                                                        <label htmlFor="persona_id">Persona Id</label>
                                                        <Field
                                                            className="form-control"
                                                            as="select"
                                                            name="persona_id"
                                                        >
                                                            {personaIdOptions}
                                                        </Field>
                                                        <ErrorMessage
                                                            component="div"
                                                            name="persona_id"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="heading">Heading</label>
                                                        <Field
                                                            type="text"
                                                            name="heading"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.heading && errors.heading ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="heading"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="sub_heading">Sub Heading</label>
                                                        <Field
                                                            type="text"
                                                            name="sub_heading"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.sub_heading && errors.sub_heading ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="sub_heading"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="promo_code">Promo Code</label>

                                                        <Field
                                                            className="form-control"
                                                            as="select"
                                                            name="promo_code"
                                                        >
                                                            {promoCodeIdOptions}
                                                        </Field>
                                                        <ErrorMessage
                                                            component="div"
                                                            name="promo_code"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>

                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="footer">footer</label>
                                                        <Field
                                                            type="text"
                                                            name="footer"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.footer && errors.footer ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="footer"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="status">Status</label>
                                                        <Field
                                                            type="text"
                                                            name="status"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.status && errors.status ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="status"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="message">Message</label>
                                                        <Field
                                                            type="text"
                                                            name="message"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.message && errors.message ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="message"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
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
                                                        <label htmlFor="is_active">Is Active</label>
                                                        <label>
                                                            <Field type="checkbox" name="is_active" />
                                                            {/* {`${values.toggle}`} */}
                                                        </label>
                                                        {/* <Field
                                                            type="text"
                                                            name="is_active"
                                                            placeholder="Enter Heading"
                                                            className={`form-control ${touched.is_active && errors.is_active ? "is-invalid" : ""
                                                                }`}
                                                        /> */}
                                                        <ErrorMessage
                                                            component="div"
                                                            name="is_active"
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


export default EditPromoBoxModalCard;

