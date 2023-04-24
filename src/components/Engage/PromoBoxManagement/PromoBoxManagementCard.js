import React from "react";
import { Button } from "react-bootstrap";
import { getPersonaData } from "../../../api/Engage/Persona";
import { getPersonaPromoCode, getPromoCodeData } from "../../../api/Engage/PromoCode";
import { formatDate } from "../../../helper/Utils";
import AddPromoBoxModalCard from "./AddPromoBoxModalCard";
import DeletePromoBoxModalCard from "./DeletePromoBoxModalCard";
import EditPromoBoxModalCard from "./EditPromoBoxModalCard";

class PromoBoxManagementCard extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddPromoBoxModal: false,
      showEditPromoBoxModal: false,
      showDeletePromoBoxModal: false,
      promoBoxData: {},
      personaData: {},
      promoCodeData: {},
      personaId: {},
      personaIdIsLoading: true,
      promoCodeDataIsLoading: true,
      personaKeyValue: {},
      personaIsLoading: true,
      personaKeyValueIsLoading: true
    }
  }

  
  componentDidMount(){
    getPersonaData()
    .then(res => {
      this.setState({
        personaIsLoading : false,
        personaData : res
      })
    })
    .catch(err => {
      console.log(err);
    })

    getPromoCodeData()
    .then(res => {
      this.setState({
        promoCodeDataIsLoading : false,
        promoCodeData : res
      })
    })
    .catch(err => {
      console.log(err);
    })
  }


  onClickAddPromoBoxModal(promoBox) {
    if(promoBox === true){
      this.setState({
        showAddPromoBoxModal: !this.state.showAddPromoBoxModal
      })
      this.props.renderPromoCode();
    }else{
      this.setState({ showAddPromoBoxModal: !this.state.showAddPromoBoxModal })
    }
  }

  async onClickEditPromoBoxModal(promoBox) {
    if(promoBox === true){
      this.setState({
        showEditPromoBoxModal: !this.state.showEditPromoBoxModal
      })
      this.props.renderPromoCode();
    }else{

      if (!this.state.showEditPromoBoxModal) {
        await getPersonaPromoCode(promoBox.code).then(res => {
          let personaIdArray = [];
          res.data.map((data)=>{
            personaIdArray.push(data.persona_id.toString());
          })
          this.setState({
            promoBoxData: promoBox,
            personaKeyValueIsLoading: false,
            personaIdIsLoading: false,
            personaId: personaIdArray,
            personaKeyValue: res.data,
            showEditPromoBoxModal: !this.state.showEditPromoBoxModal
          });
        });
      } else {
        this.setState({
          showEditPromoBoxModal: !this.state.showEditPromoBoxModal,
        })
      }
    }
  }
  async onClickDeletePromoBoxModal(promoBox) {
    if(promoBox === true){
      this.setState({
        showDeletePromoBoxModal: !this.state.showDeletePromoBoxModal
      })
      this.props.renderPromoCode();
    }else{

      if (!this.state.showDeletePromoBoxModal) {
        this.setState({
          showDeletePromoBoxModal: !this.state.showDeletePromoBoxModal,
          promoBoxData: promoBox
        })
      } else {
        this.setState({
          showDeletePromoBoxModal: !this.state.showDeletePromoBoxModal,
          promoBoxData: {}
        })
        
      }
    }
  }
  render() {

    const personaData = !this.state.personaIsLoading && this.state.personaData;
    const promoCodeData = !this.state.promoCodeDataIsLoading && this.state.promoCodeData;

    return (
      <div className="col-lg-12 col-md-12">
        <div className="card d-flex flex-row flex-wrap pt-3 pb-3">
          <div className="col-lg-12 col-md-12">
            <div className="header">
              <h4>
                PromoBox Management
              </h4>
              <Button onClick={() => { this.onClickAddPromoBoxModal(); }} className="btn btn-outline-info btn-info text-white float-right"><span>Add PromoBox </span> <i className="fa fa-download"></i> </Button>
            </div>
          </div>

          <div className="col-lg-12 col-md-12">
            <div className="body table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Site Id</th>
                    <th>Persona</th>
                    <th>Heading</th>
                    <th>Sub Heading</th>
                    <th>Footer</th>
                    <th>Status</th>
                    <th>Message</th>
                    <th>Promo Code</th>
                    <th>Platform</th>
                    <th>Is Active</th>
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
                        <td>{data.persona_id}</td>
                        <td>{data.heading}</td>
                        <td>{data.sub_heading}</td>
                        <td>{data.footer}</td>
                        <td>{data.status}</td>
                        <td>{data.message}</td>
                        <td>{data.promo_code}</td>
                        <td>{data.platform}</td>
                        <td>{(data.is_active) ? "ON" : "OFF"}</td>
                        <td>{data.remarks}</td>
                        <td>{formatDate(data.created_on)}</td>
                        <td>{data.modified_on && formatDate(data.modified_on)}</td>
                        <td className="" onClick={(e) => this.onClickEditPromoBoxModal(data)}> <i className="badge badge-info fa fa-pencil"> </i>  </td>
                        <td className="" onClick={(e) => this.onClickDeletePromoBoxModal(data)}> <i className="badge badge-danger fa fa-trash"> </i>  </td>
                      </tr>
                    );
                })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
         <AddPromoBoxModalCard
          key={"add_promoBox_1"}
          size={"lg"}
          title={"Add PromoBox"}
          personaData= {personaData}
          promoCodeData= {promoCodeData}
          show={this.state.showAddPromoBoxModal}
          onClose={(flag) => this.onClickAddPromoBoxModal(flag)}
        />

        <EditPromoBoxModalCard
          key={"edit_promoBox_1"}
          size={"lg"}
          title={"Edit PromoBox"}
          data={this.state.promoBoxData}
          personaData= {personaData}
          promoCodeData= {promoCodeData}
          show={this.state.showEditPromoBoxModal}
          onClose={(flag) => this.onClickEditPromoBoxModal(flag)}
        />

        <DeletePromoBoxModalCard
          key={"delete_promoBox_1"}
          size={"md"}
          title={"Edit PromoBox"}
          data={this.state.promoBoxData}
          show={this.state.showDeletePromoBoxModal}
          onClose={(flag) => this.onClickDeletePromoBoxModal(flag)}
        />

      </div>
    );
  }
}


export default PromoBoxManagementCard;
