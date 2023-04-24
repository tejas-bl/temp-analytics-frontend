import React from "react";
import LogoiCON from "../../assets/images/logo-icon.svg";
import PageHeader from "../../components/PageHeader";
import PromoBoxManagementCard from "../../components/Engage/PromoBoxManagement/PromoBoxManagementCard";
import { getPromoBoxData } from "../../api/Engage/PromoBox";

class PromoBoxManagement extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      promoBoxData : null,
      loading: true
    }
    this.handleRenderPromoCode = this.handleRenderPromoCode.bind(this);
  }
  componentDidMount(){

    getPromoBoxData().then((res)=>{
      this.setState({
        loading: false,
        promoBoxData : res
      });
    }, err => {
      console.log(err);
    });
  }

  handleRenderPromoCode(){
    getPromoBoxData().then((res)=>{
      this.setState({
        loading: false,
        promoBoxData : res
      });
    }, err => {
      console.log(err);
    });
  }

  render() {
    const { loadingPage } = this.props;
    const promoBoxData = !this.state.loading && this.state.promoBoxData;
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
                <PromoBoxManagementCard data={ promoBoxData } renderPromoCode={() => this.handleRenderPromoCode()}/>
                {/* <PromoBoxManagementCard_v2 data={personaSettingsTableData} /> */}
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default PromoBoxManagement;
