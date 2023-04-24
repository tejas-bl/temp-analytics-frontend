import { format } from "date-fns";
import React from "react";
import { transformEngagePersonaLogData } from '../../helper/Utils';
class EngageSplitLogsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logsData: []
        }
    }
    async componentDidMount() {
        const data = await transformEngagePersonaLogData(this.props.engagePersonaSplitList, this.props.persona.personaShortCode);
        this.setState({
            logsData: data
        });
    }
    async componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            const data = await transformEngagePersonaLogData(this.props.engagePersonaSplitList, this.props.persona.personaShortCode);
            this.setState({
                logsData: data
            });
        }
    }
    render() {
        const personaName = this.props.persona.name;
        const { logsData } = this.state;
        
        const createSplit = (data,i) => {
            if(!data.status) {
                return (
                    <li key={i}>
                    <div className="feeds-left">
                        <i className="fa fa-thumbs-o-up"></i>
                    </div>
                    <div className="feeds-body">
                        <h4 className="title"><span className="personaName">{personaName}</span>
                                <span className="off-status"> Off</span>
                            <small className="float-right text-muted">
                                {format(new Date(data.date), "MMM dd, yyyy")}
                            </small></h4>
                    </div>
                </li>
                )
            }
            else {
                const split = data.split;
                const remaining_split = (100 - split);
                if(split === 100) {
                    return (
                        <li key={i}>
                            <div className="feeds-left">
                                <i className="fa fa-thumbs-o-up"></i>
                            </div>
                            <div className="feeds-body">
                                <h4 className="title"><span className="personaName">{personaName}</span>
                                    <span className="off-status"> is live for 100% of sessions</span>
                                    <small className="float-right text-muted">
                                        {format(new Date(data.date), "MMM dd, yyyy")}
                                    </small></h4>
                            </div>
                        </li>
                    )
                } else {
                    if(split) {
                        return (
                            (
                                <li key={i}>
                                    <div className="feeds-left">
                                        <i className="fa fa-thumbs-o-up"></i>
                                    </div>
                                    <div className="feeds-body">
                                        <h4 className="title"><span className="personaName">{personaName}</span>
                                            <small className="float-right text-muted">
                                                {format(new Date(data.date), "MMM dd, yyyy")}
                                            </small>
                                        </h4>
                                        <small>Split - [{split} - {remaining_split}]</small>
                                    </div>
                                </li>
                            )
                        )
                       }
                }
            }
        }
        return (
            <div className={`card`}>
                <div className="header pb-0">
                    <h2 className="pb-0">LOGS</h2>
                </div>
                <div className="body">
                    {logsData && logsData.length > 0 ?
                        <ul className="list-unstyled feeds_widget cardScrollBar m-r-5 clearfix customFixedHeight">
                            {logsData.map((e, i) => {
                                return (
                                createSplit(e,i)
                                )
                            })}
                        </ul> :
                        <div className="row no_data_row mt-3">
                            <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                <h3 className="badge no_data_available">No Data Available</h3>
                                <ul className="list-unstyled feeds_widget cardScrollBar m-r-5 clearfix noDataAvailable">
                                    <li>
                                        <div className="feeds-left">
                                            <i className="fa fa-thumbs-o-up"></i>
                                        </div>
                                        <div className="feeds-body">
                                            <h4 className="title">
                                                <span className="personaName">Persona</span>
                                                <span className="off-status"> OFF</span>
                                                <small className="float-right text-muted"></small>
                                            </h4>
                                            <small>Split - [50 - 50]</small>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="feeds-left">
                                            <i className="fa fa-thumbs-o-up"></i>
                                        </div>
                                        <div className="feeds-body">
                                            <h4 className="title">
                                                <span className="personaName">Persona</span>
                                                <span className="off-status"> OFF</span>
                                                <small className="float-right text-muted"></small>
                                            </h4>
                                            <small>Split - [50 - 50]</small>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    }


                </div>
            </div>
        )
    }
}
export default EngageSplitLogsCard;