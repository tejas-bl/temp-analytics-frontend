import React from "react";
import LogoiCON from "../../assets/images/logo-icon.svg";
import PageHeader from "../../components/PageHeader";
import { getBehaviourDimensionsData } from "../../api/Engage/BehaviourDimensions";
import BehaviourDimensionsManagementCard from "../../components/Engage/BehaviourDimensionManagement/BehaviourDimensionsManagementCard";

class BehaviourDimensionsManagement extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      behaviourData : null,
      loading: true
    }
    this.handleRenderBehaviourDimensions = this.handleRenderBehaviourDimensions.bind(this);
  }
  componentDidMount(){
    getBehaviourDimensionsData().then((res)=>{
      this.setState({
        loading: false,
        behaviourData : res
      });
    }, err => {
      console.log(err);
    });
  }

  handleRenderBehaviourDimensions(){
    getBehaviourDimensionsData().then((res)=>{
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
                <BehaviourDimensionsManagementCard data={ behaviourData } renderBehaviourDimensions={() => this.handleRenderBehaviourDimensions()}/>
                {/* <CouponManagementCard_v2 data={personaSettingsTableData} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default BehaviourDimensionsManagement;
