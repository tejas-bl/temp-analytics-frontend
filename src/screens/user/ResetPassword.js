import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction } from '../../actions';
import PageHeader from "../../components/PageHeader";
import { Formik, Form, Field, ErrorMessage } from "formik";

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.state = {
            formField: { email: "", currentPassword: "", newPassword: "", confirmNewPassword: ""},
        }
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps) {
    
    }

    onFieldChange(e) {
        this.setState({
            formField: { ...this.state.formField, [e.target.name]: e.target.value }
        })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-4">
                        <PageHeader
                            HeaderText="Reset Password"
                            Breadcrumb={[{ name: "Reset Password" }]}
                        />
                    </div>
                </div>
                <div className="mian-content">
                    <div className="card col-lg-12 col-md-12">
                        <div className="body">
                            <div className="body" id="addCouponBody">
                                <Formik
                                    validate={(values) => {
                                        let errors = {};
                                        return errors;
                                    }}
                                    initialValues={{ email: "", currentPassword: "", newPassword: "", confirmNewPassword: ""}}
                                    onSubmit={async (values, { setSubmitting }) => {
                                    }}
                                >
                                    {({ touched, errors, isSubmitting, setFieldValue }) => (
                                        <Form>
                                            <div className="row">
                                            <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="email">Email</label>
                                                    <Field
                                                        type="email"
                                                        name="email"
                                                        placeholder="Enter Email"
                                                        onChange={(e) => {
                                                            setFieldValue(e.target.name, e.target.value)
                                                            this.onFieldChange(e);
                                                        }}
                                                        className={`form-control ${touched.email && errors.email ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="email"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="currentPassword">Current Password</label>
                                                    <Field
                                                        type="text"
                                                        name="currentPassword"
                                                        placeholder="Enter current password"
                                                        onChange={(e) => {
                                                            setFieldValue(e.target.name, e.target.value)
                                                            this.onFieldChange(e);
                                                        }}
                                                        className={`form-control ${touched.currentPassword && errors.currentPassword ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="currentPassword"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                            <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="newPassword">New Password</label>
                                                    <Field
                                                        type="text"
                                                        name="newPassword"
                                                        placeholder="Enter new password"
                                                        onChange={(e) => {
                                                            setFieldValue(e.target.name, e.target.value)
                                                            this.onFieldChange(e);
                                                        }}
                                                        className={`form-control ${touched.newPassword && errors.newPassword ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="newPassword"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                                    <Field
                                                        type="confirmNewPassword"
                                                        name="confirmNewPassword"
                                                        placeholder="Confirm new password"
                                                        onChange={(e) => {
                                                            setFieldValue(e.target.name, e.target.value)
                                                            this.onFieldChange(e);
                                                        }}
                                                        className={`form-control ${touched.confirmNewPassword && errors.confirmNewPassword ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="confirmNewPassword"
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
})(ResetPassword);