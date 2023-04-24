import React from "react";
import { Modal } from "react-bootstrap";
import { deletePromoBoxData } from "../../../api/Engage/PromoBox";
class DeletePromoBoxModalCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
        this.handlePromoBoxDelete = this.handlePromoBoxDelete.bind(this);
    }

    async handlePromoBoxDelete(id){
      await deletePromoBoxData(id);
      this.props.onClose(true);
    }
  render() {
    const { title, onClose, size, show } = this.props;
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
                        onClick={() => this.handlePromoBoxDelete(this.props.data.id)}
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

export default DeletePromoBoxModalCard;

