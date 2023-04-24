import React from "react";
import LogoiCON from "../../assets/images/logo-icon.svg";
import CouponManagementCard from "../../components/Engage/CouponManagement/CouponManagementCard";
import { getCouponsMappedtoPersona, getPromoCodeData } from "../../api/Engage/PromoCode";
import {
  websiteRecordAction
} from "../../actions";
import { getCurrentUser } from "../../helper/Utils";
import { connect } from "react-redux";

class CouponManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      couponData: null,
      loading: true,
      CouponsMappedtoPersona: [],
      CouponsMappedtoPersonaIsLoading: false
    }
    this.handleRenderPromoCode = this.handleRenderPromoCode.bind(this);
  }
  componentDidMount() {
/*     const siteInputs = { siteIdInput: this.props.sessionClient.web_id };
    // const compareSiteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.compareStartDate), endDate: convertDateTOLocale(this.state.compareEndDate) };
    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }

    getPromoCodeData(siteInputs, headerConfigPassed).then((res) => {
      if (res.data.length > 0) {
        this.setState({
          loading: false,
          couponData: res.data
        });
      } else {
        this.setState({
          loading: false,
          couponData: null
        });
      }
    }, err => {
      console.log(err);
    }); */

    this.handleRenderPromoCode();
    
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.sessionClient.web_id !== this.props.sessionClient.web_id) {
      this.handleRenderPromoCode();
    }
  }

  async handleRenderPromoCode() {

    const siteInputs = { siteIdInput: this.props.sessionClient.web_id };
    // const compareSiteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.compareStartDate), endDate: convertDateTOLocale(this.state.compareEndDate) };
    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }

/* 
      
    const [couponsMappedtoPersonaData] = await Promise.all([
      getCouponsMappedtoPersona(this.props.sessionClient.web_id, headerConfigPassed)
    ])

    if (couponsMappedtoPersonaData.data !== undefined) {
      console.log("CouponsMappedtoPersona -- ", couponsMappedtoPersonaData)
      this.setState({
        CouponsMappedtoPersona: couponsMappedtoPersonaData.data,
        CouponsMappedtoPersonaIsLoading: false
      })
    } */

    siteInputs.siteIdInput !== undefined && getCouponsMappedtoPersona(siteInputs, headerConfigPassed).then((res) => {
      if (res.hasOwnProperty('data') && res.data.length > 0) {
        this.setState({
          loading: false,
          couponData: res.data
        });
      } else {
        this.setState({
          loading: false,
          couponData: null
        });
      }
    }, err => {
      console.log(err);
    });
  }

  render() {
    const { loadingPage } = this.props;
    const couponData = !this.state.loading && this.state.couponData;
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
{/*             <PageHeader
              HeaderText="Coupon Management"
              Breadcrumb={[{ name: "Dashboard" }]}
            /> */}
            <div className="row clearfix mt-4">
              <div className="col-lg-12 col-md-12 clearfix">
                <CouponManagementCard data={couponData} renderPromoCode={() => this.handleRenderPromoCode()} />
                {/* <CouponManagementCard_v2 data={personaSettingsTableData} /> */}
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  websiteRecordReducer
}) => {
  return {
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord
  }
}

export default connect(mapStateToProps, {
  websiteRecordAction
})(CouponManagement);
