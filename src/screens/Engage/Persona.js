import React from "react";
import { connect } from "react-redux";
import LogoiCON from "../../assets/images/logo-icon.svg";


import PageHeader from "../../components/PageHeader";
import {
  toggleMenuArrow,
  onPressTopProductDropDown,
  loadSparcleCard,
  onPressReferralsDropDown,
  onPressRecentChatDropDown,
  onPressDataManagedDropDown,
  facebookProgressBar,
  twitterProgressBar,
  affiliatesProgressBar,
  searchProgressBar,
} from "../../actions";
import PersonaListTable from "../../components/Engage/PersonaListTable";
import { personaRecoveredRevData, personaTable } from "../../Data/EngagePersonaData";
import PersonaRecoveredRevenue from "../../components/Engage/PersonaRecoveredRevenue";
import PersonaDetailCard from "../../components/Engage/PersonaDetailCard";

class Persona extends React.Component {
  constructor(props) {
    super(props);
    this.handlePersonaDetails = this.handlePersonaDetails.bind(this);
    this.state = {
      loadPersonaDetails: false,
      title: "",
      message: 'Click a Persona to see it\'s details',
      personaRecoveredRevState: [],
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadDataCard();
    this.setState({
      personaRecoveredRevState: [...personaRecoveredRevData],
    });
  }
  async loadDataCard() {
    const { personaRecoveredRevState } = this.state;
    var allCardData = personaRecoveredRevState;
    personaRecoveredRevState.map((data, i) => {
      var uData = [];
      data.sparklineData.data.map((d, j) => {
        uData[j] = Math.floor(Math.random() * 10) + 1;
      });
      allCardData[i].sparklineData.data = [...uData];
    });
    this.setState({ cardData: [...allCardData] });
  }

  handlePersonaDetails(flag, title) {
    this.setState({
      loadPersonaDetails: false,
      message: "Loading Please Wait"
    });
    setTimeout(() => {
      this.setState({
        loadPersonaDetails: flag,
        title
      })
    }, 1000);
  }

  render() {
    const { loadingPage } = this.props;
    const { personaRecoveredRevState } = this.state;
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
              <div className="col-lg-8 col-md-8">
                <PersonaListTable handlePersonaDetails={this.handlePersonaDetails} data={personaTable} />
              </div>
              <div className="col-lg-4 col-md-4">
                {personaRecoveredRevState.map((data, i) => (
                  <PersonaRecoveredRevenue
                    index={i}
                    key={data.heading}
                    Heading={[<h6>Recovered Revenue</h6>]}
                    Money={[<h3 className="pb-0 m-b-60 m-t-60"><strong>$21,215,455</strong></h3>]}
                    PerText="How was it calculated?"
                    Days={[<span className="smallText pb-0">(30 days)</span>]}
                    isRandomUpdate={false}
                    // Data={data.sparklineData}
                    mainData={data.sparklineData.data}
                    chartColor={"#769ccd"}
                    ContainerClass="col-lg-12 col-md-12 col-sm-12 p-0"
                    alignText="text-center"
                    BlockHeight={45}
                  />
                ))}

                {/* <PersonaRecoveredRevenue className="dbCard" mainData={data.sparklineData.data} data={personaRecoveredRevState}/> */}
              </div>

              <div className="col-lg-12 col-md-12 pl-0 pr-0">
                {this.state.loadPersonaDetails ? <PersonaDetailCard title={this.state.title} /> : <div className="col-lg-12 col-md-12 text-center"><span className="text-muted badge">{this.state.message} </span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  loginReducer,
  navigationReducer,
  analyticalReducer,
}) => ({
  email: loginReducer.email,
  menuArrowToggle: navigationReducer.menuArrowToggle,
  sparkleCardData: analyticalReducer.sparkleCardData,
  topProductDropDown: analyticalReducer.topProductDropDown,
  referralsDropDown: analyticalReducer.referralsDropDown,
  recentChatDropDown: analyticalReducer.recentChatDropDown,
  facebookShowProgressBar: analyticalReducer.facebookShowProgressBar,
  twitterShowProgressBar: analyticalReducer.twitterShowProgressBar,
  affiliatesShowProgressBar: analyticalReducer.affiliatesShowProgressBar,
  searchShowProgressBar: analyticalReducer.searchShowProgressBar,
  loadingPage: analyticalReducer.loadingPage,
});

export default connect(mapStateToProps, {
  toggleMenuArrow,
  loadSparcleCard,
  onPressTopProductDropDown,
  onPressReferralsDropDown,
  onPressRecentChatDropDown,
  onPressDataManagedDropDown,
  facebookProgressBar,
  twitterProgressBar,
  affiliatesProgressBar,
  searchProgressBar,
})(Persona);
