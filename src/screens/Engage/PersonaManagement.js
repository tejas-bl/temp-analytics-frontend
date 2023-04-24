import React from "react";
import LogoiCON from "../../assets/images/logo-icon.svg";
import PageHeader from "../../components/PageHeader";
import PersonaManagementCard from "../../components/Engage/PersonaManagement/PersonaManagementCard";
import { getPersonaData } from "../../api/Engage/Persona";

class PersonaManagement extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      personaData : null,
      loading: true
    }
    this.handleRenderPersona = this.handleRenderPersona.bind(this);
  }
  componentDidMount(){
    getPersonaData().then((res)=>{
      this.setState({
        loading: false,
        personaData : res
      });
    }, err => {
      console.log(err);
    });
  }

  handleRenderPersona(){
    getPersonaData().then((res)=>{
      this.setState({
        loading: false,
        personaData : res
      });
    }, err => {
      console.log(err);
    });
  }

  render() {
    const { loadingPage } = this.props;
    const personaData = !this.state.loading && this.state.personaData;
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
                <PersonaManagementCard data={ personaData } renderPersona={() => this.handleRenderPersona()}/>
                {/* <CouponManagementCard_v2 data={personaSettingsTableData} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default PersonaManagement;
