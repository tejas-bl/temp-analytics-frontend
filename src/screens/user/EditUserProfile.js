import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction } from '../../actions';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getCurrentUser, getWebsiteData } from "../../helper/Utils";
import { updateUsers } from "../../api/Dashboard/OldDB";
import Select from "react-dropdown-select";

class EditUserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.state = {
            user: this.props.userData,
            formField: { firstName: "", lastName: "", email: "", currentPassword: "", newPassword: "", confirmNewPassword: "", resetPassword: false, isActive: false },
            websitesRecordLoading: true,
            websitesRecordOption: [],
            websitesRecord: [],
            isSubmittingData: false,
            isEdited: true,
            rolesOptions: [
                { label: "Admin", value: "admin" },
                { label: "Client", value: "client" }
            ]
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
            websitesRecord: localStorageWebsiteData
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
                    websitesRecord: localStorageWebsiteData
                })
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
        const updatedUser = await updateUsers(data, headerConfig);
        if (updatedUser.data.statuscode === 200) {
            this.props.onClose(true)
        } else {
            this.props.onClose(false)
        }
    }

    onFieldChange(e) {
        this.setState({
            formField: { ...this.state.formField, [e.target.name]: e.target.value }
        })
    }

    render() {
        const { user } = this.state;
        const currentUser = getCurrentUser().data.data;
        return (
            <div className="container-fluid">
                <div className="mian-content">
                    <div className="card col-lg-12 col-md-12">
                        <div className="body">
                            <div className="body" id="addCouponBody">
                                <Formik
                                    validate={(values) => {
                                        let errors = {};
                                        if (!values.firstName) {
                                            errors.firstName = 'Required';
                                        }
                                        if (!values.lastName) {
                                            errors.lastName = 'Required';
                                        }
                                        if (!values.email) {
                                            errors.email = 'Required';
                                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(values.email)) {
                                            errors.email = 'Invalid email address';
                                        }

                                        if (values.resetPassword) {
                                            if (values.newPassword !== values.confirmNewPassword) {
                                                errors.confirmNewPassword = 'password not matched';
                                            }
                                            if (values.newPassword.length < 8) {
                                                errors.newPassword = 'password must be 8 characters long';
                                            }
                                        }
                                        if (!values.currentPassword) {
                                            errors.currentPassword = 'Required';
                                        }
                                        return errors;
                                    }}
                                    initialValues={{ firstName: user.firstName, lastName: user.lastName, email: user.email, currentPassword: "", newPassword: "", confirmNewPassword: "", resetPassword: false, isActive: user.is_active, roles: user.roles, web_account_id: user.web_account_id }}
                                    onSubmit={async (values, { setSubmitting }) => {
                                        if (values.resetPassword) {
                                            if (values.firstName !== "" && values.lastName !== "" && values.email !== "" && values.currentPassword !== "" && values.newPassword !== "" && values.confirmNewPassword !== "" && values.newPassword === values.confirmNewPassword) {
                                                const data = {
                                                    "id": user.id,
                                                    "email": values.email,
                                                    "firstName": values.firstName,
                                                    "lastName": values.lastName,
                                                    "webAccountId": values.web_account_id,
                                                    "roles": values.roles,
                                                    "password": values.currentPassword,
                                                    "resetPassword": true,
                                                    "newPassword": values.newPassword,
                                                    "isActive": values.isActive,
                                                    "adminId": currentUser.user_id,
                                                };
                                                await this.onUpdateUser(data);
                                            } else {
                                                return;
                                            }
                                        } else {
                                            if (values.firstName !== "" && values.lastName !== "" && values.email !== "" && values.currentPassword !== "") {
                                                const data = {
                                                    "id": user.id,
                                                    "email": values.email,
                                                    "firstName": values.firstName,
                                                    "lastName": values.lastName,
                                                    "webAccountId": values.web_account_id,
                                                    "roles": values.roles,
                                                    "password": values.currentPassword,
                                                    "resetPassword": false,
                                                    "isActive": values.isActive,
                                                    "adminId": currentUser.user_id,
                                                };
                                                await this.onUpdateUser(data);
                                                this.props.onClose(true);
                                                setSubmitting(false);
                                            } else {
                                                this.props.onClose(false);
                                                setSubmitting(false);
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
                                                    <label htmlFor="currentPassword">Admin Account Password</label>
                                                    <Field
                                                        type="password"
                                                        name="currentPassword"
                                                        placeholder="Enter Admin Account password"
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

                                            <div className="row">
                                                <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="roles">Select Role</label>
                                                    <Select
                                                        placeholder="Select Role"
                                                        className="col-md-12"
                                                        valueField="value"
                                                        labelField="label"
                                                        searchBy="label"
                                                        searchable
                                                        style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                        multi={false}
                                                        values={[this.state.rolesOptions.find((opt) => {
                                                            return opt.value === user.roles

                                                        })]}
                                                        closeOnSelect={true}
                                                        backspaceDelete={true}
                                                        clearOnSelect={true}
                                                        options={this.state.rolesOptions}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                websitesRecordLoading : true
                                                            })
                                                            if (e[0].value === 'admin') {

                                                                this.setState(prevState => ({
                                                                    websitesRecordOption: [{
                                                                        web_account_id: 0,
                                                                        web_url: "All Clients"
                                                                    }, ...prevState.websitesRecordOption],
                                                                    websitesRecordLoading :  false
                                                                }))
                                                            } else {
                                                                this.setState({
                                                                    websitesRecordOption: this.state.websitesRecordOption.filter(function (site) {
                                                                        return site.web_account_id !== 0
                                                                    }),
                                                                    websitesRecordLoading :  false
                                                                });
                                                            }
                                                            setFieldValue('roles', e[0].value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="password">Select Client</label>
                                                    <Select
                                                        placeholder="Select Website"
                                                        className="col-md-12"
                                                        valueField="web_url"
                                                        labelField="web_url"
                                                        searchBy="web_url"
                                                        searchable
                                                        style={{ paddingLeft: "15px", borderRadius: "5px" }}
                                                        multi={false}
                                                        closeOnSelect={true}
                                                        backspaceDelete={true}
                                                        clearOnSelect={true}
                                                        values={[!this.state.websitesRecordLoading &&
                                                            (() => {
                                                                let web_account_id_found = false;
                                                                web_account_id_found = this.state.websitesRecordOption.find((opt) => {
                                                                    if (this.state.websitesRecord !== undefined && this.state.websitesRecord !== null && this.state.websitesRecord.length > 0) {
                                                                        return opt.web_account_id === user.web_account_id
                                                                    }
                                                                })
                                                                if (web_account_id_found === false || web_account_id_found === undefined) {
                                                                    return this.state.websitesRecordOption[0];
                                                                } else {
                                                                    return web_account_id_found;
                                                                }
                                                            })()
                                                        ]}
                                                        options={!this.state.websitesRecordLoading &&
                                                            this.state.websitesRecordOption}
                                                        onChange={(e) => {
                                                            if (e.length !== 0) {
                                                                setFieldValue('web_account_id', e[0].web_account_id);
                                                            }
                                                        }}
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
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="isActive">Active</label>
                                                        <div className=" m-checkbox m-checkbox--switch">
                                                            <Field type="checkbox"
                                                                className="m-checkbox__input m-checkbox--switch__input"
                                                                name="isActive"
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
                                                            name="isActive"
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
                                                    //disabled={this.state.isEdited}
                                                    >
                                                        {isSubmitting ? "Please wait..." : "Submit"}
                                                    </button> :
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-block w-25"
                                                    //disabled={this.state.isEdited}
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
})(EditUserProfile);