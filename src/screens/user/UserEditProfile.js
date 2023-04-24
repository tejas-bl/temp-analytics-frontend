import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction } from '../../actions';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getCurrentUser, getWebsiteData, setCurrentUser } from "../../helper/Utils";
import { editUserProfile, updateUsers } from "../../api/Dashboard/OldDB";
import PageHeader from "../../components/PageHeader";
import { logoutUserAsync } from "../../api/authentication";
import { Toast } from "react-bootstrap";

class UserEditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.state = {
            user: {},
            formField: { firstName: "", lastName: "", email: "", currentPassword: "", newPassword: "", confirmNewPassword: "", resetPassword: false },
            websitesRecordLoading: true,
            websitesRecordOption: [],
            websitesRecord: [],
            isSubmittingData: false,
            isEdited: true,
            loadToaster: false,
            toasterMessage: null,
        }
    }

    async componentDidMount() {
        let localStorageWebsiteData = await getWebsiteData();
        localStorageWebsiteData.unshift({
            web_account_id: 0,
            web_url: "All Clients"
        });
        this.setState({
            websitesRecordLoading: false,
            websitesRecordOption: localStorageWebsiteData,
            websitesRecord: localStorageWebsiteData,
        })
    }

    async componentDidUpdate(prevProps) {
        if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
            this.setState({
                websitesRecordLoading: true
            })
            if (getWebsiteData() !== null && getWebsiteData().length > 0) {
                const localStorageWebsiteData = await getWebsiteData();
                this.setState({
                    websitesRecordLoading: false,
                    websitesRecordOption: localStorageWebsiteData,
                    websitesRecord: localStorageWebsiteData,
                });
            }
        }
    }

    async onUpdateUser(data) {
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${currentUser.refresh_token}`,
            }
        }
        const updatedUser = await editUserProfile(data, headerConfig);
        if (updatedUser.data.statuscode === 200) {
            if (data.resetPassword) {
                await this.logoutUser();
            } else {
                const userData = await getCurrentUser();
                userData.data.data.firstName = data.firstName;
                userData.data.data.lastName = data.lastName;
                await setCurrentUser(userData);
                this.setState({
                    loadToaster: true,
                    toasterMessage: "Profile Updated Successfully"
                });
            }
        } else {
            this.setState({
                loadToaster: true,
                toasterMessage: "Somethnig went wrong"
            });
        }
    }

    onFieldChange(e) {
        this.setState({
            formField: { ...this.state.formField, [e.target.name]: e.target.value }
        })
    }

    async logoutUser() {
        const logout = await logoutUserAsync();
        if (logout && (logout.data.statuscode === 200 || logout.data.statuscode === 400)) {
            this.props.history.push({ pathname:'/login'});
        }
    }

    render() {
        let user = getCurrentUser();
        return (
            <div className="container-fluid">
                <Toast
                    id="toast-container"
                    show={this.state.loadToaster}
                    onClose={() => {
                        this.setState({
                            toasterMessage: false
                        })
                    }}
                    className="toast-info toast-top-right"
                    autohide={true}
                    delay={3500}
                >
                    <Toast.Header className="toast-info mb-0">
                        {this.state.toasterMessage}
                    </Toast.Header>
                </Toast>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-4">
                        <PageHeader
                            HeaderText="Edit Profile"
                            Breadcrumb={[{ name: "Edit Profile" }]}
                        />
                    </div>
                </div>
                <div className="mian-content">
                    <div className="card col-lg-12 col-md-12">
                        <div className="body">
                            <div className="body" id="editCouponBody">
                                <Formik
                                    validate={(values) => {
                                        let errors = {};
                                        if (!values.firstName) {
                                            errors.firstName = 'Required';
                                        }
                                        if (!values.lastName) {
                                            errors.lastName = 'Required';
                                        }
                                        if (!values.currentPassword) {
                                            errors.currentPassword = 'Required';
                                        }
                                        if (!values.email) {
                                            errors.email = 'Required';
                                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(values.email)) {
                                            errors.email = 'Invalid email address';
                                        }

                                        if (values.resetPassword) {
                                            if (values.newPassword.length < 8) {
                                                errors.newPassword = 'password must be 8 characters long';
                                            }
                                            if (values.newPassword !== values.confirmNewPassword) {
                                                errors.confirmNewPassword = 'password not matched';
                                            }
                                        }
                                        return errors;
                                    }}
                                    initialValues={{ firstName: user.data.data.firstName, lastName: user.data.data.lastName, email: user.data.data.user_email, currentPassword: "", newPassword: "", confirmNewPassword: "", resetPassword: false }}
                                    onSubmit={async (values, { setSubmitting }) => {
                                        if (values.resetPassword) {
                                            if (values.firstName !== "" && values.lastName !== "" && values.email !== "" && values.currentPassword !== "" && values.newPassword !== "" && values.confirmNewPassword !== "" && values.newPassword === values.confirmNewPassword) {
                                                const data = {
                                                    "id": user.data.data.user_id,
                                                    "email": values.email,
                                                    "firstName": values.firstName,
                                                    "lastName": values.lastName,
                                                    "password": values.currentPassword,
                                                    "resetPassword": true,
                                                    "newPassword": values.newPassword,
                                                };
                                                await this.onUpdateUser(data);
                                                setSubmitting(false);
                                            } else {
                                                return;
                                            }
                                        } else {
                                            if (values.firstName !== "" && values.lastName !== "" && values.email !== "" && values.currentPassword !== "") {
                                                const data = {
                                                    "id": user.data.data.user_id,
                                                    "email": values.email,
                                                    "firstName": values.firstName,
                                                    "lastName": values.lastName,
                                                    "password": values.currentPassword,
                                                    "resetPassword": false
                                                };
                                                await this.onUpdateUser(data);
                                                setSubmitting(false);
                                            } else {
                                                return
                                            }
                                        }
                                    }}
                                >
                                    {({ touched, errors, isSubmitting, setFieldValue }) => (
                                        <Form>
                                            <div className="row">
                                                <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="firstName">First Name</label>
                                                    <Field
                                                        type="text"
                                                        name="firstName"
                                                        placeholder="Enter First Name"
                                                        onChange={(e) => {
                                                            setFieldValue(e.target.name, e.target.value)
                                                            this.onFieldChange(e);
                                                        }}
                                                        onBlur={(e) => {
                                                            this.setState({
                                                                isEdited: false
                                                            });
                                                        }}
                                                        className={`form-control ${touched.firstName && errors.firstName ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="firstName"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="lastName">Last Name</label>
                                                    <Field
                                                        type="text"
                                                        name="lastName"
                                                        placeholder="Enter Last Name"
                                                        onBlur={(e) => {
                                                            this.setState({
                                                                isEdited: false
                                                            });
                                                        }}
                                                        onChange={(e) => {
                                                            setFieldValue(e.target.name, e.target.value)
                                                            this.onFieldChange(e);
                                                        }}
                                                        className={`form-control ${touched.lastName && errors.lastName ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="lastName"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="email">Email</label>
                                                    <Field
                                                        type="email"
                                                        name="email"
                                                        placeholder="Enter Email"
                                                        disabled={true}
                                                        onBlur={(e) => {
                                                            this.setState({
                                                                isEdited: false
                                                            });
                                                        }}
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
                                                        type="password"
                                                        name="currentPassword"
                                                        placeholder="Enter current password"
                                                        onBlur={(e) => {
                                                            this.setState({
                                                                isEdited: false
                                                            });
                                                        }}
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

                                            <div className="reset-password-div">
                                                {this.state.formField.resetPassword &&
                                                    <div className="row">
                                                        <div className="form-group col-md-6 col-lg-6">
                                                            <label htmlFor="newPassword">New Password</label>
                                                            <Field
                                                                type="password"
                                                                name="newPassword"
                                                                placeholder="Enter new password"
                                                                onBlur={(e) => {
                                                                    this.setState({
                                                                        isEdited: false
                                                                    });
                                                                }}
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
                                                                type="password"
                                                                name="confirmNewPassword"
                                                                placeholder="Confirm new password"
                                                                onBlur={(e) => {
                                                                    this.setState({
                                                                        isEdited: false
                                                                    });
                                                                }}
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
                                                }
                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="resetPassword">Reset Password</label>
                                                        <div className=" m-checkbox m-checkbox--switch">
                                                            <Field type="checkbox"
                                                                className="m-checkbox__input m-checkbox--switch__input"
                                                                name="resetPassword"
                                                                onBlur={(e) => {
                                                                    this.setState({
                                                                        isEdited: false
                                                                    });
                                                                }}
                                                                onChange={(e) => {
                                                                    if (e.target.value === 'false') {
                                                                        setFieldValue(e.target.name, true)
                                                                        this.setState({
                                                                            formField: { ...this.state.formField, [e.target.name]: true }
                                                                        })
                                                                    } else {
                                                                        setFieldValue(e.target.name, false)
                                                                        this.setState({
                                                                            formField: { ...this.state.formField, [e.target.name]: false }
                                                                        })
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <ErrorMessage
                                                            component="div"
                                                            name="resetPassword"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row justify-content-center">
                                                {this.state.formField.resetPassword ?
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-block w-25"
                                                        disabled={this.state.isEdited}
                                                    >
                                                        {isSubmitting ? "Please wait..." : "Submit"}
                                                    </button> :
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-block w-25"
                                                        disabled={this.state.isEdited}
                                                    >
                                                        {isSubmitting ? "Please wait..." : "Submit"}
                                                    </button>
                                                }
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
})(UserEditProfile);