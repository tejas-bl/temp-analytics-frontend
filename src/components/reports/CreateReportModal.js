import React from "react";
import { websiteRecordAction } from '../../actions';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-dropdown-select";
import { convertDateTOLocale, getCurrentUser, getWebsiteData, shoppersCurrentDetails } from "../../helper/Utils";
import DatePickerField from "../Dashboard/DatePickerField";
import { checkClientReportExist, createReport } from "../../api/Dashboard/Reports";
import ConfirmBoxModal from "../../helper/Component/ConfirmBoxModal";
import DynamicCheckboxField from "../Dashboard/DynamicCheckboxField";
import { subDays } from "date-fns";

class CreateReportModal extends React.Component {
    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.state = {
            formField: { site_id: "370", from_date: "2022-09-01", to_date: "2022-09-30", report_type: "", remarks: "" },
            websitesRecordLoading: true,
            websitesRecordOption: [],
            showConfirmBoxModal: false,
            isSubmitting: false,
            createReportDetails: {},
            createReportDetailsLoading: true,
            websitesRecord: [],
            selectedReportType: "",
            reportTypeOptions: [
                { label: "InDepth Report", value: "indepth" },
                { label: "Listening Phase Report", value: "listening" },
                { label: "MTD Report", value: "mtd" },
                { label: "Custom Report", value: "custom" }
            ],
            personaData: [
                {
                    "id": 7,
                    "name": "Adware Shopper",
                    "short_code": "shield",
                },
                {
                    "id": 2,
                    "name": "Hesitant Shopper",
                    "short_code": "ti3",
                },
                {
                    "id": 4,
                    "name": "Coupon Runner",
                    "short_code": "epr",
                },
                {
                    "id": 3,
                    "name": "Extension Shopper",
                    "short_code": "e-ei",
                },
                {
                    "id": 5,
                    "name": "Do I Really Need This Shopper",
                    "short_code": "cs",
                },
                {
                    "id": 1,
                    "name": "Wrong Coupon",
                    "short_code": "wc",
                },
                {
                    "id": 6,
                    "name": "Premium Product",
                    "short_code": "pp",
                }
            ],
            checkboxField: []
        }
        this.onClickConfirmModal = this.onClickConfirmModal.bind(this);


    }

    async componentDidMount() {
        let localStorageWebsiteData = await getWebsiteData();
        this.setState({
            websitesRecordLoading: false,
            websitesRecordOption: localStorageWebsiteData,
            websitesRecord: localStorageWebsiteData
        })
        this.handleShopperScreenshotCheckbox();
    }

    handleShopperScreenshotCheckbox() {
        const checkboxField = [];
        const splitAndActiveStatus = shoppersCurrentDetails(this.props.sessionClient)
        for (let [key, value] of Object.entries(this.state.personaData)) {
            checkboxField.push(<div className='row customReportPersonaHeadingRow' key={`div_${value.id}`}>

                <div className="customReportPersonaHeading mr-5">{value.name}
                    <div className="customReportPersonaStatus">
                        <span className={`customReportPersonaIsActive ${splitAndActiveStatus[value.id].isActive ? "customReportPersonaPostStatus" : "customReportPersonaPreStatus"}`}>
                        </span>
                        <span className={`customReportPersonaSpanSplit`}>
                            {splitAndActiveStatus[value.id].split}
                        </span>
                    </div>
                </div>
                <div className='row'>
                    <Field
                        key={`analytics_${value.id}`}
                        name="persona"
                        label={`Analytics`}
                        component={DynamicCheckboxField}
                        entryIndex={key}
                        handleCheckbox={() => { }}
                        personaId={`analytics_${value.id}`}
                    />

                    <Field
                        key={`significance_${value.id}`}
                        name="persona"
                        label={`Significance`}
                        component={DynamicCheckboxField}
                        entryIndex={key}
                        handleCheckbox={() => { }}
                        personaId={`significance_${value.id}`}
                    />
                </div>
            </div>);
            this.setState({
                checkboxField
            })
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
            this.setState({
                websitesRecordLoading: true,
                selectedReportType: ""
            })
            if (getWebsiteData() !== null && getWebsiteData().length > 0) {
                const localStorageWebsiteData = await getWebsiteData();
                this.setState({
                    websitesRecordLoading: false,
                    websitesRecordOption: localStorageWebsiteData,
                    websitesRecord: localStorageWebsiteData
                })
            }
            this.handleShopperScreenshotCheckbox();
        }
    }


    async onClickCheckReportExist(data) {
        this.setState({
            isSubmitting: true
        });
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${currentUser.refresh_token}`,
            }
        }
        const report_type_and_name = JSON.parse(data.report_type);
        if (report_type_and_name.type === 'listening') {
            data.from_date = convertDateTOLocale(subDays(new Date(data.to_date), 30))
            data.to_date = convertDateTOLocale(data.to_date);
        } else {
            data.from_date = convertDateTOLocale(data.from_date);
            data.to_date = convertDateTOLocale(data.to_date);
        }

        const checkReportExist = await checkClientReportExist(data, headerConfig);
        if (checkReportExist && checkReportExist.data.hasOwnProperty('data') && checkReportExist.data.data.length > 0) {
            this.setState({
                createReportDetails: data,
                createReportDetailsLoading: false,
                showConfirmBoxModal: true,
            });

        } else {
            const createdReport = await createReport(data, headerConfig);
            if (createdReport && createdReport.hasOwnProperty('data') && createdReport.data.statuscode === 200) {
                this.setState({
                    createReportDetails: data,
                    createReportDetailsLoading: false,
                    isSubmitting: false
                });
                this.props.onClose(true);
            } else {
                this.props.onClose(false);
            }
        }

    }
    async onClickConfirmModal(status, data) {
        this.setState({
            showConfirmBoxModal: false,
        });
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${currentUser.refresh_token}`,
            }
        }
        if (status) {
            data.softDelete = true;
            const createdReport = await createReport(data, headerConfig);
            if (createdReport && createdReport.hasOwnProperty('data') && createdReport.data.statuscode === 200) {
                this.setState({
                    showConfirmBoxModal: false,
                    isSubmitting: false
                });
                this.props.onClose(true);
            } else {
                this.setState({
                    showConfirmBoxModal: false,
                    isSubmitting: false
                });
                this.props.onClose(false);
            }

        } else {
            this.setState({
                showConfirmBoxModal: false,
                isSubmitting: false
            });
        }
    }
