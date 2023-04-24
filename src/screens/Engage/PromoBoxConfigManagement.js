import React from "react";
import LogoiCON from "../../assets/images/logo-icon.svg";
import PageHeader from "../../components/PageHeader";

import { getPromoBoxConfigData } from "../../api/Engage/PromoBoxConfig";
import PromoBoxConfigManagementCard from "../../components/Engage/PromoBoxConfigManagement/PromoBoxConfigManagementCard";

class PromoBoxConfigManagement extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      promoBoxConfigData : null,
      loading: true
    }
    this.handleRenderPromoBoxConfig = this.handleRenderPromoBoxConfig.bind(this);
  }
  componentDidMount(){
    getPromoBoxConfigData().then((res)=>{
      this.setState({
        loading: false,
        promoBoxConfigData : res
      });
    }, err => {
      console.log(err);
    });
  }

  handleRenderPromoBoxConfig(){
    getPromoBoxConfigData().then((res)=>{
      this.setState({
        loading: false,
        promoBoxConfigData : res
      });
    }, err => {
      console.log(err);
    });
  }

  render() {
    const { loadingPage } = this.props;
    const promoBoxConfigData = !this.state.loading && this.state.promoBoxConfigData;
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
                <PromoBoxConfigManagementCard data={ promoBoxConfigData } renderPromoBoxConfig={() => this.handleRenderPromoBoxConfig()}/>
                {/* <CouponManagementCard_v2 data={promoBoxConfigSettingsTableData} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default PromoBoxConfigManagement;
