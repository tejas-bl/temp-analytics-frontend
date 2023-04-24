import React from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { connect } from "react-redux";
import { addEngagePersonaCouponSettings , updateEngagePersonaCouponSettings } from '../../../api/Engage/OldDB';
import { getCurrentUser } from '../../../helper/Utils';
import { websiteRecordAction } from "../../../actions";
class PersonaSettingCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingValue:this.props.promoCodeValue,
            messageOptions: {
                options: [
                    "Oops! Looks like your code didn't work.",
                    "Holllyyy Sh##T! Not Working",
                    "Doesn't seems to Work for us! Try Other Coupon Code",
                    `${this.props.shopperRecord.wc} Code`
                ]
            },
            promoCodeEditable: true,
            buttonText: "Edit",
            engagePersonaMessages: this.props.engagePersonaMessages
        }
        this.promoCodeBtn = this.promoCodeBtn.bind(this);
        this.onPressTagDropdown = this.onPressTagDropdown.bind(this);
    }

    async promoCodeBtn() {
        if (this.state.editPromoCode === true) {
            const isFound = this.state.engagePersonaMessages.some(element => {
                if (element.coupon_message === this.state.editingValue) {
                    return true;
                }
                return false;
            });
            let headerConfigPassed = {
                headers: {
                    Authorization: getCurrentUser() &&
                        getCurrentUser().hasOwnProperty('data') &&
                        `Bearer ${getCurrentUser().data.data.refresh_token}`
                }
            }
            if (!isFound) {
                const createData = {
                    site_id: this.props.siteId,
                    persona_id: this.props.personaId,
                    coupon_message: this.state.editingValue,
                    status: true,
                };
                await addEngagePersonaCouponSettings(createData, headerConfigPassed);
                this.props.handleMessageChange();
            } else {
                const selectedMessage = this.state.engagePersonaMessages.filter((e) => {
                    return e.coupon_message === this.state.editingValue;
                });
                const {site_id , persona_id , id} = selectedMessage[0];
                await updateEngagePersonaCouponSettings({site_id,persona_id,id}, headerConfigPassed);
                this.props.handleMessageChange();
            }
        }
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

    componentDidUpdate(prevProps) {
        if(this.props.promoCodeValue !== prevProps.promoCodeValue) {
            this.setState({
                editingValue: this.props.promoCodeValue
            });
        }
        if(this.props.engagePersonaMessages !== prevProps.engagePersonaMessages) {
            this.setState({
                engagePersonaMessages:this.props.engagePersonaMessages
            })
        }
    }

    componentDidMount() {
        this.setState({
            editingValue: this.getActiveMessage()
        });
    }

    getActiveMessage() {
        let messageArray = [];
        this.props.engagePersonaMessages.filter((e) => {
            if(e.status === true) {
              return messageArray.push(e.coupon_message)
            }else{
                return null
            }
        });
        return messageArray;
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
            <div className={`card settingModuleCard`}>
                <div className="header pb-0">
                    <h2 className="pb-0">Message Settings</h2>
                </div>
                <div className="body" style={{padding:"0px"}}>
                    <div key="messageSettingdrpdown">
                        {/* <ModalImage small={couponImage} medium={couponImage} hideDownload={true} hideZoom={true} alt={"Persona Promobox"}/> */}
                        <div className="col-md-12 col-lg-12 pl-0 pr-0 mt-4">
                        {this.state.engagePersonaMessages.length > 0 ?
                            <p className="default-message">Choose from the default options available</p> : <p className="default-message">No Coupon Messages Found, Please Add One</p>
                        }
                            {this.state.engagePersonaMessages && this.state.engagePersonaMessages.length > 0 &&
                                <DropdownButton
                                className="col-md-12 col-lg-12 p-0 mb-3"
                                title={this.state.editingValue}
                                id="messageOptionsDropdown"
                                onSelect={(e) => { this.onPressTagDropdown(e) }}>
                                {
                                    this.state.engagePersonaMessages.map((option, i) => {
                                        return (<div key={`promo_option_div_${i}`}>
                                            <Dropdown.Item key={`promo_option_${i}`} eventKey={option.coupon_message}>{option.coupon_message}</Dropdown.Item>
                                        </div>)
                                    })
                                }
                            </DropdownButton>
                            }
                        </div>
                        <div className="message-div col-md-12 col-lg-12 pl-0 pr-0 mt-4 d-flex justify-content-center align-items-center">
                            <textarea className={this.state.promoCodeEditable ? "promoCodeInputNonEditable" : "promoCodeInputEditable"}
                                style={{ width: "76%" }}
                                disabled={this.state.promoCodeEditable}
                                value={this.state.editingValue}
                                onChange={(e) => { onChange(e) }}
                                onKeyDown={(e) => { onKeyDown(e) }}
                                onBlur={(e) => onBlur(e)}
                                placeholder="Click edit to enable the textbox"
                            />
                            <Button style={{ width: "20%", padding: "10px 6px", fontSize: "12px" }} onClick={() => this.promoCodeBtn()} className="badge btn-info">
                                <i className="fa fa-pencil"></i> {this.state.promoCodeEditable ? "Edit" : "Save"}
                            </Button>
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
    shopperRecord: websiteRecordReducer.shopperRecord
});

export default connect(mapStateToProps, {
    websiteRecordAction
})(PersonaSettingCard);
