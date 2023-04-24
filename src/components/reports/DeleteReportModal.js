import React from "react";
import { websiteRecordAction } from '../../actions';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";

import { getCurrentUser } from "../../helper/Utils";
import { deleteReport } from "../../api/Dashboard/Reports";

class DeleteReportModal extends React.Component {
    constructor(props) {
        super(props);
    }

    async handleReportDelete(data) {
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${currentUser.refresh_token}`,
            }
        }
        data.site_id = this.props.sessionClient.web_id;
         const deleted = await deleteReport(data, headerConfig);
         if (deleted.data.statuscode === 200) {
             this.props.onClose(true);
         } else {
             this.props.onClose(false);
         }
    }

    render() {
        const { onClose, size, show } = this.props;
        return (
            <Modal size={size} show={show} onHide={onClose} className="deleteuserModal">
                <Modal.Header closeButton>
                    <Modal.Title>Delete Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-row justify-content-between flex-wrap">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="">
                                <div className="body">
                                    Do you want to delete {this.props.data.email} Report?
                                    <div className="col-md-12 text-left mt-3 pl-0 pr-0">
                                        <button
                                            className="btn btn-danger text-center mr-3"
                                            onClick={() => this.handleReportDelete(this.props.data)}
                                        >
                                            Delete
                                        </button>

                                        <button
                                            className="btn btn-info text-center"
                                            onClick={() => {
                                                onClose(false)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
})(DeleteReportModal);