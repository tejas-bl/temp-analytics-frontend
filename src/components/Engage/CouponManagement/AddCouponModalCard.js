import React from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TimezoneSelect, clientTz } from 'timezone-select-js';

import {
    onPressSecuritySystem,
    onPressMainGate,
    onPressSwitchBordButton,
    onPressOutSwitchBordButton,
    onPressAppliencesSwitchBordButton,
    onPressSwitchBordDropDown,
    onPressOutdoorDropDown,
    onPressSwithOnAllOut,
    onPressAllOffLightOut,
    onPressSwithOnAllIn,
    onPressAllOffLightIn,
    websiteRecordAction
} from "../../../actions";


import popup from '../../../CouponTemplateFiles/tulapop.js';
import { addPersonaPromoCode, addPromoCodeData } from "../../../api/Engage/PromoCode";
import DatePickerField from "../../Dashboard/DatePickerField";
import DynamicCheckboxField from "../../Dashboard/DynamicCheckboxField";
import { addEngagePersonaPromoCode, addEngagePromoCodeData } from "../../../api/Engage/OldDB";
import loadCouponTemplate, { getCurrentUser } from "../../../helper/Utils";
import TimezoneField from "../../Dashboard/TimezoneField";

class AddCouponModalCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personaData: {},
            pdIsLoading: true,
            formField: { offer_heading: "Offer Heading", offer_sub_heading: "Offer Subheading", code: "Code" },
            showCouponBox: false,
            offer_heading: "",
            offer_sub_heading: "",
            personaErrorMessage: "",
            siteCouponData: null,
            siteCouponDataLoading: true,
            couponTemplateLoading: true,
            couponTemplateData: null,
            couponTemplateDataLoading: true,
            couponIdCheckDuplicate: [],
            selectedTimezone: clientTz(),
            shoppersSelected: []
        }
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    addScriptTag = () => {

        let addedCoupon = this.state.couponTemplateData;
        addedCoupon[addedCoupon.length - 1] = {
            l: this.state.formField.offer_heading,
            e: this.state.formField.offer_sub_heading,
            c: this.state.formField.code,
            couponId: null,
            id: null,
        }
        window['createTemplate'](this.state.couponTemplateData, this.props.sessionClient.web_logo);
    }
    onFieldChange(e) {
        this.setState({
            formField: { ...this.state.formField, [e.target.name]: e.target.value }
        })
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.personaData !== prevProps.personaData) {
            this.setState({
                couponTemplateLoading: true,
            })
            if (this.props.sessionClient.coupon_template !== null && this.props.sessionClient.coupon_template !== undefined) {

                loadCouponTemplate(() => {
                    this.setState({
                        couponTemplateLoading: false,
                        couponTemplateDataLoading: false
                    })
                }, this.props.sessionClient.coupon_template/* 'http://debuficgraftb.cloudfront.net/analytics/js/engage_modules/cariumapop.js' *//* this.props.sessionClient.coupon_template */)
            } else {
                loadCouponTemplate(() => {
                    this.setState({
                        couponTemplateLoading: false,
                    })

                }, 'https://debuficgraftb.cloudfront.net/analytics/js/engage_modules/coupon_template/defaultpop.js')
            }

            this.setState({
                pdIsLoading: false,
                personaData: this.props.personaData,
            })
        }
        if (this.props.couponData !== prevProps.couponData) {

            if (this.props.couponData !== false && this.props.couponData !== undefined && this.props.couponData !== null) {

                let couponTemplateData = [];
                let siteCouponData = [];
                this.props.couponData.map((d, i, allData) => {

                    siteCouponData.push({
                        l: d.offer_heading,
                        e: d.offer_sub_heading,
                        c: d.code,
                        couponId: d.id,
                        id: d.persona_id
                    })
                })

                couponTemplateData.push({
                    l: "",
                    e: "",
                    c: "",
                    couponId: null,
                    id: null
                })
                this.setState({
                    siteCouponData: siteCouponData,
                    siteCouponDataLoading: false,
                    couponTemplateData: couponTemplateData,
                    couponTemplateDataLoading: false,
                })

            } else {

                let couponTemplateData = [];
                let siteCouponData = [];
                couponTemplateData.push({
                    l: "",
                    e: "",
                    c: "",
                    couponId: null,
                    id: null
                })

                this.setState({
                    siteCouponData: siteCouponData,
                    siteCouponDataLoading: false,
                    couponTemplateData: couponTemplateData,
                    couponTemplateDataLoading: false,
                })
            }
        }
        if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
            this.setState({
                couponTemplateLoading: true,
            })
            if (this.props.sessionClient.coupon_template !== null && this.props.sessionClient.coupon_template !== undefined) {

                loadCouponTemplate(() => {
                    this.setState({
                        couponTemplateLoading: false,
                    })
                }, this.props.sessionClient.coupon_template)//this.props.sessionClient.coupon_template/* 'http://debuficgraftb.cloudfront.net/analytics/js/engage_modules/cariumapop.js' *//* this.props.sessionClient.coupon_template */)

            } else {
                loadCouponTemplate(() => {
                    this.setState({
                        couponTemplateLoading: false,
                        couponTemplateDataLoading: false
                    })
                }, 'https://debuficgraftb.cloudfront.net/analytics/js/engage_modules/coupon_template/defaultpop.js')
            }
        }
        if (this.props.show === true && !this.state.couponTemplateDataLoading) {
            this.addScriptTag();
        }
    }

    onCloseModal() {
        this.setState({
            formField: {
                offer_heading: "Offer Heading",
                offer_sub_heading: "Offer Subheading",
                code: "Code"
            }
        })
        this.props.onClose();
    }

    render() {
        const { title, onClose, size, show } = this.props;
        const checkboxField = [];
        if (!this.state.pdIsLoading && this.state.personaData !== null && this.state.personaData !== undefined) {
            console.log("this.state.personaData ---", this.state.personaData)
            for (let [key, value] of Object.entries(this.state.personaData)) {
                checkboxField.push(
                    <Field
                        key={value.id}
                        // name={`${item.id}[${index}]`}
                        name="persona"
                        label={`${value.name}`}
                        component={DynamicCheckboxField}
                        handleCheckbox={(personaId, checked, checkedPersonaArray) => {
                            let couponCodeCheckDuplicate = this.state.couponIdCheckDuplicate;
                            let addedCheckedCoupons = [];
                            if (checked) {
                                if (!this.state.siteCouponDataLoading) {
                                    let siteCouponData = this.state.siteCouponData;
                                    siteCouponData.map((siteCoupon, sci) => {
                                        let sitePersonaIdArray = siteCoupon.id !== null && siteCoupon.id.split(",");
                                        sitePersonaIdArray.map((sitePersonaId) => {
                                            if (couponCodeCheckDuplicate.includes(siteCoupon.c)) {
                                                return false
                                            } else if (parseInt(sitePersonaId) === parseInt(personaId) && !couponCodeCheckDuplicate.includes(siteCoupon.c)) {
                                                addedCheckedCoupons.unshift(siteCoupon)
                                                couponCodeCheckDuplicate.unshift(siteCoupon.c)
                                                return true;
                                            }
                                        })

                                    })
                                    this.setState(prevState => ({
                                        couponTemplateData: [...addedCheckedCoupons, ...this.state.couponTemplateData],
                                        couponIdCheckDuplicate: couponCodeCheckDuplicate,
                                        shoppersSelected: [...prevState.shoppersSelected, value.name]
                                    }))

                                }
                            } else {
                                var uncheckedData = this.state.couponTemplateData;
                                let uncheckedRemoved = [];
                                let couponCodeCheckDuplicate = this.state.couponIdCheckDuplicate;
                                let filteredObj = [];
                                let checkSitePersonaIdDup = [];
                                let personaWithSameCouponPresent = null;
                                uncheckedRemoved = uncheckedData.filter(function (obj) {
                                    let sitePersonaIdArray = obj.id !== null && obj.id.split(",");
                                    personaWithSameCouponPresent = checkedPersonaArray.some(r => {
                                        if (sitePersonaIdArray && sitePersonaIdArray.includes(r)) {
                                            return true
                                        }
                                    })

                                    if (obj.id === null || personaWithSameCouponPresent) {
                                        filteredObj.push(obj)
                                        return;
                                    }

                                    for (let id = 0; id < sitePersonaIdArray.length; id++) {
                                        if (checkSitePersonaIdDup.includes(parseInt(sitePersonaIdArray[id])) && checkSitePersonaIdDup.includes(obj.c)) {
                                            continue;
                                        };
                                        if (couponCodeCheckDuplicate.includes(obj.c) && sitePersonaIdArray.includes(personaId)) {
                                            checkSitePersonaIdDup.push(parseInt(sitePersonaIdArray[id]))
                                            checkSitePersonaIdDup.push(obj.c)
                                            couponCodeCheckDuplicate = couponCodeCheckDuplicate.filter(code => code !== obj.c);
                                        } else {
                                            if (!checkSitePersonaIdDup.includes(obj.c)) {
                                                const checkCoupon = objChk => objChk.c === obj.c;
                                                if (!filteredObj.some(checkCoupon)) {
                                                    filteredObj.push(obj);
                                                }
                                            }
                                        }
                                    }

                                    return filteredObj;
                                })

                                this.setState(prevState => ({
                                    couponTemplateData: filteredObj,
                                    couponIdCheckDuplicate: couponCodeCheckDuplicate,
                                    shoppersSelected: prevState.shoppersSelected.filter(item => item !== value.name)
                                }))

                            }
                        }}
                        entryIndex={key}
                        personaId={`${value.id}`}
                    />
                );
            }
        }
        return (
            <Modal size={size} show={show} onHide={this.onCloseModal} className="addCouponModal">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="d-flex flex-row justify-content-between flex-wrap">

                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="">
                                <div className="body" id="addCouponBody">

                                    <Formik
                                        validate={(values) => {
                                            let errors = {};
                                            if (values.offer_heading === "") {
                                                errors.offer_heading = "offer_heading is required";
                                            }
                                            if (values.offer_sub_heading === "") {
                                                errors.offer_sub_heading = "offer_sub_heading is required";
                                            }

                                            if (values.code === "") {
                                                errors.code = "code is required";
                                            }
                                            if (values.valid_from === "") {
                                                errors.valid_from = "valid_from is required";
                                            }

                                            if (values.valid_to === "") {
                                                errors.valid_to = "valid_to is required";
                                            }
                                            if (!values.persona.length) {
                                                this.setState({
                                                    personaErrorMessage: <span style={{ color: "#ff8787", fontSize: "10px" }}>Please select atleast one persona</span>
                                                });
                                                errors.persona = "";
                                            } else {
                                                this.setState({
                                                    personaErrorMessage: ""
                                                });
                                            }

                                            return errors;
                                        }}
                                        initialValues={{ offer_heading: "", offer_sub_heading: "", code: "", site_name: this.props.sessionClient.web_url, site_id: this.props.sessionClient.web_id, valid_from: "", valid_from_timezone: "", valid_to: "", valid_to_timezone: "", status: "", is_active: false, remarks: "", persona: [] }}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            const currentUser = getCurrentUser();
                                            const headerConfigPassed = {
                                                headers: {
                                                    Authorization: currentUser && currentUser.hasOwnProperty('data') && `Bearer ${currentUser.data.data.refresh_token}`,
                                                }
                                            }
                                            values = { ...values, ...currentUser.data.data, shoppersSelected: this.state.shoppersSelected }
                                            const promoCodeDataResult = await addEngagePromoCodeData(values, headerConfigPassed);
                                            if (promoCodeDataResult.statuscode === 200) {
                                                values.persona.map(async (data) => {
                                                    await addEngagePersonaPromoCode({
                                                        persona_id: parseInt(data),
                                                        site_id: parseInt(values.site_id),
                                                        promo_code_id: parseInt(promoCodeDataResult.data[0].id),
                                                        created_on: new Date()
                                                    }, headerConfigPassed)
                                                });
                                            } else {
                                                console.log("promocodeDataResult Error", promoCodeDataResult)
                                            }
                                            this.props.onClose(true);
                                            setSubmitting(false);
                                        }}
                                    >
                                        {({ touched, errors, isSubmitting, setFieldValue }) => (
                                            <Form>
                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="offer_heading">Heading</label>
                                                        <Field
                                                            type="text"
                                                            name="offer_heading"
                                                            placeholder="Enter Heading"
                                                            onChange={(e) => {
                                                                setFieldValue(e.target.name, e.target.value)
                                                                this.onFieldChange(e);
                                                            }}
                                                            className={`form-control ${touched.offer_heading && errors.offer_heading ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="offer_heading"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="offer_sub_heading">Sub Heading</label>
                                                        <Field
                                                            type="text"
                                                            name="offer_sub_heading"
                                                            placeholder="Enter Sub Heading"
                                                            onChange={(e) => {
                                                                setFieldValue(e.target.name, e.target.value)
                                                                this.onFieldChange(e);
                                                            }}
                                                            className={`form-control ${touched.offer_sub_heading && errors.offer_sub_heading ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="offer_sub_heading"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="code">Code</label>
                                                        <Field
                                                            type="text"
                                                            name="code"
                                                            placeholder="Enter Code"
                                                            onChange={(e) => {
                                                                setFieldValue(e.target.name, e.target.value)
                                                                this.onFieldChange(e);
                                                            }}
                                                            className={`form-control ${touched.code && errors.code ? "is-invalid" : ""
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="code"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6 col-lg-6">
                                                        <label htmlFor="is_active">Is Active</label>
                                                        <div className=" m-checkbox m-checkbox--switch">
                                                            <Field type="checkbox" className="m-checkbox__input m-checkbox--switch__input" name="is_active" />
                                                        </div>
                                                        <ErrorMessage
                                                            component="div"
                                                            name="is_active"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 col-lg-6">
                                                        <div className="row">
                                                            <div className="form-group col-md-7 col-lg-7 pr-0">
                                                                <label htmlFor="valid_from">Valid From</label>
                                                                <DatePickerField name="valid_from" className={`${touched.valid_from && errors.valid_from ? "is-invalid" : ""}`} />
                                                                <ErrorMessage
                                                                    component="div"
                                                                    name="valid_from"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>

                                                            <div className="form-group col-md-5 col-lg-5">
                                                                <label htmlFor="valid_from_timezone" className="timezoneLabel"> </label>

                                                                <TimezoneField name="valid_from_timezone" />
                                                                <ErrorMessage
                                                                    component="div"
                                                                    name="valid_from_timezone"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="col-md-6 col-lg-6">
                                                        <div className="row">

                                                            <div className="form-group col-md-7 col-lg-7 pr-0">
                                                                <label htmlFor="valid_to">Valid To</label>
                                                                <DatePickerField name="valid_to" className={`${touched.valid_to && errors.valid_to ? "is-invalid" : ""}`} />
                                                                <ErrorMessage
                                                                    component="div"
                                                                    name="valid_to"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-5 col-lg-5">
                                                                <label htmlFor="valid_to_timezone" className="timezoneLabel"> </label>

                                                                <TimezoneField name="valid_to_timezone" />
                                                                <ErrorMessage
                                                                    component="div"
                                                                    name="valid_to_timezone"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="row">
                                                    {/*                                                 <div className="form-group col-md-6 col-lg-6">
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
 */}


                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="remarks">Remarks</label>
                                                    <Field
                                                        type="text"
                                                        name="remarks"
                                                        placeholder="Enter Remarks"
                                                        className={`form-control ${touched.remarks && errors.remarks ? "is-invalid" : ""
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="remarks"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="persona-group">Personas Applicable to</label>
                                                    <div role="group" className="row" aria-labelledby="persona-group">
                                                        {checkboxField}
                                                        <div className="pl-2"><span>{this.state.personaErrorMessage}</span></div>
                                                    </div></div>

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


                                    <div className="row mt-3 coupon_box_row">

                                        <div className={'coupon_box'}>
                                            {/* 
                                            <div className="col-md-12 col-lg-12 text-center">
                                                <div className="header pb-0 pt-2">
                                                    <Button className={'show_preview_btn'} onClick={() => {

                                                        if (this.props.sessionClient.coupon_template === null || this.props.sessionClient.coupon_template === undefined) {
                                                            this.setState({
                                                                showCouponBox: !this.state.showCouponBox
                                                            })
                                                        } else {
                                                            this.addScriptTag();
                                                        }

                                                    }} >Show CouponBox Preview</Button>
                                                </div>
                                            </div> */}
                                            {/* <div className={`body pb-0 cardScrollBar m-r-5 clearfix`} style={{ height: "320px", overflow: "hidden" }}>
                                                <div className="coupon_preview_card shadowBoxWithMargin">
                                                    <div className="row">
                                                        <div className="col-md-12 col-lg-12 coupon_preview_img_div">
                                                            <img className={"coupon_preview_img"} src={this.props.sessionClient.web_logo} width={"130px"} height={"auto"} alt={this.props.sessionClient.web_id} />
                                                        </div>
                                                        <div className="col-md-12 col-lg-12">
                                                            <div className="header pb-0 pt-1">
                                                                <p><strong>We're making it easy for you to save!</strong> Just click the 'Apply' button below and the promo code will be applied automatically</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-5 col-lg-5">
                                                            <div className="header">
                                                                <h6 className="pb-0">{this.state.formField.offer_heading}</h6>
                                                                <p>
                                                                    {this.state.formField.offer_sub_heading}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 col-lg-3">
                                                            <div className="header">
                                                                <h6 className="pb-0">{this.state.formField.code}</h6>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 col-lg-3">
                                                            <div className="header">
                                                                <Button className="btn-info">Apply</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 couponPreviewBox">
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}


const mapStateToProps = ({ ioTReducer, websiteRecordReducer }) => ({
    isSecuritySystem: ioTReducer.isSecuritySystem,
    isMaingate: ioTReducer.isMaingate,
    switchBoardSwitch: ioTReducer.switchBoardSwitch,
    switchOutBoardSwitch: ioTReducer.switchOutBoardSwitch,
    switchAppliencesBoardSwitch: ioTReducer.switchAppliencesBoardSwitch,
    isIndoorDropdown: ioTReducer.isIndoorDropdown,
    isOutdoorDropdown: ioTReducer.isOutdoorDropdown,
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord
});

export default connect(mapStateToProps, {
    onPressSecuritySystem,
    onPressMainGate,
    onPressSwitchBordButton,
    onPressOutSwitchBordButton,
    onPressAppliencesSwitchBordButton,
    onPressSwitchBordDropDown,
    onPressOutdoorDropDown,
    onPressSwithOnAllOut,
    onPressAllOffLightOut,
    onPressSwithOnAllIn,
    onPressAllOffLightIn,
    websiteRecordAction
})(AddCouponModalCard);

