import React from "react";
import { connect } from "react-redux";
import * as echarts from "echarts";
import couponImage from '../../assets/images/engage/persona/315_wc_gif.gif'
import { groupSplitPiechart } from "../../Data/EngagePersonaData";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import loadCouponTemplate, { formatDate, getCurrentUser } from "../../helper/Utils";
import EditCouponModalCard from "./CouponManagement/EditCouponModalCard";
import {
    websiteRecordAction
} from "../../actions";
import { getPersonaPromoCode } from "../../api/Engage/PromoCode";
import { getEngagePersona } from "../../api/Engage/OldDB";
import ModalImage from "react-modal-image";

class PromoCode extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editingValue: this.props.promoCodeValue,
            messageOptions: {
                options: [
                    "Oops! Looks like your code didn't work.",
                    "Holllyyy Sh##T! Not Working",
                    "Doesn't seems to Work for us! Try Other Coupon Code",
                    `${this.props.shopperRecord.wc} Code`
                ]
            },
            promoCodeEditable: true,
            buttonText: "Edit"
        }
        this.promoCodeBtn = this.promoCodeBtn.bind(this);
        this.onPressTagDropdown = this.onPressTagDropdown.bind(this);
    }

    promoCodeBtn() {
        this.setState({
            promoCodeEditable: !this.state.promoCodeEditable,
            editPromoCode: !this.state.editPromoCode
        })
    }
    onPressTagDropdown(value) {
        this.setState({
            editingValue: value
        })
        this.props.handlePromoCode(value)
    }
    render() {
        const onChange = (e) => {

            this.setState({
                editingValue: e.target.value,
                buttonText: "Save"

            })
        }

        const onKeyDown = (event) => {
            if (event.key === "Enter" || event.key === "Escape") {
                event.target.blur();
            }
        }

        const onBlur = (e) => {
            if (e.target.value.trim() === "") {
                this.setState({
                    editingValue: this.props.promoCodeValue,
                    promoCodeEditable: false
                })
            } else {
                this.props.handlePromoCode(e.target.value)
            }
        }

        return (

            /* Add A Dropdown Here for default options */
            <div key="messageSettingdrpdown">
                <div className="col-md-12 col-lg-12 pl-0 pr-0 mt-4">
                    <h5 className="headingStyle1"> Message Settings</h5>
                    <DropdownButton
                        className="promocodeOptionsDropdownDiv col-md-12 col-lg-12 p-0 mb-3"
                        title="Choose from Default Options"
                        id="promocodeOptionsDropdown"
                        onSelect={(e) => { this.onPressTagDropdown(e) }}
                    >

                        {
                            this.state.messageOptions.options.map((option, i) => {
                                return (<div key={`promo_option_div_${i}`}>
                                    <Dropdown.Item key={`promo_option_${i}`} eventKey={option}>{option}</Dropdown.Item>
                                </div>)
                            })
                        }

                    </DropdownButton>


                </div>
                <div className="col-md-12 col-lg-12 pl-0 pr-0 mt-4 d-flex justify-content-center align-items-center">
                    <textarea
                        className={this.state.promoCodeEditable ? "promoCodeInputNonEditable" : "promoCodeInputEditable"}
                        style={{ width: "76%" }}
                        disabled={this.state.promoCodeEditable}
                        value={this.state.editingValue}
                        onChange={(e) => { onChange(e) }}
                        onKeyDown={(e) => { onKeyDown(e) }}
                        onBlur={(e) => onBlur(e)
                        }
                    />
                    <Button style={{ width: "20%", padding: "10px 6px", fontSize: "12px" }} onClick={() => this.promoCodeBtn()} className="badge btn-info">
                        <i className="fa fa-pencil"></i> {this.state.promoCodeEditable ? "Edit" : "Save"}
                    </Button>
                </div>
            </div>
        )
    }
}
class PersonaSettingsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promoCode: "Oops! Looks like your code didn't work.",
            editPromoCode: true,
            showEditCouponModal: false,
            loadingModal: false,
            loadingModalId: null,
            couponData: {},
            personaData: {},
            personaId: {},
            personaIdIsLoading: true,
            personaKeyValue: {},
            personaIsLoading: true,
            personaKeyValueIsLoading: true,
            loadingMessage: ""
        }
        this.handlePromoCodeChange = this.handlePromoCodeChange.bind(this)
        this.onClickEditCouponModal = this.onClickEditCouponModal.bind(this)
    }

    handlePromoCodeChange(value) {
        this.setState({
            promoCode: value
        })
    }


    componentDidMount() {

        if (this.props.sessionClient.coupon_template !== null && this.props.sessionClient.coupon_template !== undefined) {

            loadCouponTemplate(() => {
            }, this.props.sessionClient.coupon_template/* 'http://debuficgraftb.cloudfront.net/analytics/js/engage_modules/cariumapop.js' *//* this.props.sessionClient.coupon_template */)
        } else {
            loadCouponTemplate(() => {

            }, 'https://debuficgraftb.cloudfront.net/analytics/js/engage_modules/coupon_template/defaultpop.js')
        }

        this.chartPlace();
        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }
        getEngagePersona(headerConfigPassed)
            .then(res => {
                this.setState({
                    personaIsLoading: false,
                    personaData: res.data
                })
            })
            .catch(err => {
                console.log(err);
            })
    }


    async onClickEditCouponModal(coupon, rowId) {


        this.setState({
            loadingModal: coupon !== undefined && true,
            loadingModalId: coupon !== undefined && rowId
        })
        // const compareSiteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.compareStartDate), endDate: convertDateTOLocale(this.state.compareEndDate) };
        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }

        if (coupon === true) {
            this.setState({
                showEditCouponModal: !this.state.showEditCouponModal,
                loadingModal: false,
                loadingModalId: null
            })
            this.props.renderPromoCode(this.state.promoCodeId);
        } else {

            if (!this.state.showEditCouponModal) {
                const siteInputs = { siteIdInput: this.props.sessionClient.web_id, promoCodeId: coupon.id };
                /*         console.log("COUPON DATAD --- ", coupon); */
                await getPersonaPromoCode(siteInputs, headerConfigPassed).then(res => {
                    let personaIdArray = [];
                    res.data.map((data) => {
                        return personaIdArray.push(data.persona_id.toString());
                    })
                    this.setState({
                        couponData: coupon,
                        personaKeyValueIsLoading: false,
                        personaIdIsLoading: false,
                        personaId: personaIdArray,
                        personaKeyValue: res.data,
                        showEditCouponModal: !this.state.showEditCouponModal,
                        loadingModal: false,
                        loadingModalId: null
                    });
                });
            } else {
                this.setState({
                    showEditCouponModal: !this.state.showEditCouponModal,
                    loadingModal: false,
                    loadingModalId: null
                })
            }
        }

    }


    chartPlace = () => {
        var chartDom = document.getElementById("PieChart");
        var myChart = echarts.init(chartDom);
        var option;
        option = groupSplitPiechart;

        option && myChart.setOption(option);
    };

    render() {
        const promoCodePersonas = !this.state.personaKeyValueIsLoading && this.state.personaKeyValue;
        const personaData = !this.state.personaIsLoading && this.state.personaData;
        const personaId = !this.state.personaIdIsLoading && this.state.personaId;

        return (
            <div className="col-lg-12 col-md-12 p-0">
                <div className="card d-flex flex-row flex-wrap pt-3 pb-3">
                    {/*                   <div className="col-lg-12 col-md-12">
                        <div className="header pb-0">
                            <h4>
                                Settings
                            </h4>
                        </div>
                    </div> */}
                    <div className="col-lg-4 col-md-4 col-sm-12 pl-5 mt-5 d-none">
                        <ModalImage
                            small={couponImage}
                            medium={couponImage}
                            hideDownload={true}
                            hideZoom={true}
                            alt={"Persona Promobox"}
                        />
                        {/* <img src={couponImage} style={{ height: 150, width: "100%" }} /> */}
                        <div id="PieChart" style={{ height: 0, paddingBottom: "0px", marginTop: "0px" }}></div>
                        {/* <h6>Group Split</h6> */}
                        <hr />
                        {/* <p>Just click the 'Apply' button below and the promo code will be applied automatically.</p> */}
                        <PromoCode shopperRecord={this.props.shopperRecord} promoCodeValue={this.state.promoCode} handlePromoCode={this.handlePromoCodeChange} />

                        {/*                 
                            <h6 className="mb-3 mt-4">Module Permission</h6>
                            <div className="fancy-checkbox">
                                            <label>
                                            <input type="checkbox" />
                                            <span>Order Value Restrictions</span>
                                            </label>
                            </div>
                            <div className="fancy-checkbox">
                                            <label>
                                            <input type="checkbox" />
                                            <span>Autocorrect</span>
                                            </label>
                            </div> */}
                    </div>
                    <div className="col-lg-12 col-md-12">
                        <div className="col-lg-12 col-md-12">
                            <div className="header pb-0">
                                <h2 className="pb-0">
                                    Coupons
                                </h2>
                            </div>
                        </div>
                        <div className="body table-responsive">
                            {this.props.data !== undefined && this.props.data.length > 0 ? <table className="table table-striped">
                                <thead>
                                    <tr>
                                        {/* <th>Activate Coupon</th> */}
                                        <th>Coupon</th>
                                        <th>Description</th>
                                        <th>Code</th>
                                        <th>Expiry Date</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.data.map((data, i) => {
                                        return (
                                            <tr key={`persona_settings_card_${i}`}>
                                                {/* <td scope="row" className="text-center">
                                                    <div className="fancy-checkbox">
                                                        <label>
                                                            <input type="checkbox" />
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                </td> */}
                                                <td>{data.offer_heading}</td>
                                                <td>{data.offer_sub_heading}</td>
                                                <td>{data.code}</td>
                                                <td>{data.valid_to !== null ? formatDate(data.valid_to) : ""}</td>
                                                <td onClick={(e) => this.onClickEditCouponModal(data, i)}>
                                                    {this.state.loadingModal === true && this.state.loadingModalId === i ?
                                                        <i className="fa fa-spinner fa-spin text-info"></i>
                                                        : <i className="fa fa-pencil"></i>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                                :

                                <div className="row no_data_row p-2">
                                    <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                        <h3 className="badge no_data_available">Not editable until persona is live</h3>
                                        <table className="table table-striped noDataAvailable"><thead><tr><th>Coupon</th><th>Description</th><th>Code</th><th>Expiry Date</th><th>Edit</th></tr></thead><tbody>

                                            <tr><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td><i className="fa fa-pencil"></i></td></tr>

                                            <tr><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td><i className="fa fa-pencil"></i></td></tr><tr><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td><i className="fa fa-pencil"></i></td></tr></tbody></table>
                                    </div>
                                </div>
                            }
                            {/* <div className="row no_data_row" style={{marginTop: "-30px"}}>
                            <h3 className="badge no_data_available">No Data Available</h3>
                            <img src={no_data_available} width="auto" height="300px" alt="No data available" />
                          </div> */}
                        </div>
                    </div>
                </div>

                <EditCouponModalCard
                    key={"edit_coupon_1"}
                    size={"lg"}
                    title={"Edit Coupon"}
                    data={this.state.couponData}
                    couponData={[this.state.couponData]}
                    promoCodePersonas={promoCodePersonas}
                    personaData={personaData}
                    personaId={personaId}
                    show={this.state.showEditCouponModal}
                    onClose={(flag) => this.onClickEditCouponModal(flag)}
                />


            </div>
        );
    }
}

const mapStateToProps = ({ websiteRecordReducer }) => ({
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord,
    shopperRecord: websiteRecordReducer.shopperRecord
});

export default connect(mapStateToProps, {
    websiteRecordAction
})(PersonaSettingsCard);
