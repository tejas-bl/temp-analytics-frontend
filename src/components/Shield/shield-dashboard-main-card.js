import React from 'react';
import { connect } from 'react-redux';
import imageRocket from "../../assets/images/space-ship.png";
import {websiteRecordAction} from '../../actions';

class ShieldDashboardMainCard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
          <div className="card shield-dashboard-shield-card text-center shield_100_card">
          <img alt="" className="shield-dashboard-rocket-img" src={imageRocket} />
          <h2 className="shield-dashboard-header-card-satus">Live</h2>
          <div className="shield-dashboard-header-card-text">
          <p>{this.props.shopperRecord.shield} Activated </p>
          <p>for 100% of Sessions</p>
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
})(ShieldDashboardMainCard);