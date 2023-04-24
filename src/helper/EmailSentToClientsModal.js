import React from "react";
import { websiteRecordAction } from '../actions';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { stringIntoArrayUsingSeparator } from "./Utils";

class EmailSentToClientsModal extends React.Component {
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
        if (clientDetails !== undefined && clientDetails.hasOwnProperty('client_email') && clientDetails.client_email !== null) {
            clientEmails = stringIntoArrayUsingSeparator(clientDetails.client_email, ',')
        }
        return (
            <Modal size={size} show={show} onHide={onClose} className="EmailSentToClientsModal">
                <Modal.Header closeButton>
                    <Modal.Title>Client Emails for {clientDetails.web_url}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>{clientEmails.length ? "Mail sent to following email id's:" : "No Email Sent!"}</h6>
                    <ul>
                        {
                            this.props.clientDetails ? <>
                                {
                                    clientEmails.length ? clientEmails.map((cd, i) => {
                                        return <li className={"clientEmailModalList"} key={`clientEmail_${i}`}>{cd}</li>
                                    }) : "-"
                                }
                            </> :
                                "Loading"
                        }
                    </ul>
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
})(EmailSentToClientsModal);