import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";

class PersonaListTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isPersonaLoading: false,
            personaClickedId: null
        }
        this.handlePersonaDetails = this.handlePersonaDetails.bind(this)
    }

    handlePersonaDetails(loadingPage, title, rowId) {
        this.props.handlePersonaDetails(loadingPage, title, rowId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.personaDetailLoader !== prevProps.personaDetailLoader) {
            this.setState({
                isPersonaLoading: this.props.personaDetailLoader.personaDetailLoaderStatus,
                personaClickedId: this.props.personaDetailLoader.personaRowId
            })
        }
    }
    render() {
        return (
            <div className="card">
                {/* <span className="engageStatus">{this.props.engagePhase.name}</span> */}
                <div className="body table-responsive">
                    <div className="engage-status">
                        {this.props.engagePhase.name === 'Post Phase' &&
                            <span className="post-phase"></span>
                        }
                        {this.props.engagePhase.name === 'POC Phase' &&
                            <span className="poc-phase"></span>
                        }
                        {this.props.engagePhase.name === 'Pre Phase' &&
                            <span className="pre-phase"></span>
                        }
                    </div>

                    {this.props.engagePhase.name === 'Pre Phase' ?
                        <div className="div-table">
                            <div className="table">
                                <div className="tr" >
                                    <div className="td">Shoppers</div>
                                    <div className="td">Status</div>
                                    <div className="td">Potential Revenue ({this.props.indStdRevenue30Days ? 30 : this.props.numberOfDays} days)
                                    </div>
                                </div>

                                {/* <a href="#" style={{display:"contents"}}> */}
                                {/* </a> */}
                                {this.props.updatedEngagePersonaList && this.props.updatedEngagePersonaList.map((d, i, allElement) => {

                                    if (d !== undefined) {
                                        return (
                                            <div className="tr persona_tr" key={`plt_${i}`} onClick={() => {
                                                if (!this.state.isPersonaLoading && d.personaStatus !== 'NA') {
                                                    this.handlePersonaDetails(true, d, i)
                                                } else if (!this.state.isPersonaLoading && d.personaStatus === 'NA') {
                                                    alert("Not Eligible! please contact us at support@brandlock.io")
                                                }
                                            }}>
                                                <div className="td">{d.name}</div>
                                                <div className="td">{d.personaStatus && d.personaStatus !== 'NA' ? <span><i className="fa fa-check text-success"></i> On</span> : !d.personaStatus && d.personaStatus !== 'NA' ? <span><i className="fa fa-close text-danger"></i> Off</span> : <span style={{ fontSize: "10px" }} className="badge badge-info ml-0">NOT ELIGIBLE</span>}</div>
                                                {<div className={"td " + (!d.personaStatus ? "potentialColor" : "")} >
                                                    {!isNaN(parseFloat(d.personaRevProjected)) && parseFloat(d.personaRevProjected) !== 0 ? <>

                                                        {parseFloat(d.personaRevProjected).toLocaleString('en-US', {
                                                            style: 'currency', currency: this.props.currency, minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0
                                                        })}
                                                        {d.personaShortCode === 'cs' && !d.personaStatus ? <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            key="right"
                                                            placement="right"
                                                            overlay={
                                                                <Popover className="col-md-7 col-lg-7" style={{ width: "5300px" }} id={`popover-positioned-right`}>
                                                                    {/* <Popover.Title as="h3">{`Q. How do you identify a winner of an A/B test when the sample sizes are Uneven?`}</Popover.Title>
                                                                */} <Popover.Content>
                                                                        Projected revenue from products being added back to the cart after engagement.
                                                                    </Popover.Content>
                                                                </Popover>
                                                            }
                                                        >
                                                            <Button className="infoIcon" variant="default">
                                                                <span className="info_icon"><i className="fa fa-info text-white"></i></span>
                                                            </Button>
                                                        </OverlayTrigger> : ""}
                                                    </> : <span style={{ fontSize: "10px" }} className="badge badge-info ml-0">{d.personaStatus !== 'NA' ? "NO DATA AVAILABLE" : "NOT ELIGIBLE"}</span>} {this.state.isPersonaLoading && this.state.personaClickedId === i ? <i className="fa fa-spinner fa-spin text-info float-right font-weight-bold"></i> : ""} </div>}
                                                {/* {<div className={"td " + (d.personaRev > 300000 ? "potentialColor" : "")} >{d.personaRev}</div>} */}

                                            </div>
                                        )
                                    }
                                    return null;
                                })
                                }
                            </div>
                        </div> :
                        <div className="div-table">
                            <div className="table">
                                <div className="tr" >
                                    <div className="td">Shoppers</div>
                                    <div className="td">Status</div>
                                    <div className="td">Revenue</div>
                                    <div className="td">Potential Revenue ({this.props.numberOfDays} days)</div>
                                </div>

                                {/* <a href="#" style={{display:"contents"}}> */}
                                {/* </a> */}

                                {this.props.updatedEngagePersonaList && this.props.updatedEngagePersonaList.map((d, i, allElement) => {

                                    if (d !== undefined) {
                                        return (
                                            <div className="tr persona_tr" key={`plt_${i}`} onClick={() => {
                                                if (!this.state.isPersonaLoading && d.personaStatus !== 'NA') {
                                                    this.handlePersonaDetails(true, d, i)
                                                } else if (!this.state.isPersonaLoading && d.personaStatus === 'NA') {
                                                    alert("Not Eligible! please contact us at support@brandlock.io")
                                                }
                                            }}>
                                                <div className="td">{d.name}</div>
                                                <div className="td">{d.personaStatus && d.personaStatus !== 'NA' ? <span><i className="fa fa-check text-success"></i> On</span> : !d.personaStatus && d.personaStatus !== 'NA' ? <span><i className="fa fa-close text-danger"></i> Off</span> : <span style={{ fontSize: "10px" }} className="badge badge-info ml-0">NOT ELIGIBLE</span>}</div>
                                                {/* <div className={"td " + (d.recoveredRevenueNum > 300000 ? "potentialColor" : "")} >{d.recoveredRevenue}</div> */}



                                                {<div className={"td " + (!d.personaStatus ? "potentialColor" : "")} >{!isNaN(parseFloat(d.personaRev)) && parseFloat(d.personaRev) !== 0 && d.personaStatus ?
                                                    <>
                                                        {parseFloat(d.personaRev).toLocaleString('en-US', {
                                                            style: 'currency', currency: this.props.currency, minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0
                                                        })}
                                                        {d.personaShortCode === 'cs' && !d.personaStatus ? <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            key="right"
                                                            placement="right"
                                                            overlay={
                                                                <Popover className="col-md-7 col-lg-7" style={{ width: "5300px" }} id={`popover-positioned-right`}>
                                                                    {/* <Popover.Title as="h3">{`Q. How do you identify a winner of an A/B test when the sample sizes are Uneven?`}</Popover.Title>
                                                                */} <Popover.Content>
                                                                        Projected revenue from products being added back to the cart after engagement.
                                                                    </Popover.Content>
                                                                </Popover>
                                                            }
                                                        >
                                                            <Button className="infoIcon" variant="default">
                                                                <span className="info_icon"><i className="fa fa-info text-white"></i></span>
                                                            </Button>
                                                        </OverlayTrigger> : ""}
                                                    </>
                                                    : <span style={{ fontSize: "10px" }} className="badge-info ml-0">--------</span>}</div>}


                                                {
                                                    d.personaPhase !== 'post' && d.personaPhase !== 'live' ?
                                                        <div className={"td"} >{!isNaN(parseFloat(d.personaRev)) && parseFloat(d.personaRev) !== 0 ?
                                                            <>
                                                                <i style={{ fontSize: '10px' }} className="fa fa-plus potentialColor"></i> <span className="potentialColor">
                                                                    {d.personaStatus ?
                                                                        parseFloat(d.personaRevProjected).toLocaleString('en-US', {
                                                                            style: 'currency', currency: this.props.currency, minimumFractionDigits: 0,
                                                                            maximumFractionDigits: 0
                                                                        }) : parseFloat(d.personaRev).toLocaleString('en-US', {
                                                                            style: 'currency', currency: this.props.currency, minimumFractionDigits: 0,
                                                                            maximumFractionDigits: 0
                                                                        })
                                                                    }
                                                                </span>
                                                                {d.personaShortCode === 'cs' && !d.personaStatus ? <OverlayTrigger
                                                                    trigger={["hover", "focus"]}
                                                                    key="right"
                                                                    placement="right"
                                                                    overlay={
                                                                        <Popover className="col-md-7 col-lg-7" style={{ width: "5300px" }} id={`popover-positioned-right`}>
                                                                            {/* <Popover.Title as="h3">{`Q. How do you identify a winner of an A/B test when the sample sizes are Uneven?`}</Popover.Title>
                                                                */} <Popover.Content>
                                                                                Projected revenue from products being added back to the cart after engagement.
                                                                            </Popover.Content>
                                                                        </Popover>
                                                                    }
                                                                >
                                                                    <Button className="infoIcon" variant="default">
                                                                        <span className="info_icon"><i className="fa fa-info text-white"></i></span>
                                                                    </Button>
                                                                </OverlayTrigger> : ""}
                                                            </>
                                                            : <span style={{ fontSize: "10px" }} className="badge badge-info ml-0">{d.personaStatus !== 'NA' ? "NO DATA AVAILABLE" : "NOT ELIGIBLE"}</span>} {this.state.isPersonaLoading && this.state.personaClickedId === i ? <i className="fa fa-spinner fa-spin text-info float-right font-weight-bold"></i> : ""}
                                                        </div> : <div className={"td"} ><span className="badge badge-success">Live for 100% Users</span></div>
                                                }
                                                {/* {<div className={"td " + (d.personaRev > 300000 ? "potentialColor" : "")} >{d.personaRev}</div>} */}

                                            </div>
                                        )
                                    }
                                    return null;
                                })
                                }
                                <div className="tr persona_tr shopperRevenueTotalRow">
                                    <div className="td">Total</div>
                                    <div className="td"></div>
                                    <div className="td">
                                        {this.props.impactRevenue === false ? <i className="fa fa-spinner fa-spin text-info float-left font-weight-bold"></i> : parseFloat(this.props.impactRevenue).toLocaleString('en-US', {
                                            style: 'currency', currency: this.props.currency, minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        })}

                                    </div>

                                    <div className="td potentialColor">
                                        {this.props.potentialRevenueTotal ? <>
                                            <i style={{ fontSize: '10px' }} className="fa fa-plus"></i>&nbsp;
                                            {parseFloat(this.props.potentialRevenueTotal).toLocaleString('en-US', {
                                                style: 'currency', currency: this.props.currency, minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </>
                                            : <i className="fa fa-spinner fa-spin text-info float-left font-weight-bold"></i>}

                                    </div>
                                </div>
                            </div>
                        </div>

                    }


                </div>
            </div>
        );
    }
}

export default PersonaListTable;
