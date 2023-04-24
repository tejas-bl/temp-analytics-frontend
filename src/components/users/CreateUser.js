import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction } from '../../actions';
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-dropdown-select";
import { getCurrentUser, getWebsiteData } from "../../helper/Utils";
import { createUser } from "../../api/Dashboard/OldDB";

class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.state = {
            formField: { firstName: "", lastName: "", email: "", password: "", roles: [], web_account_id: "", site_id: "" },
            websitesRecordLoading: true,
            websitesRecordOption: [],
            websitesRecord: [],
            rolesOptions: [
                { label: "Admin", value: "admin" },
                { label: "Client", value: "client" }
            ]
        }
    }

    async componentDidMount() {
        let localStorageWebsiteData = await getWebsiteData();
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

    async onAddUser(data) {
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${currentUser.refresh_token}`,
            }
        }
        const createdUser = await createUser(data, headerConfig);
        if (createdUser && createdUser.hasOwnProperty('data') && createdUser.data.statuscode === 200) {
            this.props.onClose(true);
        } else {
            this.props.onClose(false);
        }
    }

    onFieldChange(e) {
        this.setState({
            formField: { ...this.state.formField, [e.target.name]: e.target.value }
        })
    }

    render() {
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
                                        if (!values.roles) {
                                            errors.roles = 'Required';
                                        }
                                        if (values.web_account_id === '') {
                                            errors.web_account_id = 'Required';
                                        }
                                        if (!values.email) {
                                            errors.email = 'Required';
                                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(values.email)) {
                                            errors.email = 'Invalid email address';
                                        }
                                        if (values.password.length < 8) {
                                            errors.password = 'password must be 8 characters long';
                                        }

                                        if (values.password !== values.Cpassword) {
                                            errors.Cpassword = 'password not matched';
                                        }
                                        return errors;
                                    }}
                                    initialValues={{ firstName: "", lastName: "", email: "", password: "", roles: "", site_id: "", web_account_id: "", Cpassword: "", isActive: false }}
                                    onSubmit={async (values, { setSubmitting }) => {
                                        if (values.firstName !== "" && values.lastName !== "" && values.email !== "" && values.roles.length > 0 && values.web_account_id !== "" && values.password === values.Cpassword) {
                                            const data = {
                                                "email": values.email,
                                                "password": values.password,
                                                "firstName": values.firstName,
                                                "lastName": values.lastName,
                                                "roles": values.roles,
                                                "web_account_id": values.web_account_id,
                                                "site_id": values.site_id,
                                                "is_active": values.isActive
                                            }
                                            await this.onAddUser(data);
                                            this.props.onClose(true);
                                            setSubmitting(false);
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
                                                <div className="form-group col-md-3 col-lg-3">
                                                    <label htmlFor="password">Password</label>
                                                    <Field
                                                        type="password"
                                                        name="password"
                                                        placeholder="Enter Password"
                                                        onChange={(e) => {
                                                            setFieldValue(e.target.name, e.target.value)
                                                            this.onFieldChange(e);
                                                        }}
                                                        className={`form-control ${touched.password && errors.password ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="password"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3 col-lg-3">
                                                    <label htmlFor="Cpassword">Confirm Password</label>
                                                    <Field
                                                        type="Cpassword"
                                                        name="Cpassword"
                                                        placeholder="Confirm Password"
                                                        onChange={(e) => {
                                                            setFieldValue(e.target.name, e.target.value)
                                                            this.onFieldChange(e);
                                                        }}
                                                        className={`form-control ${touched.Cpassword && errors.Cpassword ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="Cpassword"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="role">Select Role</label>
                                                    <Select
                                                        placeholder="Select Role"
                                                        name="roles"
                                                        className={`col-md-12 form-control ${touched.roles && errors.roles ? "is-invalid" : ""}`}
                                                        valueField="value"
                                                        labelField="label"
                                                        searchBy="label"
                                                        searchable
                                                        style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                        multi={false}
                                                        /* values={[this.state.rolesOptions.find((opt) => {
                                                            return opt.value === 'client'

                                                        })]} */
                                                        closeOnSelect={true}
                                                        backspaceDelete={true}
                                                        clearOnSelect={true}
                                                        options={this.state.rolesOptions}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                websitesRecordLoading: true
                                                            })
                                                            if (e[0].value === 'admin') {
                                                                this.setState(prevState => ({
                                                                    websitesRecordOption: [{
                                                                        web_account_id: 0,
                                                                        web_id: 0,
                                                                        web_url: "All Clients"
                                                                    }, ...prevState.websitesRecordOption],
                                                                    websitesRecordLoading: false
                                                                }))
                                                            } else {
                                                                this.setState({
                                                                    websitesRecordOption: this.state.websitesRecordOption.filter(function (site) {
                                                                        return site.web_account_id !== 0
                                                                    }),
                                                                    websitesRecordLoading: false
                                                                });
                                                            }
                                                            setFieldValue('roles', e[0].value);
                                                        }}
                                                    />

                                                    <ErrorMessage
                                                        component="div"
                                                        name="roles"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 col-lg-6">
                                                    <label htmlFor="web_account_id">Select Client</label>
                                                    <Select
                                                        placeholder="Select Website"
                                                        name="web_account_id"
                                                        className={`col-md-12 form-control ${touched.web_account_id && errors.web_account_id ? "is-invalid" : ""}`}
                                                        valueField="web_url"
                                                        labelField="web_url"
                                                        searchBy="web_url"
                                                        searchable
                                                        style={{ paddingLeft: "15px", borderRadius: "5px" }}
                                                        multi={false}
                                                        closeOnSelect={true}
                                                        backspaceDelete={true}
                                                        clearOnSelect={true}
                                                        /* values={[!this.state.websitesRecordLoading &&

                                                            (() => {
                                                                let web_account_id_found = false;
                                                                web_account_id_found = this.state.websitesRecordOption.find((opt) => {
                                                                    if (this.state.websitesRecord !== undefined && this.state.websitesRecord !== null && this.state.websitesRecord.length > 0) {
                                                                        return opt.web_account_id === this.state.websitesRecordOption[0].web_account_id
                                                                    }
                                                                })
                                                                if (web_account_id_found === false || web_account_id_found === undefined) {
                                                                    return this.state.websitesRecordOption[0];
                                                                } else {
                                                                    return web_account_id_found;
                                                                }
                                                            })()
                                                        
                                                        ]} */
                                                        options={!this.state.websitesRecordLoading &&
                                                            this.state.websitesRecordOption}
                                                        onChange={(e) => {
                                                            if (e.length !== 0) {
                                                                setFieldValue('site_id', e[0].web_id);
                                                                setFieldValue('web_account_id', e[0].web_account_id);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
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
})(CreateUser);