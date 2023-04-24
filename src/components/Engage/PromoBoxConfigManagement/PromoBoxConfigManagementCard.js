import React from "react";
import { Button } from "react-bootstrap";
import { getPromoBoxConfigData } from "../../../api/Engage/PromoBoxConfig";
import { formatDate } from "../../../helper/Utils";
import AddPromoBoxConfigModalCard from "./AddPromoBoxConfigModalCard";
import DeletePromoBoxConfigModalCard from "./DeletePromoBoxConfigModalCard";
import EditPromoBoxConfigModalCard from "./EditPromoBoxConfigModalCard";
// import AddPromoBoxConfigModalCard from "./AddPromoBoxConfigModalCard";
// import DeletePromoBoxConfigModalCard from "./DeletePromoBoxConfigModalCard";
// import EditPromoBoxConfigModalCard from "./EditPromoBoxConfigModalCard";

class PromoBoxConfigManagementCard extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddPromoBoxConfigModal: false,
      showEditPromoBoxConfigModal: false,
      showDeletePromoBoxConfigModal: false,
      promoBoxConfigData: {}
    }
  }

  onClickAddPromoBoxConfigModal(promoBoxConfig) {
    if(promoBoxConfig === true){
      this.setState({
        showAddPromoBoxConfigModal: !this.state.showAddPromoBoxConfigModal
      })
      this.props.renderPromoBoxConfig();
    }else{
      this.setState({ showAddPromoBoxConfigModal: !this.state.showAddPromoBoxConfigModal })
    }
  }

  async onClickEditPromoBoxConfigModal(promoBoxConfig) {
    if(promoBoxConfig === true){
      this.setState({
        showEditPromoBoxConfigModal: !this.state.showEditPromoBoxConfigModal
      })
      this.props.renderPromoBoxConfig();
    }else{

      if (!this.state.showEditPromoBoxConfigModal) {
        this.setState({
          showEditPromoBoxConfigModal: !this.state.showEditPromoBoxConfigModal,
          promoBoxConfigData: promoBoxConfig
        })
      } else {
        this.setState({
          showEditPromoBoxConfigModal: !this.state.showEditPromoBoxConfigModal,
          promoBoxConfigData: {}
        })
      }
    }
  }
  async onClickDeletePromoBoxConfigModal(promoBoxConfig) {
    if(promoBoxConfig === true){
      this.setState({
        showDeletePromoBoxConfigModal: !this.state.showDeletePromoBoxConfigModal
      })
      this.props.renderPromoBoxConfig();
    }else{

      if (!this.state.showDeletePromoBoxConfigModal) {
        this.setState({
          showDeletePromoBoxConfigModal: !this.state.showDeletePromoBoxConfigModal,
          promoBoxConfigData: promoBoxConfig
        })
      } else {
        this.setState({
          showDeletePromoBoxConfigModal: !this.state.showDeletePromoBoxConfigModal,
          promoBoxConfigData: {}
        })
        
      }
    }
  }
  render() {
    return (
      <div className="col-lg-12 col-md-12">
        <div className="card d-flex flex-row flex-wrap pt-3 pb-3">
          <div className="col-lg-12 col-md-12">
            <div className="header">
              <h4>
                PromoBoxConfig Management
              </h4>
              <Button onClick={() => { this.onClickAddPromoBoxConfigModal(); }} className="btn btn-outline-info btn-info text-white float-right"><span>Add PromoBoxConfig </span> <i className="fa fa-download"></i> </Button>
            </div>
          </div>

          <div className="col-lg-12 col-md-12">
            <div className="body table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Site Id</th>
                    <th>Logo</th>
                    <th>Remarks</th>
                    <th>Created On</th>
                    <th>Modified On</th>
                  </tr>
                </thead>
                <tbody>
                  { this.props.data && this.props.data.map((data, i) => {
                     return (
                      <tr key={i}>
                        <td scope="row" className="text-center">
                          {data.id}
                          {/* <div className="fancy-checkbox">
                            <label>
                              <input type="checkbox" />
                              <span></span>
                            </label>
                          </div> */}
                        </td>
                        <td>{data.site_id}</td>
                        <td>{data.logo}</td>
                        <td>{data.remarks}</td>
                        <td>{formatDate(data.created_on)}</td>
                        <td>{data.modified_on && formatDate(data.modified_on)}</td>
                        <td className="" onClick={() => this.onClickEditPromoBoxConfigModal(data)}> <i className="badge badge-info fa fa-pencil"> </i>  </td>
                        <td className="" onClick={() => this.onClickDeletePromoBoxConfigModal(data)}> <i className="badge badge-danger fa fa-trash"> </i>  </td>
                      </tr>
                    );
                })
                  }
        
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <AddPromoBoxConfigModalCard
          key={"add_promoBoxConfig"}
          size={"lg"}
          title={"Add PromoBoxConfig"}
          show={this.state.showAddPromoBoxConfigModal}
          onClose={(flag) => this.onClickAddPromoBoxConfigModal(flag)}
        />

         <EditPromoBoxConfigModalCard
          key={"edit_promoBoxConfig"}
          size={"lg"}
          title={"Edit PromoBoxConfig"}
          data={this.state.promoBoxConfigData}
          show={this.state.showEditPromoBoxConfigModal}
          onClose={(flag) => this.onClickEditPromoBoxConfigModal(flag)}
        />

        <DeletePromoBoxConfigModalCard
          key={"delete_promoBoxConfig_1"}
          size={"md"}
          title={"Delete PromoBoxConfig"}
          data={this.state.promoBoxConfigData}
          show={this.state.showDeletePromoBoxConfigModal}
          onClose={(flag) => this.onClickDeletePromoBoxConfigModal(flag)}
        />


      </div>
    );
  }
}


export default PromoBoxConfigManagementCard;
