import React from "react";
import { Button } from "react-bootstrap";
import { getBehaviourDimensionsData } from "../../../api/Engage/BehaviourDimensions";
import { formatDate } from "../../../helper/Utils";
import AddBehaviourModalCard from "./AddBehaviourModalCard";
import DeleteBehaviourModalCard from "./DeleteBehaviourModalCard";
import EditBehaviourModalCard from "./EditBehaviourModalCard";
// import DeleteBehaviourModalCard from "./DeleteBehaviourModalCard";
// import EditBehaviourModalCard from "./EditBehaviourModalCard";

class BehaviourManagementCard extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddBehaviourModal: false,
      showEditBehaviourModal: false,
      showDeleteBehaviourModal: false,
      behaviourData: {},
      behaviourDimensionData: [],
      dimensionIsLoading : true
    }
  }

  componentDidMount(){
    getBehaviourDimensionsData()
    .then(res => {
      this.setState({
        dimensionIsLoading : false,
        behaviourDimensionData : res
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  onClickAddBehaviourModal(behaviour) {
    if(behaviour === true){
      this.setState({
        showAddBehaviourModal: !this.state.showAddBehaviourModal
      })
      this.props.renderBehaviour();
    }else{
      this.setState({ showAddBehaviourModal: !this.state.showAddBehaviourModal })
    }
  }

  async onClickEditBehaviourModal(behaviour) {
    if(behaviour === true){
      this.setState({
        showEditBehaviourModal: !this.state.showEditBehaviourModal
      })
      this.props.renderBehaviour();
    }else{

      if (!this.state.showEditBehaviourModal) {
        this.setState({
          showEditBehaviourModal: !this.state.showEditBehaviourModal,
          behaviourData: behaviour,
        })
      } else {
        this.setState({
          showEditBehaviourModal: !this.state.showEditBehaviourModal,
          behaviourData: {}
        })
      }
    }
  }
  async onClickDeleteBehaviourModal(behaviour) {
    if(behaviour === true){
      this.setState({
        showDeleteBehaviourModal: !this.state.showDeleteBehaviourModal
      })
      this.props.renderBehaviour();
    }else{

      if (!this.state.showDeleteBehaviourModal) {
        this.setState({
          showDeleteBehaviourModal: !this.state.showDeleteBehaviourModal,
          behaviourData: behaviour
        })
      } else {
        this.setState({
          showDeleteBehaviourModal: !this.state.showDeleteBehaviourModal,
          behaviourData: {}
        })
        
      }
    }
  }
  render() {

    const {dimensionIsLoading, behaviourDimensionData} = this.state;
    return (
      <div className="col-lg-12 col-md-12">
        <div className="card d-flex flex-row flex-wrap pt-3 pb-3">
          <div className="col-lg-12 col-md-12">
            <div className="header">
              <h4>
                Behaviour Management
              </h4>
              <Button onClick={() => { this.onClickAddBehaviourModal(); }} className="btn btn-outline-info btn-info text-white float-right"><span>Add Behaviour </span> <i className="fa fa-download"></i> </Button>
            </div>
          </div>

          <div className="col-lg-12 col-md-12">
            <div className="body table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Behaviour</th>
                    <th>Definition</th>
                    <th>Behaviour Dimension Id</th>
                    <th>Operator</th>
                    <th>Value</th>
                    <th>Platform</th>
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
                        <td>{data.behaviour}</td>
                        <td>{data.definition}</td>
                        <td>{data.behaviour_dimension_id}</td>
                        <td>{data.operator}</td>
                        <td>{data.value}</td>
                        <td>{data.platform}</td>
                        <td>{data.remarks}</td>
                        <td>{formatDate(data.created_on)}</td>
                        <td>{data.modified_on &&  formatDate(data.modified_on)}</td>
                        <td className="" onClick={() => this.onClickEditBehaviourModal(data)}> <i className="badge badge-info fa fa-pencil"> </i>  </td>
                        <td className="" onClick={() => this.onClickDeleteBehaviourModal(data)}> <i className="badge badge-danger fa fa-trash"> </i>  </td>
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
                        <td>{data.behaviour}</td>
                        <td>{data.description}</td>
                        <td>{data.expiry}</td>
                        <td>{data.orderValue}</td>
                        <td>{data.behaviourType}</td>
                        <td className="" onClick={() => this.onClickEditBehaviourModal(data)}> <i className="badge badge-info fa fa-pencil"> </i>  </td>
                        <td className="" onClick={() => this.onClickDeleteBehaviourModal(data)}> <i className="badge badge-danger fa fa-trash"> </i>  </td>
                      </tr>
                    );
                  })} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <AddBehaviourModalCard
          key={"add_behaviour"}
          size={"lg"}
          title={"Add Behaviour"}
          behaviourDimensionData= {!dimensionIsLoading && behaviourDimensionData}
          show={this.state.showAddBehaviourModal}
          onClose={(flag) => this.onClickAddBehaviourModal(flag)}
        />

         <EditBehaviourModalCard
          key={"edit_behaviour"}
          size={"lg"}
          title={"Edit Behaviour"}
          data={this.state.behaviourData}
          behaviourDimensionData= {!dimensionIsLoading && behaviourDimensionData}
          show={this.state.showEditBehaviourModal}
          onClose={(flag) => this.onClickEditBehaviourModal(flag)}
        />

        <DeleteBehaviourModalCard
          key={"delete_behaviour_1"}
          size={"md"}
          title={"Delete Behaviour"}
          data={this.state.behaviourData}
          show={this.state.showDeleteBehaviourModal}
          onClose={(flag) => this.onClickDeleteBehaviourModal(flag)}
        />


      </div>
    );
  }
}


export default BehaviourManagementCard;
