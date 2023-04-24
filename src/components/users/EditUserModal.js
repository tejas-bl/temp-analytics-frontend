import React from "react";
import { websiteRecordAction } from '../../actions';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";

import EditUserProfile from "../../screens/user/EditUserProfile";

class EditUserModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { onClose, size, show , data } = this.props;
        return (
            <Modal size={size} show={show} onHide={onClose} className="edituserModal">
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditUserProfile onClose={onClose} userData={data}></EditUserProfile>
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
})(EditUserModal);