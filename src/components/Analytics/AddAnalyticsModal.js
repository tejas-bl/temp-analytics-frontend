import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction } from '../../actions';
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-dropdown-select";
import { getCurrentUser } from "../../helper/Utils";
import { createAnalytics } from "../../api/Dashboard/OldDB";
import { Modal } from "react-bootstrap";

class AddAnalyticsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formField: {
                site_id: this.props.sessionClient.web_id,
                profile_id: "",
                internal_web_property_id: "",
                platform: "",
                event_category: "",
                event_action: "",
                metrics: "",
                persona_id: "",
                event_label: "",
                persona_group: "",
                product: "",
                segments: "",
                account_credentials_file: "",
                account_secret_file: "",
                ga_web_id: "",
            }
        }
    }

    async onAddAnalytics(data) {
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${currentUser.refresh_token}`,
            }
        }
        const createdUser = await createAnalytics(data, headerConfig);
        if (createdUser && createdUser.hasOwnProperty('data') && createdUser.data.statuscode === 200) {
            this.props.onClose(true);
        } else {
            this.props.onClose(false);
        }
    }

    render() {
        const { onClose, size, show } = this.props;
        return (
            <Modal size={size} show={show} onHide={onClose} className="adduserModal">
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="mian-content">
                            <div className="card col-lg-12 col-md-12">
                                <div className="body">
                                    <div className="body" id="addAnalyticsBody">
                                        <Formik
                                            validate={(values) => {
                                                let errors = {};
                                                if (!values.profile_id) {
                                                    errors.profile_id = 'Required';
                                                }
                                                if (!values.internal_web_property_id) {
                                                    errors.internal_web_property_id = 'Required';
                                                }
                                                if (!values.metrics) {
                                                    errors.metrics = 'Required';
                                                }
                                                if (!values.account_credentials_file) {
                                                    errors.account_credentials_file = 'Required';
                                                }
                                                if (!values.account_secret_file) {
                                                    errors.account_secret_file = 'Required';
                                                }
                                                return errors;
                                            }}
                                            initialValues={this.state.formField}
                                            onSubmit={async (values, { setSubmitting }) => {
                                                const data = {
                                                    "site_id": this.props.sessionClient.web_id,
                                                    "updated_at": new Date(),
                                                    "created_at": new Date(),
                                                    "profile_id": values.profile_id ? values.profile_id.trim() : null,
                                                    "internal_web_property_id": values.internal_web_property_id ? values.internal_web_property_id.trim() : null,
                                                    "platform": values.platform ? values.platform.trim() : null,
                                                    "event_category": values.event_category ? values.event_category.trim() : null,
                                                    "event_action": values.event_action ? values.event_action.trim() : null,
                                                    "metrics": values.metrics ? values.metrics.trim() : null,
                                                    "persona_id": values.persona_id ? values.persona_id : null,
                                                    "event_label": values.event_label ? values.event_label.trim() : null,
                                                    "persona_group": values.persona_group ? values.persona_group.trim() : null,
                                                    "product": values.product ? values.product.trim() : null,
                                                    "segments": values.segments ? values.segments.trim() : null,
                                                    "account_credentials_file": values.account_credentials_file ? values.account_credentials_file.trim() : null,
                                                    "account_secret_file": values.account_secret_file ? values.account_secret_file.trim() : null,
                                                    "ga_web_id": values.ga_web_id ? values.ga_web_id.trim() : null,
                                                }
                                                await this.onAddAnalytics(data);
                                            }}
                                        >
                                            {({ touched, errors, isSubmitting, setFieldValue }) => (
                                                <Form>
                                                    <div className="row">

                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="profile_id">Profile Id</label>
                                                            <Select
                                                                placeholder="Select Profile Id"
                                                                name="profile_id"
                                                                className={`col-md-12 form-control ${touched.profile_id && errors.profile_id ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.profile_id}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('profile_id', e[0].value);
                                                                    } else {
                                                                        setFieldValue('profile_id', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="profile_id"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="internal_web_property_id">Internal Web Property Id</label>
                                                            <Select
                                                                placeholder="Select Internal Web Property Id"
                                                                name="internal_web_property_id"
                                                                className={`col-md-12 form-control ${touched.internal_web_property_id && errors.internal_web_property_id ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.internal_web_property_id}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('internal_web_property_id', e[0].value);
                                                                    } else {
                                                                        setFieldValue('internal_web_property_id', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="internal_web_property_id"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                    </div>






                                                    <div className="row">

                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="platform">platform</label>
                                                            <Select
                                                                placeholder="Select Event Action"
                                                                name="platform"
                                                                className={`col-md-12 form-control ${touched.platform && errors.platform ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.platform}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('platform', e[0].value);
                                                                    } else {
                                                                        setFieldValue('platform', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="platform"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="event_category">Event Category</label>
                                                            <Select
                                                                placeholder="Select Event Category"
                                                                name="event_category"
                                                                className={`col-md-12 form-control ${touched.event_category && errors.event_category ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.event_category}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('event_category', e[0].value);
                                                                    } else {
                                                                        setFieldValue('event_category', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="event_category"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                    </div>






                                                    <div className="row">

                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="event_action">Event Action</label>
                                                            <Select
                                                                placeholder="Select Event Action"
                                                                name="event_action"
                                                                className={`col-md-12 form-control ${touched.event_action && errors.event_action ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.event_action}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('event_action', e[0].value);
                                                                    } else {
                                                                        setFieldValue('event_action', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="event_action"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="metrics">Metrics</label>
                                                            <Select
                                                                placeholder="Select Metrics"
                                                                name="metrics"
                                                                className={`col-md-12 form-control ${touched.metrics && errors.metrics ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.metrics}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('metrics', e[0].value);
                                                                    } else {
                                                                        setFieldValue('metrics', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="metrics"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                    </div>








                                                    <div className="row">

                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="persona_id">Shopper Id</label>
                                                            <Select
                                                                placeholder="Select Shopper Id"
                                                                name="persona_id"
                                                                className={`col-md-12 form-control ${touched.persona_id && errors.persona_id ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.persona_id}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('persona_id', e[0].value);
                                                                    } else {
                                                                        setFieldValue('persona_id', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="persona_id"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="event_label">Event Label</label>
                                                            <Select
                                                                placeholder="Select Event Label"
                                                                name="event_label"
                                                                className={`col-md-12 form-control ${touched.event_label && errors.event_label ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.event_label}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('event_label', e[0].value);
                                                                    } else {
                                                                        setFieldValue('event_label', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="event_label"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                    </div>







                                                    <div className="row">

                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="persona_group">Persona Group</label>
                                                            <Select
                                                                placeholder="Select Persona Group"
                                                                name="persona_group"
                                                                className={`col-md-12 form-control ${touched.persona_group && errors.persona_group ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.persona_group}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('persona_group', e[0].value);
                                                                    } else {
                                                                        setFieldValue('persona_group', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="persona_group"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="segments">Segments</label>
                                                            <Select
                                                                placeholder="Select Segment"
                                                                name="segments"
                                                                className={`col-md-12 form-control ${touched.segments && errors.segments ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.segments}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('segments', e[0].value);
                                                                    } else {
                                                                        setFieldValue('segments', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="segments"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                    </div>









                                                    <div className="row">

                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="account_credentials_file">Account Credential</label>
                                                            <Select
                                                                placeholder="Select Account Credential"
                                                                name="account_credentials_file"
                                                                className={`col-md-12 form-control ${touched.account_credentials_file && errors.account_credentials_file ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.account_credentials_file}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('account_credentials_file', e[0].value);
                                                                    } else {
                                                                        setFieldValue('account_credentials_file', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="account_credentials_file"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="account_secret_file">Account Secret</label>
                                                            <Select
                                                                placeholder="Select Account Secret"
                                                                name="account_secret_file"
                                                                className={`col-md-12 form-control ${touched.account_secret_file && errors.account_secret_file ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.account_secret_file}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('account_secret_file', e[0].value);
                                                                    } else {
                                                                        setFieldValue('account_secret_file', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="account_secret_file"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                    </div>



                                                    <div className="row">

                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="product">Product</label>
                                                            <Select
                                                                placeholder="Select Product"
                                                                name="product"
                                                                className={`col-md-12 form-control ${touched.product && errors.product ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.product}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('product', e[0].value);
                                                                    } else {
                                                                        setFieldValue('product', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="product"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>

                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="ga_web_id">GA Web Id</label>
                                                            <Select
                                                                placeholder="Select GA Web Id"
                                                                name="ga_web_id"
                                                                className={`col-md-12 form-control ${touched.ga_web_id && errors.ga_web_id ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                create={true}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.props.existingAnalyticsClientDetails.ga_web_id}
                                                                onChange={(e) => {
                                                                    if (e && e.length && e[0].hasOwnProperty('label')) {
                                                                        setFieldValue('ga_web_id', e[0].value);
                                                                    } else {
                                                                        setFieldValue('ga_web_id', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="ga_web_id"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="row justify-content-center">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary btn-block w-25"
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? "Please wait..." : "Submit"}
                                                        </button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal >
        )
    }
}

const mapStateToProps = ({
    websiteRecordReducer
}) => ({
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord
});

export default connect(mapStateToProps, {
    websiteRecordAction
})(AddAnalyticsModal);