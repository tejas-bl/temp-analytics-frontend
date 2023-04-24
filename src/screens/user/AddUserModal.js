import React from "react";
import { websiteRecordAction } from '../../actions';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import CreateUser from "../../components/users/CreateUser";

class AddUserModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { onClose, size, show } = this.props;
        return (
            <Modal size={size} show={show} onHide={onClose} className="adduserModal">
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateUser onClose={onClose}></CreateUser>
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
})(AddUserModal);