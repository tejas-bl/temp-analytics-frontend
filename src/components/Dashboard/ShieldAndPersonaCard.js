import React from "react";

class ShieldAndPersonaCard extends React.Component {
    render() {
        // const { Heading, Money, PerText, ContainerClass, index } = this.props;
        return (<>
            {
                <div className={`card ${this.props.className}`}>

                    <div className="body pb-0 cardScrollBar m-r-5 clearfix pt-5" style={{ height: "367px", overflow: "hidden" }}>
                        <div className="header pb-3 pt-3">
                            <h2 className="pb-0">Shopper Groups</h2>
                        </div>
                        <>
                            <ul className="list-unstyled list-referrals pl-4 pr-4">
                                {
                                    this.props.updatedPersonaList && this.props.updatedPersonaList.map((apb, i) => {
                                        if (apb.name !== 'Shield') {
                                            return (
                                                <li key={i} className="col-md-6 col-lg-6 activePersonaHome d-inline-block pl-0 mb-0">
                                                    <p><span className="">{apb.name}</span><span className={`badge float-right ${(apb.personaStatus ? 'badge-info' : 'badge-danger')}`}>{apb.personaStatus ? 'ON' : 'OFF'}</span></p>
                                                </li>
                                            )
                                        }
                                    })
                                }
                            </ul>
                        </>
                    </div>


                    {/* <div className="body pt-0">

                        <div className="header pl-0 pr-0">
                            <h2 className="pb-0">Active Persona</h2>
                        </div>

                        <ul className="list-unstyled list-referrals cardScrollBar m-r-5 clearfix" style={{ height: "80px" }}>
                            {   
                                this.props.updatedPersonaList && this.props.updatedPersonaList.map((apb, i) => {
                                    return (
                                        <li key={i}>
                                            <p><span className="">{apb.name}</span><span className={`badge float-right ${(apb.personaStatus ? 'badge-info' : 'badge-danger')}`}>{apb.personaStatus ? 'ON' : 'OFF'}</span></p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div> */}

                </div>
            }
        </>
        );
    }
}

export default ShieldAndPersonaCard;
