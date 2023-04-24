import React from "react";
import ModalImage from "react-modal-image";

class PersonaBriefDetailCard_v2 extends React.Component {
    processSOG() {
        let sogResult = [];
        if (this.props.data.personaSizeOfGroup !== undefined && this.props.data.personaSizeOfGroup !== 0) {
            if (this.props.data.short_code === 'wc' && this.props.data.checkout_of_all_users > 0) {
                sogResult.push(<div className="d-inline" key="sog_wc">
                    {this.props.data.checkout_of_all_users}%
                    <small key="sog_of_all_users_wc"> of all Users (</small>
                    {this.props.data.personaSizeOfGroup}%
                    <small key="sog_checkout_user"> of all Checkout Users)</small></div>)
            } else if (this.props.data.short_code === 'cs' && this.props.data.cs_reduce_cart > 0) {
                sogResult.push(<div className="d-inline" key="sog_cs_shopper">
                    {this.props.data.personaSizeOfGroup}%
                    <small key="sog_users_add_to_cart"> of all Users(</small>
                    {this.props.data.cs_reduce_cart}%
                    <small key="sog_checkout_user_cs"> of Users that add to Cart)</small></div>)
            } else {
                sogResult.push(<div className="d-inline" key="sog_all_users">{this.props.data.personaSizeOfGroup}% <small> of all Users</small></div>)
            }

            if (this.props.data.hasOwnProperty('personaStatus') && !this.props.data.personaStatus && this.props.data.industryBased && this.props.data.industryBased !== null) {
                sogResult.push(<span key="sog_based_on_ind_std" className="text-muted industryAvg"> ( Based on Industry Avg.)</span>)
            }
            return sogResult;
        }
    }
    processUsers() {
        if (!this.props.data.personaStatus &&
            this.props.impactData.users !== undefined &&
            this.props.impactData.users !== 0  && (!this.props.data.industryBased || this.props.data.industryBased === null)) {
            if (this.props.impactData.industryStd) {
                return <>{`${this.props.impactData.users}`}<small> users <span className="text-muted industryAvg">( Based on Industry Avg.)</span> </small> </>
            } else {
                return <>{`${this.props.impactData.users}`}<small> users - </small> </>
            }
        } else {
            return ""
        }
    }
    render() {
        return (
            <div className="card pt-3 pb-4">
                <div className="body pb-0 pt-0 text-center d-flex flex-wrap justify-start">
                    <div className="col-md-2 col-lg-2">

                        <img src={this.props.data.personaImage !== undefined && this.props.data.personaImage}
                            style={{ height: 120, width: "auto" }} />
                    </div>
                    <div className="col-lg-10 col-md-10 text-left pt-o">
                        <h4 className="m-t-0 m-b-1"><strong>{this.props.data.name}</strong></h4>
                        <h5 className={`mb-1 ${this.props.data.personaSizeOfGroup === undefined || this.props.data.personaSizeOfGroup <= 0 ? "d-none" : ""}`}>
                            {this.processUsers()}
                            {this.processSOG()}
                        </h5>
                        <span className="personaOnelineDesc">{this.props.data.personaOneLineDesc}</span>
                        <button className="btn btn-success">{this.props.data.personaStatus ? "Enabled" : "Disabled"}</button>
{/*                         <div className="modalImagePersonaDiv">
                            {this.props.data.personaImageGif !== undefined && this.props.data.personaImageGif && <ModalImage className="modalImagePersona"
                                small={this.props.data.personaImageGif}
                                medium={this.props.data.personaImageGif}
                                hideDownload={true}
                                hideZoom={true}
                            />}
                        </div> */}
                    </div>
                </div>
            </div>
        );

        // const { Heading, Money, PerText, ContainerClass, index } = this.props;

    }
}

export default PersonaBriefDetailCard_v2;
