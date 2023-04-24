import React from "react";
import { websiteRecordAction } from '../../actions';
import { connect } from "react-redux";

class RefreshButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnRefreshData = this.handleOnRefreshData.bind(this);
    }
    handleOnRefreshData() {
        this.props.handleOnRefreshData()
    }
    render() {
        return (
            <span style={this.props.customCSS} className="refreshButtonSpan" onClick={() => this.handleOnRefreshData()}>
                <i className="badge badge-info text-black fa fa-refresh"> </i>
            </span>
        )
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
})(RefreshButton);