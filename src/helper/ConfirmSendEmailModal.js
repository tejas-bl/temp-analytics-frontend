import React from "react";
import { websiteRecordAction } from '../actions';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";

class ConfirmSendEmailModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClose = this.handleOnClose.bind(this);
        this.state = {
            clientEmails: this.props.clientDetails,
            clientEmailsLoading: true
        }
    }
    handleOnClose(flag) {
        this.props.handleOnClose(flag)
    }
    render() {
        const { onClose, size, show, clientDetails } = this.props;
        let clientEmails = [];
        if (clientDetails !== undefined && clientDetails.hasOwnProperty('email') && clientDetails.email !== null) {
            clientEmails = clientDetails.email
        }
        return (
            <Modal size={size} show={show} onHide={onClose} className="confirmSendEmailModal">
                <Modal.Header closeButton>
                    <Modal.Title>Mail Approval for {clientDetails.web_url}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Mail will be sent to following email id's:</h6>
                    <ul>
                    {
                        this.props.clientDetails ? <>
                            {
                                clientEmails.length ? clientEmails.map((cd, i) => {
                                    return <li className={"clientEmailModalList"} key={`clientEmail_${i}`}>{cd.email}</li>
                                }) : "-"
                            }
                        </> :
                            "Loading"
                    }
                    </ul>
                    <button className="btn btn-info mr-1" onClick={() => this.handleOnClose(false)}>Close</button>
                    <button disabled={!clientEmails.length} className="btn btn-success" onClick={() => clientEmails.length ? this.handleOnClose(true) : this.handleOnClose(false)}>Confirm</button>
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
})(ConfirmSendEmailModal);