import React from "react";
import { websiteRecordAction } from '../../actions';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";

class ConfirmBoxModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClose = this.handleOnClose.bind(this);
    }
    handleOnClose(flag) {
        this.props.handleOnClose(flag, this.props.reportDetails)
    }
    render() {
        const { onClose, size, show } = this.props;
        return (
            <Modal centered size={size} show={show} onHide={onClose} className="confirmBoxModal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>{this.props.message}</h6>
                    <button className="btn btn-info mr-1" onClick={() => this.handleOnClose(false)}>Close</button>
                    <button className="btn btn-success" onClick={() => this.handleOnClose(true)}>Confirm</button>
                </Modal.Body>
            </Modal>
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
})(ConfirmBoxModal);