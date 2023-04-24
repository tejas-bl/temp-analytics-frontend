import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction, onPressSideMenuTab, onLoggedin } from '../../actions';
import { Form, Modal } from "react-bootstrap";
import { getCurrentUser } from "../../helper/Utils";
import { Toast } from "react-bootstrap";
import { updateScreenshot } from "../../api/Dashboard/Reports";
import { ErrorMessage, Field, Formik } from "formik";
import Select from "react-dropdown-select";

class EditScreenshotModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            screenshots: [],
            loadingModal: false,
            showCreateReportModal: false,
            isSubmitting: false,
            showEditScreenshotModal: false,
            showShopperInjectionTypeTextFieldCustomData: true,
            adwareShopperInjectionTypeDropdown: [
                { label: "Price Comparison", value: "price_comparison" },
                { label: "Video Ads", value: "video_ads" },
                { label: "Banner Ads", value: "banner_ads" },
                { label: "In-Text Ads", value: "in_text_ads" },
                { label: "Hijacking Scripts", value: "hijacking_scripts" },
                { label: "Mobile Ads", value: "mobile_ads" }
            ],
            adwareShopperSequenceNumber: [
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
                { label: "6", value: "6" },
                { label: "7", value: "7" },
                { label: "8", value: "8" }
            ],
            showAdwareShopperInjectionTypeDropdown: false,
            showAdwareShopperSequenceNumberDropdown: false,
            editModalData: {},
            showDeleteModal: false,
            deleteData: {},
            newScreenshotdata: {},
            isNewScreenshotdataLoading: true,
            loadToaster: false,
            toasterMessage: null,
            //////////
            formField: { site_id: "", report_type: "", screenshot_type: "", remarks: "", screenshots: "" },
            reportTypeOptions: [
                { label: "InDepth Report", value: "indepth" },
                /*                 { label: "Listening Phase Report", value: "listening" },
                                { label: "MTD Report", value: "mtd" } */
            ],
            screenshotTypeOptions: [
                { label: "Problem", value: "problem" },
                { label: "Solution", value: "solution" },
            ],
            shoppersOptions: [
                { label: `${this.props.shopperRecord.shield}`, value: 7 },
                { label: `${this.props.shopperRecord.ti3}`, value: 2 },
                { label: `${this.props.shopperRecord.epr}`, value: 4 },
                { label: `${this.props.shopperRecord['e-ei']}`, value: 3 },
                { label: `${this.props.shopperRecord.cs}`, value: 5 },
                { label: `${this.props.shopperRecord.wc}`, value: 1 },
                /*                 { label: "Listening Phase Report", value: "listening" },
                                { label: "MTD Report", value: "mtd" } */
            ]
        }
        this.onClickEditScreenshotModal = this.onClickEditScreenshotModal.bind(this);
        this.onUpdateScreenshot = this.onUpdateScreenshot.bind(this);
        this.props.onPressSideMenuTab(4);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    async componentDidUpdate(prevProps) {
        if (this.props.data.shopper_name !== prevProps.data.shopper_name) {
            if (parseInt(this.props.data.shopper_id) === 7) {
                this.setState({
                    showAdwareShopperInjectionTypeDropdown: true,
                    showAdwareShopperSequenceNumberDropdown: true
                })
            } else {
                this.setState({
                    showAdwareShopperInjectionTypeDropdown: false,
                    showAdwareShopperSequenceNumberDropdown: false
                })
            }
        }
    }

    onClickEditScreenshotModal(data) {
        this.setState({
            editModalData: data,
            showEditScreenshotModal: true
        });
    }

    async onUpdateScreenshot(data) {
        let status = false;
        this.setState({
            isSubmitting: true
        });
        const currentUser = getCurrentUser();
        const headerConfig = {
            headers: {
                Authorization: currentUser && currentUser.hasOwnProperty('data') && `Bearer ${currentUser.data.data.refresh_token}`
            }
        }

        try {
            const updateScreenshotResponse = await updateScreenshot(data, headerConfig);
            if (updateScreenshotResponse !== undefined && updateScreenshotResponse.hasOwnProperty('data') && updateScreenshotResponse.data.statuscode === 200) {
                this.setState({
                    loadToaster: true,
                    toasterMessage: "Updated Successfully",
                    isSubmitting: false
                });
                status = true;
            } else {
                this.setState({
                    loadToaster: true,
                    toasterMessage: "Something went wrong!",
                    isSubmitting: false
                });
            }

        } catch (err) {
            this.setState({
                loadToaster: true,
                toasterMessage: "Something went wrong!",
                isSubmitting: false
            });
        }
        this.props.onClose(status);
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
                    <Modal.Title>Update Screenshot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="mian-content">
                            <Toast
                                id="toast-container"
                                show={this.state.loadToaster}
                                onClose={() => {
                                    this.setState({
                                        loadToaster: false
                                    })
                                }}
                                className="toast-info toast-top-right"
                                autohide={true}
                                delay={500}
                            >
                                <Toast.Header className="toast-info mb-0">
                                    {this.state.toasterMessage}
                                </Toast.Header>
                            </Toast>
                            <div className="card col-lg-12 col-md-12">
                                <div className="body">
                                    <div className="body pt-0" id="addSreenshotBody">

                                        <Formik
                                            initialValues={{ report_type: data.report_type, screenshot_type: data.screenshot_type, site_id: this.props.sessionClient.web_id, remarks: "", screenshots: null, shopper_top_data: data.shopper_top_data, top_data_order: "", shopper_top_data_custom_value: data.shopper_top_data_id }}
                                            onSubmit={async (values, { setSubmitting }) => {
                                                if (values.report_type.length > 0) {
                                                    const data = {
                                                        "remarks": values.remarks,
                                                        "report_type": values.report_type,
                                                        "site_id": values.site_id,
                                                        "shopper_id": this.props.data.shopper_id,
                                                        "screenshot_type": values.screenshot_type,
                                                        "s3_version_id": this.props.data.s3_version_id,
                                                        "shopper_top_data": values.shopper_top_data !== "" ? values.shopper_top_data : null,
                                                        "shopper_top_data_id": values.shopper_top_data_custom_value !== "" ? values.shopper_top_data_custom_value : null,
                                                        "top_data_order": values.top_data_order !== "" ? values.top_data_order : null,
                                                        "deleted_on": null,
                                                        "screenshot_name": this.props.data.screenshot_name,
                                                        "updated_at": new Date()
                                                    }
                                                    await this.onUpdateScreenshot(data);
                                                    setSubmitting(false);
                                                }
                                            }}
                                        >
                                            {({ touched, errors, isSubmitting, handleSubmit, setFieldValue }) => (
                                                <Form onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleSubmit()
                                                }}>
                                                    <div className="row">

                                                        <div className="form-group col-md-4 col-lg-4 ">
                                                            <label htmlFor="report_type">Screenshots for</label>
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
                                                                values={[this.state.reportTypeOptions.find((opt) => {
                                                                    return opt.value === data.report_type

                                                                })]}
                                                                options={this.state.reportTypeOptions}
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
                                                        <div className="form-group col-md-4 col-lg-4 ">
                                                            <label htmlFor="screenshot_type">Screenshot Type</label>
                                                            <Select
                                                                placeholder="Select Screenshot Type"
                                                                name="screenshot_type"
                                                                className={`col-md-12 form-control ${touched.screenshot_type && errors.screenshot_type ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}

                                                                values={[this.state.screenshotTypeOptions.find((opt) => {
                                                                    return opt.value === data.screenshot_type

                                                                })]}
                                                                options={this.state.screenshotTypeOptions}
                                                                onChange={(e) => {
                                                                    setFieldValue('screenshot_type', JSON.stringify({
                                                                        name: e[0].label,
                                                                        type: e[0].value
                                                                    }));
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="screenshot_type"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4 col-lg-4">
                                                            <label htmlFor="shoppers">Shoppers</label>
                                                            <Select
                                                                disabled
                                                                placeholder="Select Shopper"
                                                                name="shoppers"
                                                                className={`col-md-12 form-control ${touched.shoppers && errors.shoppers ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                options={this.state.shoppersOptions}
                                                                values={[this.state.shoppersOptions.find((opt) => {
                                                                    if (opt.value === parseInt(data.shopper_id)) {
                                                                        return true
                                                                    }
                                                                })]}
                                                                onChange={(e) => {
                                                                    if (e[0].value === 7) {
                                                                        this.setState({
                                                                            showAdwareShopperInjectionTypeDropdown: true,
                                                                            showAdwareShopperSequenceNumberDropdown: true
                                                                        })
                                                                    } else {
                                                                        this.setState({
                                                                            showAdwareShopperInjectionTypeDropdown: false,
                                                                            showAdwareShopperSequenceNumberDropdown: false
                                                                        })
                                                                        setFieldValue('shopper_top_data', null);
                                                                        setFieldValue('top_data_order', null);
                                                                    }
                                                                    setFieldValue('shoppers', JSON.stringify({
                                                                        name: e[0].label,
                                                                        id: e[0].value
                                                                    }));
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="shoppers"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="row">

                                                        <div className={this.state.showAdwareShopperInjectionTypeDropdown && data.shopper_id == 7 ? "form-group col-md-4 col-lg-4 d-none" : "form-group col-md-4 col-lg-4"}>
                                                            <label htmlFor="shopper_top_data">Shopper Top Data Label</label>
                                                            <Field
                                                                type="text"
                                                                name="shopper_top_data"
                                                                onChange={(e) => {
                                                                    setFieldValue(e.target.name, e.target.value)
                                                                    this.onFieldChange(e);
                                                                }}
                                                                placeholder="Enter Shopper Top Data Label"
                                                                className={`form-control ${touched.shopper_top_data && errors.shopper_top_data ? "is-invalid" : ""
                                                                    }`}
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="shopper_top_data"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>


                                                        <div className={this.state.showShopperInjectionTypeTextFieldCustomData && data.shopper_id != 7 ? "form-group col-md-4 col-lg-4" : "form-group col-md-4 col-lg-4 d-none"}>
                                                            <label htmlFor="shopper_top_data_custom_value">Shopper Top Data Value</label>
                                                            <Field
                                                                type="text"
                                                                name="shopper_top_data_custom_value"
                                                                onChange={(e) => {
                                                                    setFieldValue(e.target.name, e.target.value)
                                                                    this.onFieldChange(e);
                                                                }}
                                                                placeholder="Enter Top Data Value"
                                                                className={`form-control ${touched.shopper_top_data_custom_value && errors.shopper_top_data_custom_value ? "is-invalid" : ""
                                                                    }`}
                                                            />
                                                            {this.state.selectedShopper === 2 ?
                                                                <span className="text-muted industryAvg">Time in Seconds</span>
                                                                : ""
                                                            }
                                                            <ErrorMessage
                                                                component="div"
                                                                name="shopper_top_data_custom_value"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className={this.state.showAdwareShopperSequenceNumberDropdown && data.shopper_id == 7 ? "form-group col-md-4 col-lg-4" : "form-group col-md-4 col-lg-4 d-none"}>
                                                            <label htmlFor="top_data_order">Sequence Number</label>
                                                            <Select
                                                                placeholder="Select Sequence Number"
                                                                name="top_data_order"
                                                                className={`col-md-12 form-control ${touched.top_data_order && errors.top_data_order ? "is-invalid" : ""}`}
                                                                valueField="value"
                                                                labelField="label"
                                                                searchBy="label"
                                                                searchable
                                                                style={{ paddingLeft: "7px", borderRadius: "5px" }}
                                                                multi={false}
                                                                closeOnSelect={true}
                                                                backspaceDelete={true}
                                                                clearOnSelect={true}
                                                                values={[this.state.showAdwareShopperSequenceNumberDropdown && data.shopper_id == 7 && this.state.adwareShopperSequenceNumber.find((opt) => {
                                                                    return parseInt(opt.value) === parseInt(data.top_data_order)
                                                                })]}
                                                                options={this.state.adwareShopperSequenceNumber}
                                                                onChange={(e) => {
                                                                    if (e !== null) {
                                                                        setFieldValue('top_data_order', JSON.stringify({
                                                                            name: e[0].label,
                                                                            value: e[0].value
                                                                        }));
                                                                    } else {
                                                                        setFieldValue('top_data_order', null);
                                                                    }
                                                                }}
                                                            />

                                                            <ErrorMessage
                                                                component="div"
                                                                name="top_data_order"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>

                                                        <div className="form-group col-md-4 col-lg-4 ">
                                                            <label htmlFor="remarks">Remark</label>
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
                                                    <div className="row justify-content-center">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary btn-block w-25"
                                                            disabled={this.state.isSubmitting || isSubmitting}
                                                        >
                                                            {this.state.isSubmitting || isSubmitting ? "Please wait..." : "Update"}

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
    websiteRecordReducer,
    loginReducer
}) => ({
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord,
    shopperRecord: websiteRecordReducer.shopperRecord,
    isLoggedin: loginReducer.isLoggedin
});

export default connect(mapStateToProps, {
    websiteRecordAction,
    onPressSideMenuTab,
    onLoggedin
})(EditScreenshotModal);