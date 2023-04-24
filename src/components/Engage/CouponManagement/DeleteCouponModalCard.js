import React from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { findTzByKey } from "timezone-select-js";
import {
  websiteRecordAction
} from "../../../actions";
import { deleteEngagePersonaPromoCode } from "../../../api/Engage/OldDB";
import { getCurrentUser } from "../../../helper/Utils";
class DeleteCouponModalCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.handlePromoCodeDelete = this.handlePromoCodeDelete.bind(this);
  }

  async handlePromoCodeDelete(id, site_id) {
    const currentUser = getCurrentUser(); 
    const headerConfigPassed = {
      headers: {
        Authorization: currentUser && currentUser.hasOwnProperty('data') && `Bearer ${currentUser.data.data.refresh_token}`,
      }
    }
    let values = {
      id: parseInt(this.props.data.id),
      offer_heading: this.props.data.offer_heading,
      offer_sub_heading: this.props.data.offer_sub_heading,
      code: this.props.data.code,
      site_name: this.props.sessionClient.web_url,
      site_id: parseInt(this.props.data.site_id),
      valid_from: new Date(this.props.data.valid_from),
      valid_to: new Date(this.props.data.valid_to),
      valid_from_timezone: findTzByKey(this.props.data.valid_from_tz_name),
      valid_to_timezone: findTzByKey(this.props.data.valid_to_tz_name),
      status: this.props.data.status,
      is_active: this.props.data.is_active,
      remarks: this.props.data.remarks,
      persona: this.props.personaId
    };

    values = { ...values, ...currentUser.data.data}
    await deleteEngagePersonaPromoCode(values, headerConfigPassed);
    this.props.onClose(true);
  }
  render() {
    const {  onClose, size, show } = this.props;
    return (
      <Modal size={size} show={show} onHide={onClose}>
        <Modal.Body closeButton>

          <div className="d-flex flex-row justify-content-between flex-wrap">

            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="">
                <div className="body">
                  Do you want to delete {this.props.data.offer_sub_heading} Coupon?
                  <div className="col-md-12 text-left mt-3 pl-0 pr-0">
                    <button
                      className="btn btn-danger text-center mr-3"
                      onClick={() => this.handlePromoCodeDelete(this.props.data.id, this.props.data.site_id)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn btn-info text-center"
                      onClick={() => {
                        onClose()
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
    );
  }
}

const mapStateToProps = ({ websiteRecordReducer }) => ({
  sessionClient: websiteRecordReducer.sessionClient
});

export default connect(mapStateToProps, {
  websiteRecordAction
})(DeleteCouponModalCard);

