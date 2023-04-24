import React from "react";
import { websiteRecordAction } from '../actions';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";

class ConfirmBoxModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleConfirmBoxClose = this.handleConfirmBoxClose.bind(this);
    }
    handleConfirmBoxClose(flag) {
        this.props.handleConfirmBoxClose(flag)
    }
    render() {
        const { onClose, size, show, message } = this.props;
        return (
            <Modal size={size} show={show} onHide={onClose} className="confirmBoxModal">
                <Modal.Header closeButton>
                    <Modal.Title>{message.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message.body_title}
                    <button className="btn btn-info mr-1" onClick={() => this.handleConfirmBoxClose(false)}>Close</button>
                    <button className="btn btn-success" onClick={() => this.handleConfirmBoxClose(true)}>Confirm</button>
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