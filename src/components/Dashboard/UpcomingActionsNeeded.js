import { format } from "date-fns";
import React from "react";
import { connect } from "react-redux";
import {
    websiteRecordAction
} from "../../actions";

class UpcomingActionsNeeded extends React.Component {

    constructor(props) {
        super(props);
        this.handleEventDetailRedirection = this.handleEventDetailRedirection.bind(this)
    }

    async handleEventDetailRedirection(personaId) {
        await this.props.history.push({pathname:`/engage/persona`, search:`?personaId=${personaId}`});
    }

    render() {
        return (
            <div className={`card ${this.props.className}`}>
                <div className="header pb-0">
                    <h2 className="">Upcoming Actions Needed</h2>
                </div>
                {this.props.data && this.props.data.length > 0 ?
                    <div className="body">
                        <ul className="list-unstyled feeds_widget upcomingActionsUl cardScrollBar m-r-5 clearfix">
                        {this.props.cashbackCouponStatus === false &&
                            <li className="">
                                <div className="feeds-left pl-1">
                                    <i className="fa fa-dollar"></i>
                                </div>
                                <div className="feeds-body">
                                    <h4 className="title"> Cashback and Coupon Extensions shows a 30% savings in Affiliate Payouts and 1.5% lift in conversion rate</h4>
                                    <small>Maximize your revenue by enabling it.</small>
                                </div>
                            </li>
                        }
                            {this.props.data.map((data, i) => {
                                return (


                                    data.hasOwnProperty('personaRevPotential') ? 
                                    <li
                                    onClick={() => this.handleEventDetailRedirection(data.id)}
                                    key={i} 
                                    className={parseInt(data.personaRevPotential) <=0 ? "d-none" : "cursor-class"}>
                                        <div className="feeds-left pl-1">
                                            <i className="fa fa-dollar"></i>
                                        </div>
                                        <div className="feeds-body">
                                            <h4 className="title">{data.name} shows a {parseFloat(data.personaRevPotential).toLocaleString('en-US', {
                                                style: 'currency', currency: this.props.sessionClient.currency, minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })} revenue impact for last 30 days.</h4>
                                            <small> Maximize your revenue by enabling it.
                                            </small>
                                        </div>

                                    </li> :
                                        <li key={i}>

                                            <div className="feeds-left">
                                                <i className="icon-hourglass"></i>
                                            </div>
                                            <div className="feeds-body">
                                                <h4 className="title">{data.offer_heading}<small className="float-right text-danger badge">{data.expired ? `expired` : `expiring - ${format(new Date(data.valid_to), "MMM dd, yyyy")}`}</small></h4>
                                                <small>Persona - {data.persona_name}</small>
                                            </div>

                                        </li>
                                );
                            })}
                        </ul>
                    </div>
                    :
                    <div className="row no_data_row p-2">
                        <div className="col-md-12 col-lg-12 no_data_avl_md12">
                            <h3 className="badge no_data_available">You're all upto speed!!!</h3>
                            <ul className="list-unstyled feeds_widget cardScrollBar m-r-5 clearfix noDataAvailable"><li><div className="feeds-left"><i className="icon-hourglass"></i></div><div className="feeds-body"><h4 className="title">No Data Available</h4><small>No Data Available</small></div></li>

                                <li><div className="feeds-left"><i className="icon-hourglass"></i></div><div className="feeds-body"><h4 className="title">No Data Available</h4><small>No Data Available</small></div></li>

                                <li><div className="feeds-left"><i className="icon-hourglass"></i></div><div className="feeds-body"><h4 className="title">No Data Available<small className="float-right text-danger badge">No Data Available</small></h4><small>No Data Available</small></div></li>

                                <li><div className="feeds-left"><i className="icon-hourglass"></i></div><div className="feeds-body"><h4 className="title">No Data Available<small className="float-right text-danger badge">No Data Available</small></h4><small>No Data Available</small></div></li></ul>
                        </div>
                    </div>
                }
                {/* <div className="row no_data_row">
                <h3 className="badge no_data_available">No Data Available</h3>
                <img src={no_data_available} width="auto" height="300px" alt="No data available" />
              </div> */}
            </div>
        );
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
})(UpcomingActionsNeeded);
