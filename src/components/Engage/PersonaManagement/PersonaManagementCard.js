import React from "react";
import { Button } from "react-bootstrap";
import { getPersonaData } from "../../../api/Engage/Persona";
import { formatDate } from "../../../helper/Utils";
import AddPersonaModalCard from "./AddPersonaModalCard";
import DeletePersonaModalCard from "./DeletePersonaModalCard";
import EditPersonaModalCard from "./EditPersonaModalCard";

class PersonaManagementCard extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddPersonaModal: false,
      showEditPersonaModal: false,
      showDeletePersonaModal: false,
      personaData: {},
      personaId: []
    }
  }

  onClickAddPersonaModal(persona) {
    if(persona === true){
      this.setState({
        showAddPersonaModal: !this.state.showAddPersonaModal
      })
      this.props.renderPersona();
    }else{
      this.setState({ showAddPersonaModal: !this.state.showAddPersonaModal })
    }
  }

  async onClickEditPersonaModal(persona) {
    if(persona === true){
      this.setState({
        showEditPersonaModal: !this.state.showEditPersonaModal
      })
      this.props.renderPersona();
    }else{

      if (!this.state.showEditPersonaModal) {
        const personas = await getPersonaData(persona.code);
        this.setState({
          showEditPersonaModal: !this.state.showEditPersonaModal,
          personaData: persona,
          personaId: personas
        })
      } else {
        this.setState({
          showEditPersonaModal: !this.state.showEditPersonaModal,
          personaData: {}
        })
      }
    }
  }
  async onClickDeletePersonaModal(persona) {
    if(persona === true){
      this.setState({
        showDeletePersonaModal: !this.state.showDeletePersonaModal
      })
      this.props.renderPersona();
    }else{

      if (!this.state.showDeletePersonaModal) {
        this.setState({
          showDeletePersonaModal: !this.state.showDeletePersonaModal,
          personaData: persona
        })
      } else {
        this.setState({
          showDeletePersonaModal: !this.state.showDeletePersonaModal,
          personaData: {}
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
                Persona Management
              </h4>
              <Button onClick={() => { this.onClickAddPersonaModal(); }} className="btn btn-outline-info btn-info text-white float-right"><span>Add Persona </span> <i className="fa fa-download"></i> </Button>
            </div>
          </div>

          <div className="col-lg-12 col-md-12">
            <div className="body table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Persona</th>
                    <th>Short Code</th>
                    <th>Remarks</th>
                    <th>Created On</th>
                    <th>Modified On</th>
                  </tr>
                </thead>
                <tbody>
                  { this.props.data && this.props.data.map((data, i) => {
                     return (
                      <tr key={i}>
                        <td className="text-center">
                          {data.id}
                          {/* <div className="fancy-checkbox">
                            <label>
                              <input type="checkbox" />
                              <span></span>
                            </label>
                          </div> */}
                        </td>
                        <td>{data.name}</td>
                        <td>{data.short_code}</td>
                        <td>{data.remarks}</td>
                        <td>{formatDate(data.created_on)}</td>
                        <td>{data.modified_on &&  formatDate(data.modified_on)}</td>
                        <td className="" onClick={() => this.onClickEditPersonaModal(data)}> <i className="badge badge-info fa fa-pencil"> </i>  </td>
                        <td className="" onClick={() => this.onClickDeletePersonaModal(data)}> <i className="badge badge-danger fa fa-trash"> </i>  </td>
                      </tr>
                    );
                })
                  }
                  
                  {/* {this.props.data.map((data, i) => {
                    return (
                      <tr key={i}>
                        <td scope="row" className="text-center">
                          <div className="fancy-checkbox">
                            <label>
                              <input type="checkbox" />
                              <span></span>
                            </label>
                          </div>
                        </td>
                        <td>{data.persona}</td>
                        <td>{data.description}</td>
                        <td>{data.expiry}</td>
                        <td>{data.orderValue}</td>
                        <td>{data.personaType}</td>
                        <td className="" onClick={() => this.onClickEditPersonaModal(data)}> <i className="badge badge-info fa fa-pencil"> </i>  </td>
                        <td className="" onClick={() => this.onClickDeletePersonaModal(data)}> <i className="badge badge-danger fa fa-trash"> </i>  </td>
                      </tr>
                    );
                  })} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <AddPersonaModalCard
          key={"add_persona"}
          size={"lg"}
          title={"Add Persona"}
          show={this.state.showAddPersonaModal}
          onClose={(flag) => this.onClickAddPersonaModal(flag)}
        />

         <EditPersonaModalCard
          key={"edit_persona"}
          size={"lg"}
          title={"Edit Persona"}
          data={this.state.personaData}
          show={this.state.showEditPersonaModal}
          onClose={(flag) => this.onClickEditPersonaModal(flag)}
        />

        <DeletePersonaModalCard
          key={"delete_persona_1"}
          size={"md"}
          title={"Delete Persona"}
          data={this.state.personaData}
          show={this.state.showDeletePersonaModal}
          onClose={(flag) => this.onClickDeletePersonaModal(flag)}
        />


      </div>
    );
  }
}


export default PersonaManagementCard;
