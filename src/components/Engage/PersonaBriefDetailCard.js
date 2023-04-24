import React from "react";

class PersonaBriefDetailCard extends React.Component {

    render() {
        return (
            <div className="card pt-3 pb-4">
            <div className="body pb-0 text-center">
            <h4 className="m-t-10 m-b-1"><strong>{this.props.title}</strong></h4>
                <p>{this.props.data.description}</p>
                <h5 className="mb-3">7% <small>of all Sessions</small> </h5>
                <button className="btn btn-success">{this.props.data.status}</button>
            </div>
        </div>
        );

        // const { Heading, Money, PerText, ContainerClass, index } = this.props;
        
    }
}

export default PersonaBriefDetailCard;
