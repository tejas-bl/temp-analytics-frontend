import React from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { findTzByKey } from 'timezone-select-js';
import {
    onPressSecuritySystem,
    onPressMainGate,
    onPressSwitchBordButton,
    onPressOutSwitchBordButton,
    onCouponPersonaLoad,
    onPressSwitchBordDropDown,
    onPressOutdoorDropDown,
    onPressSwithOnAllOut,
    onPressAllOffLightOut,
    onPressSwithOnAllIn,
    onPressAllOffLightIn,
    websiteRecordAction
} from "../../../actions";

import DatePickerField from "../../Dashboard/DatePickerField";
import DynamicCheckboxField from "../../Dashboard/DynamicCheckboxField";
import { addEngagePersonaPromoCode, deleteEngagePersonaPromoCode, deleteEngageSitePersonaPromoCode, updateEngagePromoCodeData } from "../../../api/Engage/OldDB";
import { formatDate, getCurrentUser } from "../../../helper/Utils";
import TimezoneField from "../../Dashboard/TimezoneField";

class EditCouponModalCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personaData: {},
            pdIsLoading: true,
            checkedPersona: {},
            checkedPersonaIsLoading: true,
            promoCodePersonas: [],
            checkBoxField: [],
            formField: {
                l: "",
                e: "",
                c: "",
                id: null
            },
            showCouponBox: false,
            siteCouponData: null,
            siteCouponDataLoading: true,
            couponTemplateLoading: true,
            personaErrorMessage: "",
            couponTemplateData: null,
            couponIdCheckDuplicate: [],
            shoppersSelected: []

        }
        this.onFieldChange = this.onFieldChange.bind(this)
    }


    addScriptTag = (couponTemplateLoading) => {
        var data = [...this.state.couponTemplateData];
        var index = data.findIndex(obj => obj.id === this.props.data.id);
        data[index] = {
            l: this.state.formField.offer_heading,
            e: this.state.formField.offer_sub_heading,
            c: this.state.formField.code,
            couponId: null,
            id: null,
        }
        window['createTemplate'](data, this.props.sessionClient.web_logo);
    }

    onFieldChange(e) {
        this.setState({
            formField: { ...this.state.formField, [e.target.name]: e.target.value }
        })
        var data = [...this.state.couponTemplateData];
        var index = data.findIndex(obj => obj.id === this.props.data.id);

        let editableData = { ...this.state.formField, [e.target.name]: e.target.value }
        data[index] = {
            l: editableData.offer_heading,
            e: editableData.offer_sub_heading,
            c: editableData.code,
            id: this.state.formField.id,
            couponId: editableData.id,
            persona_id: editableData.persona_id
        }

        //window['createTemplate'](this.state.couponTemplateData);
        window['createTemplate'](data, this.props.sessionClient.web_logo);
    }

    handleCheckboxUpdate(personaId, checked, checkedPersonaArray, value) {
        let couponCodeCheckDuplicate = this.state.couponIdCheckDuplicate;

        let addedCheckedCoupons = [];
        if (checked) {
            if (!this.state.siteCouponDataLoading) {
                let siteCouponData = this.state.siteCouponData;
                siteCouponData.map((siteCoupon, sci) => {
                    let sitePersonaIdArray = siteCoupon.persona_id !== null && siteCoupon.persona_id.split(",");
                    sitePersonaIdArray && sitePersonaIdArray.map((sitePersonaId) => {
                        if (couponCodeCheckDuplicate.includes(siteCoupon.code)) {
                            return false
                        } else if (parseInt(sitePersonaId) === parseInt(personaId) && !couponCodeCheckDuplicate.includes(siteCoupon.code)) {
                            addedCheckedCoupons.unshift({
                                l: siteCoupon.offer_heading,
                                e: siteCoupon.offer_sub_heading,
                                c: siteCoupon.code,
                                id: siteCoupon.id,
                                couponId: siteCoupon.id,
                                persona_id: siteCoupon.persona_id
                            })
                            couponCodeCheckDuplicate.unshift(siteCoupon.code)
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
                let sitePersonaIdArray = obj.persona_id !== null && obj.persona_id.split(",");

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
    }

    componentDidUpdate(prevProps) {
        const checkBoxFieldArray = [];
        const initialPersonaArray = [];
        const initialShopperNameArray = [];

        /*         if (this.props.show === true) { */
        if (this.props.promoCodePersonas !== prevProps.promoCodePersonas) {
            this.setState({
                checkBoxField: [],
                couponTemplateData: []
            })
            if (this.props.personaData !== false && this.props.personaData !== 0) {
                let couponTemplateData = [];
                let personaIdCheckDuplicate = [];
                let couponIdCheckDuplicate = [];

                for (let [key, value] of Object.entries(this.props.couponData)) {
                    let personaId = value.persona_id !== null && value.persona_id.split(",");
                    if (personaId.length > 0 && personaId !== undefined && personaId !== null) {
                        personaId.map((d) => {
                            if (this.props.promoCodePersonas && this.props.promoCodePersonas.filter(function (e) {
                                if (personaIdCheckDuplicate.includes(value.id)) {
                                    return false;
                                } else if (e.persona_id === parseInt(d)) {
                                    personaIdCheckDuplicate.push(value.id)
                                    return true;
                                }
                            }).length > 0) {

                                couponTemplateData.push({
                                    l: value.offer_heading,
                                    e: value.offer_sub_heading,
                                    c: value.code,
                                    id: value.id,
                                    couponId: value.id,
                                    persona_id: value.persona_id
                                })

                                couponIdCheckDuplicate.push(value.code)
                            }
                        })
                    }
                }
                for (let [key, value] of Object.entries(this.props.personaData)) {
                    if (this.props.promoCodePersonas && this.props.promoCodePersonas.filter(function (e) {
                        return e.persona_id === value.id;
                    }).length > 0) {
                        initialPersonaArray.push(value.id);
                        initialShopperNameArray.push(value.name);
                        checkBoxFieldArray.push(<Field
                            key={value.id}
                            name="persona"
                            label={`${value.name}`}
                            value={`${value.id}`}
                            selected={true}
                            component={DynamicCheckboxField}
                            handleCheckbox={(personaId, checked, checkedPersonaArray) => {
                                this.handleCheckboxUpdate(personaId, checked, checkedPersonaArray, value)
                            }}
                            entryIndex={key}
                            personaId={`${value.id}`}
                        />)
                    } else {
                        checkBoxFieldArray.push(<Field
                            key={value.id}
                            name="persona"
                            label={`${value.name}`}
                            value={`${value.id}`}
                            component={DynamicCheckboxField}
                            handleCheckbox={(personaId, checked, checkedPersonaArray) => {
                                this.handleCheckboxUpdate(personaId, checked, checkedPersonaArray, value)
                            }}
                            entryIndex={key}
                            personaId={`${value.id}`}
                        />)
                    }
                }
                this.setState({
                    checkBoxField: checkBoxFieldArray,
                    promoCodePersonas: initialPersonaArray,
                    checkedPersonaIsLoading: false,
                    couponTemplateData: couponTemplateData,
                    couponTemplateLoading: false,
                    siteCouponData: this.props.couponData,
                    siteCouponDataLoading: false,
                    couponIdCheckDuplicate: couponIdCheckDuplicate,
                    formField: {
                        id: this.props.data.id,
                        offer_heading: this.props.data.offer_heading,
                        offer_sub_heading: this.props.data.offer_sub_heading,
                        code: this.props.data.code,
                        couponId: null,
                        persona_id: null
                    },
                    shoppersSelected: initialShopperNameArray
                })



            }

        }
        //}


        if (this.props.show && !this.state.couponTemplateLoading) {
            var data = [...this.state.couponTemplateData];
            var index = data.findIndex(obj => obj.id === this.props.data.id);
            data[index] = {
                l: this.state.formField.offer_heading,
                e: this.state.formField.offer_sub_heading,
                c: this.state.formField.code,
                couponId: null,
                persona_id: null
            }
            window['createTemplate'](data, this.props.sessionClient.web_logo);
        }

    }


    render() {
        const { onClose, size, show } = this.props;
        return (
            <Modal size={size} show={show} onHide={onClose} className="editCouponModal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Coupon</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="d-flex flex-row justify-content-between flex-wrap">

                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="">
                                <div className="body">
                                    <Formik
                                        enableReinitialize={true}
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

                                        initialValues={{
                                            id: this.props.data.id,
                                            offer_heading: this.props.data.offer_heading,
                                            offer_sub_heading: this.props.data.offer_sub_heading,
                                            code: this.props.data.code,
                                            site_name: this.props.sessionClient.web_url,
                                            site_id: this.props.data.site_id,
                                            valid_from: new Date(this.props.data.valid_from),
                                            valid_to: new Date(this.props.data.valid_to),
                                            valid_from_timezone: findTzByKey(this.props.data.valid_from_tz_name),
                                            valid_to_timezone: findTzByKey(this.props.data.valid_to_tz_name),
                                            status: this.props.data.status,
                                            is_active: this.props.data.is_active,
                                            remarks: this.props.data.remarks,
                                            persona: this.props.personaId,
                                            shoppersSelected: this.state.shoppersSelected
                                        }}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            const currentUser = getCurrentUser();
                                            const headerConfigPassed = {
                                                headers: {
                                                    Authorization: currentUser && currentUser.hasOwnProperty('data') && `Bearer ${currentUser.data.data.refresh_token}`,
                                                }
                                            }
                                            values = { ...values, ...currentUser.data.data, shoppersSelected: this.state.shoppersSelected }

                                            const promoCodeDataResult = await updateEngagePromoCodeData(values, headerConfigPassed);

                                            if (promoCodeDataResult.statuscode === 200) {
                                                await deleteEngageSitePersonaPromoCode({
                                                    "id": values.id,
                                                    "site_id": values.site_id
                                                }, headerConfigPassed);
                                                // loop through persona values
                                                values.persona.map(async (data) => {
                                                    await addEngagePersonaPromoCode({
                                                        persona_id: parseInt(data),
                                                        site_id: parseInt(values.site_id),
                                                        promo_code_id: values.id,
                                                        created_on: new Date()
                                                    }, headerConfigPassed)
                                                })
                                            }

                                            this.props.onClose(true);
                                            setSubmitting(false);
                                        }}
                                    >
                                        {({ touched, errors, isSubmitting, values, setFieldValue }) => (
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

                                                    {/*                                                     <div className="form-group col-md-6 col-lg-6">
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
                                                    </div> */}
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

                                                                <TimezoneField name="valid_from_timezone" currentTz={this.props.data.valid_from_tz_name} />
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

                                                                <TimezoneField name="valid_to_timezone" currentTz={this.props.data.valid_to_tz_name} />
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
                                                    {/*                                                     <div className="form-group col-md-6 col-lg-6">
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


                                                <div className="row">
                                                    <div className="form-group col-md-6 col-lg-6">
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
                                                </div>
                                                <div role="group" className="row mb-3" aria-labelledby="persona-group">
                                                    {this.state.checkBoxField}
                                                    <div className="pl-2"><span>{this.state.personaErrorMessage}</span></div>
                                                </div>
                                                <div className="row justify-content-center">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary w-25"
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

                                            <div className="col-md-12 col-lg-12 text-center">
                                                <div className="header pb-0 pt-2">
                                                    {/*  <Button className={'show_preview_btn'} onClick={() => {

                                                        if (this.props.sessionClient.coupon_template === null || this.props.sessionClient.coupon_template === undefined) {
                                                            this.setState({
                                                                showCouponBox: !this.state.showCouponBox
                                                            })
                                                        } else {
                                                            this.addScriptTag();
                                                        }

                                                    }} >Show CouponBox Preview</Button> */}
                                                </div>
                                            </div>
                                            <div className={`body pb-0 cardScrollBar m-r-5 clearfix ${this.state.showCouponBox ? "" : "d-none"} `} style={{ height: "320px", overflow: "hidden" }}>
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
                                            </div>
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
    onCouponPersonaLoad,
    onPressSwitchBordDropDown,
    onPressOutdoorDropDown,
    onPressSwithOnAllOut,
    onPressAllOffLightOut,
    onPressSwithOnAllIn,
    onPressAllOffLightIn,
    websiteRecordAction
})(EditCouponModalCard);
