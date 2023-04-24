import React from "react";
import { Button } from "react-bootstrap";
import { getBehaviourDimensionsData } from "../../../api/Engage/BehaviourDimensions";
import { formatDate } from "../../../helper/Utils";
import AddBehaviourDimensionsModalCard from "./AddBehaviourDimensionsModalCard";
import DeleteBehaviourDimensionsModalCard from "./DeleteBehaviourDimensionsModalCard";
import EditBehaviourDimensionsModalCard from "./EditBehaviourDimensionsModalCard";

class BehaviourDimensionsManagementCard extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddBehaviourDimensionsModal: false,
      showEditBehaviourDimensionsModal: false,
      showDeleteBehaviourDimensionsModal: false,
      behaviourDimensionsData: {},
      behaviourId: []
    }
  }

  onClickAddBehaviourDimensionsModal(behaviour) {
    if(behaviour === true){
      this.setState({
        showAddBehaviourDimensionsModal: !this.state.showAddBehaviourDimensionsModal
      })
      this.props.renderBehaviourDimensions();
    }else{
      this.setState({ showAddBehaviourDimensionsModal: !this.state.showAddBehaviourDimensionsModal })
    }
  }

  async onClickEditBehaviourDimensionsModal(behaviour) {
    if(behaviour === true){
      this.setState({
        showEditBehaviourDimensionsModal: !this.state.showEditBehaviourDimensionsModal
      })
      this.props.renderBehaviourDimensions();
    }else{

      if (!this.state.showEditBehaviourDimensionsModal) {
        const behaviours = await getBehaviourDimensionsData(behaviour.code);
        this.setState({
          showEditBehaviourDimensionsModal: !this.state.showEditBehaviourDimensionsModal,
          behaviourDimensionsData: behaviour,
          behaviourId: behaviours
        })
      } else {
        this.setState({
          showEditBehaviourDimensionsModal: !this.state.showEditBehaviourDimensionsModal,
          behaviourDimensionsData: {}
        })
      }
    }
  }
  async onClickDeleteBehaviourDimensionsModal(behaviour) {
    if(behaviour === true){
      this.setState({
        showDeleteBehaviourDimensionsModal: !this.state.showDeleteBehaviourDimensionsModal
      })
      this.props.renderBehaviourDimensions();
    }else{

      if (!this.state.showDeleteBehaviourDimensionsModal) {
        this.setState({
          showDeleteBehaviourDimensionsModal: !this.state.showDeleteBehaviourDimensionsModal,
          behaviourDimensionsData: behaviour
        })
      } else {
        this.setState({
          showDeleteBehaviourDimensionsModal: !this.state.showDeleteBehaviourDimensionsModal,
          behaviourDimensionsData: {}
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
                BehaviourDimensions Management
              </h4>
              <Button onClick={() => { this.onClickAddBehaviourDimensionsModal(); }} className="btn btn-outline-info btn-info text-white float-right"><span>Add BehaviourDimensions </span> <i className="fa fa-download"></i> </Button>
            </div>
          </div>

          <div className="col-lg-12 col-md-12">
            <div className="body table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Code</th>
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
                        <td>{data.code}</td>
                        <td>{data.remarks}</td>
                        <td>{formatDate(data.created_on)}</td>
                        <td>{data.modified_on && formatDate(data.modified_on)}</td>
                        <td className="" onClick={() => this.onClickEditBehaviourDimensionsModal(data)}> <i className="badge badge-info fa fa-pencil"> </i>  </td>
                        <td className="" onClick={() => this.onClickDeleteBehaviourDimensionsModal(data)}> <i className="badge badge-danger fa fa-trash"> </i>  </td>
                      </tr>
                    );
                })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <AddBehaviourDimensionsModalCard
          key={"add_behaviour"}
          size={"lg"}
          title={"Add BehaviourDimensions"}
          show={this.state.showAddBehaviourDimensionsModal}
          onClose={(flag) => this.onClickAddBehaviourDimensionsModal(flag)}
        />

        <EditBehaviourDimensionsModalCard
          key={"edit_behaviour"}
          size={"lg"}
          title={"Edit BehaviourDimensions"}
          data={this.state.behaviourDimensionsData}
          show={this.state.showEditBehaviourDimensionsModal}
          onClose={(flag) => this.onClickEditBehaviourDimensionsModal(flag)}
        />

        <DeleteBehaviourDimensionsModalCard
          key={"delete_behaviour_1"}
          size={"md"}
          title={"Delete BehaviourDimensions"}
          data={this.state.behaviourDimensionsData}
          show={this.state.showDeleteBehaviourDimensionsModal}
          onClose={(flag) => this.onClickDeleteBehaviourDimensionsModal(flag)}
        />
      </div>
    );
  }
}


export default BehaviourDimensionsManagementCard;
