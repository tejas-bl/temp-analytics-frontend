import React from "react";
import { websiteRecordAction } from '../../actions';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-dropdown-select";
import { convertDateTOLocale, getCurrentUser, getWebsiteData } from "../../helper/Utils";
import DatePickerField from "../Dashboard/DatePickerField";
import { updateReport } from "../../api/Dashboard/Reports";

class EditReportModal extends React.Component {
    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.state = {
            formField: { site_id: "", from_date: "", to_date: "", report_type: "", remarks: "" },
            websitesRecordLoading: true,
            websitesRecordOption: [],
            websitesRecord: [],
            reportTypeOptions: [
                { label: "Listening Phase Report", value: "listening" },
                { label: "InDepth Report", value: "indepth" },
                { label: "MTD Report", value: "mtd" }
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

    async onUpdateReport(data) {
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${currentUser.refresh_token}`,
            }
        }
        data.from_date = convertDateTOLocale(data.from_date);
        data.to_date = convertDateTOLocale(data.to_date);
        const updatedUser = await updateReport(data, headerConfig);
        if (updatedUser && updatedUser.hasOwnProperty('data') && updatedUser.data.statuscode === 200) {
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
        const { onClose, size, show, data } = this.props;
        return (
            <Modal size={size} show={show} onHide={onClose} className="edituserModal">
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="mian-content">
                            <div className="card col-lg-12 col-md-12">
                                <div className="body">
                                    <div className="body" id="addCouponBody">
                                        <Formik
                                            validate={(values) => {
                                                let errors = {};
                                                if (values.from_date === "") {
                                                    errors.from_date = "From Date is required";
                                                }

                                                if (values.to_date === "") {
                                                    errors.to_date = "To Date is required";
                                                }
                                                if (!values.report_type) {
                                                    errors.report_type = 'Required';
                                                }
                                                return errors;
                                            }}
                                            initialValues={{ from_date: new Date(data.from_date), to_date: new Date(data.to_date), report_type: data.report_type, site_id: this.props.sessionClient.web_id, remarks: data.remarks }}
                                            onSubmit={async (values, { setSubmitting }) => {
                                                if (values.from_date !== "" && values.to_date !== "" && values.report_type.length > 0) {
                                                    const data = {
                                                        "from_date": values.from_date,
                                                        "to_date": values.to_date,
                                                        "report_type": values.report_type,
                                                        "site_id": values.site_id,
                                                        "remarks": values.remarks,
                                                        "deleted_on": null,
                                                        "updated_at": new Date()
                                                    }
                                                    await this.onUpdateReport(data);
                                                    this.props.onClose(true);
                                                    setSubmitting(false);
                                                }
                                            }}
                                        >
                                            {({ touched, errors, isSubmitting, setFieldValue }) => (
                                                <Form>
                                                    <div className="row">
                                                        <div className="form-group col-md-4 col-lg-4 pr-0">
                                                            <label htmlFor="from_date">From Date</label>
                                                            <DatePickerField name="from_date" className={`${touched.from_date && errors.from_date ? "is-invalid" : ""}`} />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="from_date"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>

                                                        <div className="form-group col-md-4 col-lg-4 pr-0">
                                                            <label htmlFor="to_date">To Date</label>
                                                            <DatePickerField name="to_date" className={`${touched.to_date && errors.to_date ? "is-invalid" : ""}`} />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="to_date"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>

                                                        <div className="form-group col-md-4 col-lg-4">
                                                            <label htmlFor="role">Select Report Type</label>
                                                            <Select
                                                                placeholder="Select Report Type"
                                                                name="report_type"
                                                                className={`col-md-12 form-control ${touched.report_type && errors.report_type ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.state.reportTypeOptions}
                                                                values={this.props.data.report_type}
                                                                onChange={(e) => {
                                                                    setFieldValue('report_type', JSON.stringify({
                                                                        name: e[0].label,
                                                                        type: e[0].value
                                                                    }));
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="report_type"
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
            </Modal>
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
})(EditReportModal);