/* 
    async onCreateReport(data) {
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

        const checkReportExist = await checkClientReportExist(data, headerConfig);
        if (checkReportExist && checkReportExist.data.hasOwnProperty('data') && checkReportExist.data.data.length > 0) {
            this.props.onClose(false);

        } else {
            const createdReport = await createReport(data, headerConfig);
            if (createdReport && createdReport.hasOwnProperty('data') && createdReport.data.statuscode === 200) {
                this.props.onClose(true);
            } else {
                this.props.onClose(false);
            }

        }
    } */

    onFieldChange(e) {
        this.setState({
            formField: { ...this.state.formField, [e.target.name]: e.target.value }
        })
    }

    render() {
        const { onClose, size, show } = this.props;
        return (
            <Modal centered size={size} show={show} onHide={onClose} className="CreateReportModal">
                <Modal.Header closeButton>
                    <Modal.Title>Create Report for {this.props.sessionClient.web_url}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="mian-content">
                            <div className="card col-lg-12 col-md-12">
                                <div className="body">
                                    <div className="body" id="addReportBody">
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
                                            initialValues={{ from_date: "2022-11-01", to_date: "2022-11-30", report_type: "", site_id: this.props.sessionClient.web_id, remarks: "", persona: [] }}
                                            onSubmit={async (values, { setSubmitting }) => {
                                                if (values.from_date !== "" && values.to_date !== "" && values.report_type.length > 0) {
                                                    const data = {
                                                        "from_date": convertDateTOLocale(values.from_date),
                                                        "to_date": convertDateTOLocale(values.to_date),
                                                        "report_type": values.report_type,
                                                        "site_id": values.site_id,
                                                        "remarks": values.remarks,
                                                        "deleted_on": null,
                                                        "client_details": this.props.sessionClient,
                                                        "updated_at": new Date(),
                                                        "persona": values.persona
                                                    }

                                                    //await this.onCreateReport(data);
                                                    await this.onClickCheckReportExist(data);
                                                    /* this.props.onClose(true);
                                                    setSubmitting(false); */
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
                                                                onChange={(e) => {
                                                                    setFieldValue('report_type', JSON.stringify({
                                                                        name: e[0].label,
                                                                        type: e[0].value
                                                                    }));
                                                                    this.setState({
                                                                        selectedReportType: e[0].value
                                                                    })
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
                                                                placeholder="Enter Remark"
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
                                                    {this.state.selectedReportType === 'custom' ?
                                                        <div className="form-group mt-3">
                                                            <label htmlFor="persona-group">What Shopper's Screenshot Type You want to Display?</label>
                                                            <div role="group" className="col-md-12" aria-labelledby="persona-group">
                                                                {this.state.checkboxField}
                                                                <div className="pl-2"><span>{this.state.personaErrorMessage}</span></div>
                                                            </div>
                                                        </div> : ""}
                                                    <div className="row justify-content-center">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary btn-block w-25"
                                                            disabled={this.state.isSubmitting || isSubmitting}
                                                        >
                                                            {this.state.isSubmitting || isSubmitting ? "Please wait..." : "Submit"}
                                                        </button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>

                                    <ConfirmBoxModal
                                        key={"confirmBoxModal"}
                                        size={"md"}
                                        title={"Report Already Exist!"}
                                        message={"Please confirm to overwrite the existing report"}
                                        reportDetails={!this.state.createReportDetailsLoading && this.state.createReportDetails}
                                        show={this.state.showConfirmBoxModal}
                                        onClose={(flag, data) => this.onClickConfirmModal(flag, data)}
                                        handleOnClose={(flag, data) => this.onClickConfirmModal(flag, data)}
                                    />
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
})(CreateReportModal);