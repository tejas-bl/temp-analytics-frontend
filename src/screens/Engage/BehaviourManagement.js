import React from "react";
import LogoiCON from "../../assets/images/logo-icon.svg";
import PageHeader from "../../components/PageHeader";
import BehaviourManagementCard from "../../components/Engage/BehaviourManagement/BehaviourManagementCard";
import { getBehaviourData } from "../../api/Engage/Behaviour";

class BehaviourManagement extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      behaviourData : null,
      loading: true
    }
    this.handleRenderBehaviour = this.handleRenderBehaviour.bind(this);
  }
  async componentDidMount(){
    await getBehaviourData().then((res)=>{
      this.setState({
        loading: false,
        behaviourData : res
      });
    }, err => {
      console.log(err);
    });
  }

  handleRenderBehaviour(){
    getBehaviourData().then((res)=>{
      this.setState({
        loading: false,
        behaviourData : res
      });
    }, err => {
      console.log(err);
    });
  }

  render() {
    const { loadingPage } = this.props;
    const behaviourData = !this.state.loading && this.state.behaviourData;
    if (loadingPage) {
      return (
        <div className="page-loader-wrapper">
          <div className="loader">
            <div className="m-t-30">
              <img src={LogoiCON} width="48" height="48" alt="Brandlock" />
            </div>
            <p>Please wait...</p>
          </div>
        </div>
      );
    }
    return (
      <div
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Dashboard"
              Breadcrumb={[{ name: "Dashboard" }]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12 clearfix">
                <BehaviourManagementCard data={ behaviourData } renderBehaviour={() => this.handleRenderBehaviour()}/>
                {/* <CouponManagementCard_v2 data={personaSettingsTableData} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default BehaviourManagement;
