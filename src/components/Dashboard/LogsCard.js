import React from "react";
import { format } from "date-fns";
import { connect } from "react-redux";
import { websiteRecordAction } from '../../actions';
class LogsCard extends React.Component {

    splitLogRecord(name, split, status) {
        if (status !== false && split !== 100 && split !== false) {
            return name + ' - ' + split + '/' + (100 - split)
        } else if (status !== false && split === 100 && split !== false) {
            return name + ' - Live for 100%'
        }
        return "";
    }
    createLogData(data, i) {
        let logElement = [];
        let firstPersonaFlag = true;
        let persona = "";
        for (let p in data["persona"]) {/*
            console.log("PERSONA DATA --- ", data["persona"]) */
            if (data["persona"][p] !== "") {
                if (firstPersonaFlag) {
                    persona += ` ${this.splitLogRecord(data["persona"][p].name, data["persona"][p].split, data["persona"][p].status)}`
                    firstPersonaFlag = false;
                } else {
                    persona += `,<br /> ${this.splitLogRecord(data["persona"][p].name, data["persona"][p].split, data["persona"][p].status)}`
                }
            }
        }

        if (data["engage"] !== null || data["split"] !== false) {
            if (firstPersonaFlag) {
                persona += this.splitLogRecord(this.props.shopperRecord.shield, data["ab_perc"], data["ab_status"]);
            } else {
                persona += `,<br /> ${this.splitLogRecord(this.props.shopperRecord.shield, data["ab_perc"], data["ab_status"])}`;
            }

            logElement.push(
                <li key={i++}>
                    <div className="feeds-left">
                        <i className="fa fa-thumbs-o-up"></i>
                    </div>
                    <div className="feeds-body">
                        <h4 className="title">
                            {data["phase"] === "Listening Phase" ? "Listening Phase" :
                                data["engage"] === "engage_during" || (data["split"] !== false && data["phase"] !== "Listening Phase") ? "POC Phase" :
                                    data["engage"] === "engage_off" && data["split"] === false ? "Off" : "On"}
                            <small className="float-right text-muted">{format(new Date(data.date), "MMM dd, yyyy")}</small></h4>
                        <small>
                            {(data["engage"] !== null && data["engage"] !== "engage_off") || (data["split"] !== false && data["phase"] !== "Listening Phase") ? <>Shopper Group Activated - <br /> <span className="badge-purple"> <pre dangerouslySetInnerHTML={{ __html: persona }} /> </span> </> : ""}
                        </small>
                    </div>
                </li>);
        }

        return logElement;
    }
    render() {
        // const { Heading, Money, PerText, ContainerClass, index } = this.props;
        return (
            <div className={`card ${this.props.className}`}>
                <div className="header pb-0">
                    <h2 className="pb-0">LOGS</h2>
                </div>

                { //this.props.logs && Object.keys(this.props.logs).length !== 0 ?
                    this.props.logs && Object.keys(this.props.logs).length !== 0 ?
                        <div className="body">
                            <ul className="list-unstyled dashboardLogs feeds_widget cardScrollBar m-r-5 clearfix">
                                {this.props.logs.slice(0).reverse().map((data, i) => {
                                    return (
                                        this.createLogData(data, i)
                                    );
                                })}
                            </ul>
                        </div> :
                        <div className="row no_data_row p-2">
                            <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                <h3 className="badge no_data_available">No Data Available</h3>
                                <ul className="list-unstyled feeds_widget cardScrollBar m-r-5 clearfix noDataAvailable">

                                    <li><div className="feeds-left"><i className="fa fa-thumbs-o-up"></i></div><div className="feeds-body"><h4 className="title">NO DATA AVAILABLE<small className="float-right text-muted">NO DATA AVAILABLE</small></h4><small>NO DATA AVAILABLE</small></div></li>

                                    <li><div className="feeds-left"><i className="fa fa-thumbs-o-up"></i></div><div className="feeds-body"><h4 className="title">NO DATA AVAILABLE<small className="float-right text-muted">NO DATA AVAILABLE</small></h4><small>NO DATA AVAILABLE</small></div></li>

                                    <li><div className="feeds-left"><i className="fa fa-thumbs-o-up"></i></div><div className="feeds-body"><h4 className="title">NO DATA AVAILABLE<small className="float-right text-muted">NO DATA AVAILABLE</small></h4><small>NO DATA AVAILABLE</small></div></li><li><div className="feeds-left"><i className="fa fa-thumbs-o-up"></i></div><div className="feeds-body"><h4 className="title">NO DATA AVAILABLE<small className="float-right text-muted">NO DATA AVAILABLE</small></h4><small>NO DATA AVAILABLE</small></div></li>

                                    <li>
                                        <div className="feeds-left"><i className="fa fa-thumbs-o-up"></i></div>
                                        <div className="feeds-body">
                                            <h4 className="title">NO DATA AVAILABLE<small className="float-right text-muted">NO DATA AVAILABLE</small></h4>
                                        </div></li>


                                </ul>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

const mapStateToProps = ({
    websiteRecordReducer
}) => ({
    shopperRecord: websiteRecordReducer.shopperRecord
});

export default connect(mapStateToProps, {
    websiteRecordAction
})(LogsCard);