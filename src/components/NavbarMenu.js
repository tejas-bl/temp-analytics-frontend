import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Nav, Toast } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
  websiteRecordAction,
  setWebsiteRecordsAction,
  setPersonaRecordsAction,
  onLoggedin
} from "../actions";
import Logo from "../assets/images/logo.svg";
import spider from "../assets/images/spider.png";
import LogoWhite from "../assets/images/logo-white.svg";
import UserImage from "../assets/images/login_user.png";
import { getCurrentUser, getWebsiteData } from '../helper/Utils';
import { logoutUserAsync } from "../api/authentication";
import Select from 'react-dropdown-select';
import { getWebsitesRecord, getWebsitesRecordById } from "../api/shieldDashboard";
import { getEngagePersona } from "../api/Engage/OldDB";

class NavbarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.state = {
      siteIdInput: this.props.sessionClient.web_id,
      websitesRecord: {},
      websitesRecordLoading: true,
      websitesRecordOption: [],
      currentUser: null,
      userLogo: null,
      currentUserLogo: null,
      dashboardNavStatus: {
        sheildStatus: '',
        engageStatus: ''
      },
      engageStatus: '',
      extension_trigger: '',
      hesitant_trigger: '',
      prediction_trigger: '',
      whynot_trigger: '',
      wrong_coupon: ''
    }
    this.handleSelectOptions = this.handleSelectOptions.bind(this);
  }


  handleSelectOptions(websiteRecord) {
    let websiteRecordOpt = [];
    websiteRecord && websiteRecord.map((d) => {
      return websiteRecordOpt.push({
        web_id: d.web_id,
        web_url: d.web_url,
      });
    })

    return websiteRecordOpt;
  }

  async logoutUser() {
    const logout = await logoutUserAsync();
    if (logout && (logout.data.statuscode === 200 || logout.data.statuscode === 400)) {
      this.props.onLoggedin({ status: false });
      this.props.history.push({ pathname: '/login' });
      this.props.history.go();
    }
  }

  state = {
    linkupdate: false,
  };
  async componentDidMount() {
    this.props.tostMessageLoad(true);
    let currentUser = getCurrentUser();
    if (currentUser && currentUser.hasOwnProperty('data')) {
      currentUser = currentUser.data.data;
    }
    const headerConfig = {
      headers: {
        Authorization: currentUser && `Bearer ${currentUser.refresh_token}`,
      }
    }
    const getPersonaRecordData = await getEngagePersona(headerConfig);
    await this.props.setPersonaRecordsAction(getPersonaRecordData.data);    
    const getWebsiteDataFromLocalStorage = await getWebsiteData();
    if (getWebsiteDataFromLocalStorage !== null && getWebsiteDataFromLocalStorage.length > 0) {
      const localStorageWebsiteData = getWebsiteDataFromLocalStorage;
      await this.props.setWebsiteRecordsAction(localStorageWebsiteData);
      let userLogo = false;
      let defaultWebsite = null;
      if (currentUser.roles === 'superadmin' || currentUser.roles === 'admin') {
        if (currentUser.web_account_id === 0) {
          defaultWebsite = localStorageWebsiteData.find(item => item.web_url === "myclothing.com")
          userLogo = defaultWebsite.web_logo
        } else {
          if (localStorageWebsiteData !== undefined && localStorageWebsiteData !== null && localStorageWebsiteData.length > 0 && localStorageWebsiteData[0].hasOwnProperty("web_logo") && localStorageWebsiteData[0].web_logo !== null) {
            userLogo = localStorageWebsiteData[0].web_logo
          }
        }
      } else {
        if (localStorageWebsiteData !== undefined && localStorageWebsiteData !== null && localStorageWebsiteData.length > 0 && localStorageWebsiteData[0].hasOwnProperty("web_logo") && localStorageWebsiteData[0].web_logo !== null) {
          userLogo = localStorageWebsiteData[0].web_logo
        }
      }
      this.setState({
        websitesRecord: localStorageWebsiteData,
        websitesRecordLoading: false,
        websitesRecordOption: localStorageWebsiteData,
        currentUser: currentUser,
        userLogo: userLogo,
        currentUserLogo: currentUser !== null && currentUser.hasOwnProperty("logo") && currentUser.logo !== null ? currentUser.logo : false
      })

    } else {
      try {
        const getWebsitesRecordData = await getWebsitesRecord(currentUser.refresh_token, headerConfig);
        if (getWebsitesRecordData.status !== 200) {
          const websiteRecordOptionsArray = [];
          getWebsitesRecordData.data.map(d => {
            websiteRecordOptionsArray.push(d);
          })
          await this.props.setWebsiteRecordsAction(websiteRecordOptionsArray);
          let userLogo = false;
          let defaultWebsite = null;
          if (currentUser.roles === 'superadmin' || currentUser.roles === 'admin') {
            if (currentUser.web_account_id === 0) {
              defaultWebsite = websiteRecordOptionsArray.find(item => item.web_url === "myclothing.com")
              userLogo = defaultWebsite.web_logo
            } else {
              if (websiteRecordOptionsArray !== undefined && websiteRecordOptionsArray !== null && websiteRecordOptionsArray.length > 0 && websiteRecordOptionsArray[0].hasOwnProperty("web_logo") && websiteRecordOptionsArray[0].web_logo !== null) {
                userLogo = websiteRecordOptionsArray[0].web_logo
              }
            }
          } else {
            if (websiteRecordOptionsArray !== undefined && websiteRecordOptionsArray !== null && websiteRecordOptionsArray.length > 0 && websiteRecordOptionsArray[0].hasOwnProperty("web_logo") && websiteRecordOptionsArray[0].web_logo !== null) {
              userLogo = websiteRecordOptionsArray[0].web_logo
            }
          }
          this.setState({
            websitesRecord: this.props.websiteRecord,
            websitesRecordLoading: false,
            websitesRecordOption: websiteRecordOptionsArray,
            currentUser: currentUser,
            userLogo: userLogo,
            currentUserLogo: currentUser !== null && currentUser.hasOwnProperty("logo") && currentUser.logo !== null ? currentUser.logo : false
          })
        }
      } catch (err) {
        return;
      }
    }
    const getWebsitesRecordByIdData = await getWebsitesRecordById(this.props.sessionClient.web_id, headerConfig);


    var res = window.location.pathname;
    res = res.split("/");
    res = res.length > 4 ? res[4] : "/";
    const { activeKey } = this.props;
    this.activeMenutabwhenNavigate(activeKey);
    if (getWebsitesRecordByIdData && getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length > 0) {
      await this.getDashboardMenuStatus(getWebsitesRecordByIdData.data[0]);
    }
  }

  async componentDidUpdate(prevProps) {

    if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
      let currentUser = getCurrentUser();
      if (currentUser && currentUser.hasOwnProperty('data')) {
        currentUser = currentUser.data.data;
      }
      const headerConfig = {
        headers: {
          Authorization: currentUser && `Bearer ${currentUser.refresh_token}`,
        }
      }

      const getWebsitesRecordByIdData = await getWebsitesRecordById(this.props.sessionClient.web_id, headerConfig)
      await this.getDashboardMenuStatus(getWebsitesRecordByIdData.data[0]);

    }
  }

  activeMenutabwhenNavigate(activeKey) {
    if (
      activeKey === "shield/dashboard"
    ) {
      this.activeMenutabContainer("ShieldContainer");
    }
    else if (
      activeKey === "/engage/dashboard"
    ) {
      this.activeMenutabContainer("EngageContainer");
    }
  }

  // componentWillReceiveProps(){
  //   this.setState({
  //     linkupdate:!this.state.linkupdate
  //   })
  // }

  activeMenutabContainer(id) {
    // var parents = document.getElementById("main-menu");
    var activeMenu = document.getElementById(id);
    // for (let index = 0; index < parents.children.length; index++) {
    //   if (parents.children[index].id !== id) {
    //     parents.children[index].classList.remove("active");
    //     parents.children[index].children[1].classList.remove("in");
    //   }
    // }
    setTimeout(() => {
      activeMenu.classList.toggle("active");
      // activeMenu.children[1].classList.toggle("in");
    }, 10);
  }

  async getDashboardMenuStatus(currentSite) {

    // Getting Engage status
    if (currentSite.engage && currentSite.engage_ab === false) {
      this.state.dashboardNavStatus.engageStatus = 'Post Phase';
    } else if (currentSite.engage && currentSite.engage_ab) {
      this.state.dashboardNavStatus.engageStatus = 'POC Phase';
    } else {
      this.state.dashboardNavStatus.engageStatus = 'Pre Phase';
    }
    //Ends here

    // Getting Sheild status
    if (currentSite.ab_status && currentSite.ab_perc === 100) {
      this.setState({
        dashboardNavStatus: {
          sheildStatus: `${this.props.shopperRecord.shield} - Live for 100%`
        }
      })
    } else if (currentSite.ab_status && currentSite.ab_perc !== 0) {
      const controllGrp = (100 - Math.abs(currentSite.ab_perc));
      this.setState({
        dashboardNavStatus: {
          sheildStatus: `${this.props.shopperRecord.shield} Split - [${Math.abs(currentSite.ab_perc)} - ${controllGrp}]`
        }
      })
    } else {
      this.setState({
        dashboardNavStatus: {
          sheildStatus: ``
        }
      })
    }
    //Ends here

    let engageStatus = '';
    let extension_trigger = '';
    let hesitant_trigger = '';
    let prediction_trigger = '';
    let whynot_trigger = '';
    let wrong_coupon = '';

    if ((currentSite.engage === null || currentSite.engage === undefined || currentSite.engage === false) && (currentSite.ab_status === false || currentSite.ab_status === null || currentSite.ab_status === '')) {
      engageStatus = 'All Shoppers Off';
    } else {
      /* if ((currentSite.engage === true && currentSite.engage_bucket_split !== null) || (currentSite.ab_status === true && currentSite.ab_perc === 100)) {
        if (currentSite.engage_bucket_split === 100) {
          engageStatus = 'Active for 100% of sessions';
        }
      } */

      if (currentSite.extension_trigger === true && currentSite.extension_trigger_split !== null) {
        if (currentSite.extension_trigger_split === 100) {
          extension_trigger = `${this.props.shopperRecord['e-ei']} - Live for 100%`;
        } else {
          const split = (100 - currentSite.extension_trigger_split);
          extension_trigger = `${this.props.shopperRecord['e-ei']} Split - [${currentSite.extension_trigger_split} - ${split}]`;
        }
      } else {
        extension_trigger = "Off";
      }

      if (currentSite.hesitant_trigger === true && currentSite.hesitant_trigger_split !== null) {
        if (currentSite.hesitant_trigger_split === 100) {
          hesitant_trigger = `${this.props.shopperRecord.ti3} - Live for 100%`;
        } else {
          const split = (100 - currentSite.hesitant_trigger_split);
          hesitant_trigger = `${this.props.shopperRecord.ti3} Split - [${currentSite.hesitant_trigger_split} - ${split}]`;
        }
      } else {
        hesitant_trigger = "Off";
      }

      if (currentSite.prediction_trigger === true && currentSite.prediction_trigger_split !== null) {
        if (currentSite.prediction_trigger_split === 100) {
          prediction_trigger = `${this.props.shopperRecord.epr} - Live for 100%`;
        } else {
          const split = (100 - currentSite.prediction_trigger_split);
          prediction_trigger = `${this.props.shopperRecord.epr} Split - [${currentSite.prediction_trigger_split} - ${split}]`;
        }
      } else {
        prediction_trigger = "Off";
      }

      if (currentSite.whynot_trigger === true && currentSite.why_not_trigger_split !== null) {
        if (currentSite.why_not_trigger_split === 100) {
          whynot_trigger = `${this.props.shopperRecord.cs} - Live for 100%`;
        } else {
          const split = (100 - currentSite.why_not_trigger_split);
          whynot_trigger = `${this.props.shopperRecord.cs} Split - [${currentSite.why_not_trigger_split} - ${split}]`;
        }
      } else {
        whynot_trigger = "Off";
      }

      if (currentSite.wrong_coupon === true && currentSite.wrong_coupon_trigger_split !== null) {
        if (currentSite.wrong_coupon_trigger_split === 100) {
          wrong_coupon = `${this.props.shopperRecord.wc} - Live for 100%`;
        } else {
          const split = (100 - currentSite.wrong_coupon_trigger_split);
          wrong_coupon = `${this.props.shopperRecord.wc} Split - [${currentSite.wrong_coupon_trigger_split} - ${split}]`;
        }
      } else {
        wrong_coupon = "Off";
      }
    }

    this.setState({
      engageStatus: engageStatus,
      extension_trigger: extension_trigger,
      hesitant_trigger: hesitant_trigger,
      prediction_trigger: prediction_trigger,
      whynot_trigger: whynot_trigger,
      wrong_coupon: wrong_coupon
    });
  }

  render() {
    const {
      themeColor,
      sideMenuTab,
      isToastMessage,
      activeKey
    } = this.props;

    const { websitesRecordOption, currentUser, userLogo, currentUserLogo } = this.state;
    document.body.classList.add(themeColor);
    const isUserLoggedIn = getCurrentUser();
    if (isUserLoggedIn === undefined || isUserLoggedIn === null || isUserLoggedIn.hasOwnProperty('data') === false) {
      return (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      );
    }
    const user = isUserLoggedIn.data.data;
    return (
      <div>
        {isToastMessage ? (
          <Toast
            id="toast-container"
            show={isToastMessage}
            onClose={() => {
              this.props.tostMessageLoad(false);
            }}
            className="toast-info toast-top-right"
            autohide={true}
            delay={5000}
          >
            {/* <Toast.Header className="toast-info mb-0">
              Hello, welcome to Brandlock, a unique admin Template.
            </Toast.Header> */}
          </Toast>
        ) : null}
        <nav className="navbar navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-btn">
              <button
                className="btn-toggle-offcanvas"
                onClick={() => {
                  this.props.onPressSideMenuToggle();
                }}
              >
                <i className="lnr lnr-menu fa fa-bars"></i>
              </button>
            </div>

            <div className="navbar-brand">
              <a href="dashboard">
                <img
                  src={
                    document.body.classList.contains("full-dark")
                      ? LogoWhite
                      : Logo
                  }
                  alt="Brandlock Logo"
                  className="img-responsive logo"
                />
              </a>
            </div>

            <div className="navbar-right">
              {websitesRecordOption && websitesRecordOption.length > 0 &&
                <form id="navbar-search" className="navbar-form search-form col-md-4">

                  <Select
                    placeholder="Select Website"
                    className="col-md-12"
                    valueField="web_id"
                    labelField="web_url"
                    searchBy="web_url"
                    searchable
                    style={{ paddingLeft: "15px", borderRadius: "1000px" }}
                    multi={false}
                    closeOnSelect={true}
                    backspaceDelete={true}
                    clearOnSelect={true}
                    values={[!this.state.websitesRecordLoading &&
                      websitesRecordOption.find((opt) => {
                        if (this.state.websitesRecord !== undefined && this.state.websitesRecord !== null && this.state.websitesRecord.length > 0) {
                          if (user.roles === 'superadmin' || user.roles === 'admin') {
                            if (user.web_account_id !== 0) {
                              return opt.web_url === this.state.websitesRecord[0].web_url
                            } else {
                              return opt.web_url === 'myclothing.com'
                            }
                          } else {
                            return opt.web_url === this.state.websitesRecord[0].web_url
                          }
                        }
                      })]}
                    options={!this.state.websitesRecordLoading &&
                      websitesRecordOption}
                    onChange={(e) => {
                      if (e.length !== 0) {
                        this.props.websiteRecordAction(e[0])
                        this.setState({
                          siteIdInput: parseInt(e[0].web_id),
                          userLogo: e[0].web_logo
                        })
                      }
                    }}
                  />

                  {/* <select className="form-control navbar-form" value={this.state.siteIdInput} onChange={(e) => {
                this.props.websiteRecordAction(parseInt(e.target.value))
                this.setState({
                  siteIdInput: parseInt(e.target.value)
                })
              }}>
                {
                  !this.state.websitesRecordLoading &&
                  websitesRecord.map((data, i) => {
                    return <option key={data.web_id} value={data.web_id}>{data.web_url}</option>
                  })
                }
              </select> */}
                </form>
              }
              {!websitesRecordOption.length > 0 &&
                <form id="navbar-search" className="navbar-form search-form col-md-4" style={{ filter: "blur(4px)" }}>
                  <Select
                    placeholder="Select Website"
                    className="col-md-12"
                    style={{ paddingLeft: "15px", borderRadius: "1000px" }} />
                </form>
              }

              <div id="navbar-menu">
                <ul className="nav navbar-nav">
                  <li>
                    <a title="Logout" style={{ cursor: "pointer" }} onClick={() => { this.logoutUser() }} className="icon-menu">
                      <i className="icon-power"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div id="left-sidebar" className="sidebar" style={{ zIndex: 9 }}>
          <div className="sidebar-scroll">
            <div className="user-account">

              {currentUserLogo !== null && currentUserLogo !== false ?
                <img
                  src={currentUserLogo}
                  className="user-photo currentUser"
                  alt="User Profile Picture"
                /> : userLogo !== null ? <img
                  src={userLogo}
                  className="user-photo userLogo"
                  alt="User Profile Picture"
                /> : currentUserLogo === false ? <img
                  src={UserImage}
                  className="user-photo userImage"
                  alt="User Profile Picture"
                /> : ""}
              <Dropdown className="welcomeUser">
                <span>Welcome, </span>
                <Dropdown.Toggle
                  variant="none"
                  as="a"
                  id="dropdown-basic"
                  className="user-name"
                >
                  <strong>{currentUser !== null && currentUser.firstName}</strong>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-right account">
                  <Dropdown.Item>
                    <Link to="/user/edit-profile">
                      My Profile
                    </Link>
                  </Dropdown.Item>
                  <li className="divider"></li>
                  <Dropdown.Item onClick={() => { this.logoutUser() }}>
                    {" "}
                    <i className="icon-power"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <hr />
              {/* <ul className="row list-unstyled">
                <li className="col-4">
                  <small>Sales</small>
                  <h6>456</h6>
                </li>
                <li className="col-4">
                  <small>Order</small>
                  <h6>1350</h6>
                </li>
                <li className="col-4">
                  <small>Revenue</small>
                  <h6>$2.13B</h6>
                </li>
              </ul> */}
            </div>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <Link className={sideMenuTab[0] ? "nav-link active menu-icon" : "nav-link menu-icon"} to="/dashboard" onClick={() => {
                  this.props.onPressSideMenuTab(0);
                }}>  <i className="icon-home"></i>  </Link>
              </li>
              {/* <li className="nav-item menu-items">
                <a
                  className={sideMenuTab[1] ? "nav-link active menu-icon" : "nav-link menu-icon"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(1);
                    this.props.history.push({ pathname: '/shield/dashboard' });
                  }}
                >
                  Shield
                </a>
              </li> */}
              <li className="nav-item menu-items">
                <a
                  className={sideMenuTab[1] ? "nav-link active menu-icon" : "nav-link menu-icon"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(2);
                    this.props.history.push({ pathname: '/engage/persona' });
                  }}
                >
                  Shopper Group
                </a>
              </li>
              {user.roles === "superadmin" &&
                <li className="nav-item">
                  <Link className={sideMenuTab[4] ? "nav-link active menu-icon" : "nav-link menu-icon"} to="/user/lists" onClick={() => {
                    this.props.onPressSideMenuTab(4);
                  }}>  <i className="icon-settings"></i>  </Link>
                </li>
              }
            </ul>
            <div className="tab-content p-l-0 p-r-0">
              <div
                className={sideMenuTab[0] ? "tab-pane active show" : "tab-pane"}
                id="menu"
              >
                <Nav id="shield-sidebar-nav" className="sidebar-nav">
                  <ul id="shield-menu" className="metismenu">
                    {/*                     <li id="ShieldContainer" className="li-status">
                      <a className="a-status">
                        <i className="fa fa-shield" style={{ display: "none" }}></i>
                        <span className="menu-status"><strong>Shield Status</strong>
                          <br />
                          {this.state.dashboardNavStatus.sheildStatus}
                        </span>
                      </a>
                    </li> */}
                    <li id="EngageContainer" className="li-status">
                      <a className="a-status">
                        <span className="menu-status">
                          <strong>Shopper Group - Live Status</strong>
                          <br />
                        </span>

                    {/*     <span>{this.state.engageStatus}
                          <br />
                        </span> */}

                        <span className="persona-status">{this.state.dashboardNavStatus.sheildStatus}
                          <br />
                        </span>

                        {this.state.extension_trigger !== 'Off' &&
                          <span className="persona-status">{this.state.extension_trigger}<br /></span>
                        }

                        {this.state.whynot_trigger !== 'Off' &&
                          <span className="persona-status">{this.state.whynot_trigger}<br /></span>
                        }


                        {this.state.hesitant_trigger !== 'Off' &&
                          <span className="persona-status">{this.state.hesitant_trigger}
                            <br />
                          </span>

                        }


                        {this.state.prediction_trigger !== 'Off' &&
                          <span className="persona-status">{this.state.prediction_trigger}<br /></span>
                        }


                        {this.state.wrong_coupon !== 'Off' &&
                          <span className="persona-status">{this.state.wrong_coupon}<br /></span>
                        }
                      </a>
                    </li>
                  </ul>
                </Nav>
              </div>
              {/*               <div
                className={sideMenuTab[1] ? "tab-pane active show" : "tab-pane"}
                id="menu"
              >
                <Nav id="shield-sidebar-nav" className="sidebar-nav">
                  <ul id="shield-menu" className="metismenu">
                    <li id="ShieldContainer"
                      className={activeKey === "shield/dashboard" ? "active" : ""}
                    >
                      <Link to="/shield/dashboard"><i className="fa fa-shield"></i> Shield Overview</Link>
                    </li>
                    <li
                      className={
                        activeKey === "/shield/malwareInsights" ? "active" : ""
                      }
                    >
                      <Link to="/shield/malwareInsights"><img src={spider} className="menuIcon" /> Malware Insights</Link>
                    </li>
                    {/* --> COMMENTED 
                    <li className={activeKey === "ioT" ? "active" : ""}>
                      <Link to="/shield/extensionManagement"><i className="icon-grid"></i>  Extension Management</Link>
                    </li> --> COMMENTED * /}
                  </ul>
                </Nav>
              </div> */}
              <div className={sideMenuTab[2] ? "tab-pane active show" : "tab-pane"} id="Engage">
                <Nav id="engage-sidebar-nav" className="sidebar-nav ">
                  <ul id="engage-menu" className="metismenu">

                    <li
                      className={
                        activeKey === "/engage/persona" ? "active" : ""
                      }
                    >
                      <Link to="/engage/persona"><i className="fa fa-flask"></i> Shopper Group Details</Link>
                    </li>
                    <li id="EngageContainer"
                      className={activeKey === "/engage/insights" ? "active" : ""}
                    >
                      <Link to="/engage/insights"><i className="icon-magnifier"></i> Indepth View</Link>
                    </li>

                    {/* <li
                      className={
                        activeKey === "/shield/malwareInsights" ? "active" : ""
                      }
                    >
                      <Link to="/shield/malwareInsights"><img src={spider} className="menuIcon" />  Malware Insights</Link>
                    </li> */}
                    {/* <li
                      className={
                        activeKey === "/engage/persona" ? "active" : ""
                      }
                    >
                      <Link to="/engage/persona"><i className="icon-grid"></i> Shopper Segments</Link>
                    </li> */}
                    <li className={activeKey === "/engage/couponManagement" ? "active" : ""}>
                      <Link to="/engage/couponManagement"><i className="fa fa-ticket"></i> Coupon Management</Link>
                    </li>

                    {/* <li className={activeKey === "/engage/couponManagement" ? "active" : ""}>
                      <Link to="/engage/couponManagement"><i className="icon-grid"></i> Coupon Management</Link>
                    </li>


                    <li className={activeKey === "/engage/personaManagement" ? "active" : ""}>
                      <Link to="/engage/personaManagement"><i className="icon-grid"></i> Persona Management</Link>
                    </li>

                    <li className={activeKey === "ioT" ? "active" : ""}>
                      <Link to="/engage/wcMapping"><i className="icon-grid"></i> WC Mapping</Link>
                    </li>
                    <li className={activeKey === "ioT" ? "active" : ""}>
                      <Link to="/engage/couponModuleSetting"><i className="icon-grid"></i> Coupon Module Setting</Link>
                    </li> */}

                  </ul>
                </Nav>
              </div>

              <div className={sideMenuTab[4] ? "tab-pane active show" : "tab-pane"} id="users">
                <Nav id="users-sidebar-nav" className="sidebar-nav ">
                  <ul id="users-menu" className="metismenu">
                    <li
                      className={
                        activeKey === "/user/lists" ? "active" : ""
                      }
                    >
                      <Link to="/user/lists"><i className="fa fa-user"></i>User Management</Link>
                    </li>
                  </ul>
                </Nav>
                <Nav id="mtd-sidebar-nav" className="sidebar-nav ">
                  <ul id="mtd-menu" className="metismenu">
                    <li
                      className={
                        activeKey === "/reports/mtdReports" ? "active" : ""
                      }
                    >
                      <Link to="/reports/mtdReports"><i className="fa fa-user"></i>MTD Client Overview</Link>
                    </li>
                  </ul>
                </Nav>
                <Nav id="users-sidebar-nav" className="sidebar-nav ">
                  <ul id="users-menu" className="metismenu">
                    <li
                      className={
                        activeKey === "/reports/ReportManagement" ? "active" : ""
                      }
                    >
                      <Link to="/reports/ReportManagement"><i className="fa fa-user"></i>Report Management</Link>
                    </li>
                  </ul>
                </Nav>
                
                <Nav id="sales-report-nav" className="sidebar-nav ">
                  <ul id="sales-report-menu" className="metismenu">
                    <li
                      className={
                        activeKey === "/reports/SalesReportManagement" ? "active" : ""
                      }
                    >
                      <Link to="/reports/SalesReportManagement"><i className="fa fa-user"></i>Sales Intelligence Report</Link>
                    </li>
                  </ul>
                </Nav>
                <Nav id="sales-report-nav" className="sidebar-nav ">
                  <ul id="sales-report-menu" className="metismenu">
                    <li
                      className={
                        activeKey === "/reports/ShopperGroupReportManagement" ? "active" : ""
                      }
                    >
                      <Link to="/reports/ShopperGroupReportManagement"><i className="fa fa-user"></i>Sales Overview</Link>
                    </li>
                  </ul>
                </Nav>
                <Nav id="screenshot-sidebar-nav" className="sidebar-nav ">
                  <ul id="screenshot-menu" className="metismenu">
                    <li
                      className={
                        activeKey === "/reports/ScreenshotManagement" ? "active" : ""
                      }
                    >
                      <Link to="/reports/ScreenshotManagement"><i className="fa fa-user"></i>Screenshot Management</Link>
                    </li>
                  </ul>
                </Nav>
                <Nav id="users-sidebar-nav" className="sidebar-nav ">
                  <ul id="users-menu" className="metismenu">
                    <li
                      className={
                        activeKey === "/analytics/lists" ? "active" : ""
                      }
                    >
                      <Link to="/analytics/lists"><i className="fa fa-user"></i>Analytics Management</Link>
                    </li>
                  </ul>
                </Nav>
              </div>

              <div className={sideMenuTab[3] ? "tab-pane active show" : "tab-pane"} id="Admin">
                <Nav id="admin-sidebar-nav" className="sidebar-nav ">
                  <ul id="admin-menu" className="metismenu">
                    <li id="AdminContainer"
                      className={activeKey === "/admin/engage/dashboard" ? "active" : ""}
                    >
                      <Link to="/admin/engage/dashboard"><i className="icon-grid"></i> Dashboard</Link>
                    </li>

                    <li className={activeKey === "/admin/engage/couponManagement" ? "active" : ""}>
                      <Link to="/admin/engage/couponManagement"><i className="icon-grid"></i> Coupon Management</Link>
                    </li>


                    <li className={activeKey === "/admin/engage/personaManagement" ? "active" : ""}>
                      <Link to="/admin/engage/personaManagement"><i className="icon-grid"></i> Persona Management</Link>
                    </li>

                    <li className={activeKey === "/admin/engage/behaviourManagement" ? "active" : ""}>
                      <Link to="/admin/engage/behaviourManagement"><i className="icon-grid"></i> Behaviour Management</Link>
                    </li>

                    <li className={activeKey === "/admin/engage/behaviourDimensionsManagement" ? "active" : ""}>
                      <Link to="/admin/engage/behaviourDimensionsManagement"><i className="icon-grid"></i> Behaviour Dimensions Management</Link>
                    </li>

                    <li className={activeKey === "/admin/engage/promoBoxManagement" ? "active" : ""}>
                      <Link to="/admin/engage/promoBoxManagement"><i className="icon-grid"></i> Promobox Management</Link>
                    </li>

                    <li className={activeKey === "/admin/engage/promoBoxConfigManagement" ? "active" : ""}>
                      <Link to="/admin/engage/promoBoxConfigManagement"><i className="icon-grid"></i> Promobox Config Management</Link>
                    </li>

                  </ul>
                </Nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NavbarMenu.propTypes = {
  addClassactive: PropTypes.array.isRequired,
  addClassactiveChild: PropTypes.array.isRequired,
  addClassactiveChildApp: PropTypes.array.isRequired,
  addClassactiveChildFM: PropTypes.array.isRequired,
  addClassactiveChildBlog: PropTypes.array.isRequired,
  addClassactiveChildUI: PropTypes.array.isRequired,
  addClassactiveChildWidgets: PropTypes.array.isRequired,
  addClassactiveChildAuth: PropTypes.array.isRequired,
  addClassactiveChildPages: PropTypes.array.isRequired,
  addClassactiveChildForms: PropTypes.array.isRequired,
  addClassactiveChildTables: PropTypes.array.isRequired,
  addClassactiveChildChart: PropTypes.array.isRequired,
  addClassactiveChildMaps: PropTypes.array.isRequired,
  themeColor: PropTypes.string.isRequired,
  generalSetting: PropTypes.array.isRequired,
  toggleNotification: PropTypes.bool.isRequired,
  toggleEqualizer: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ navigationReducer, websiteRecordReducer, loginReducer }) => {

  const {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage
  } = navigationReducer;
  const { websiteRecord, sessionClient, shopperRecord } = websiteRecordReducer;
  const { isLoggedin } = loginReducer;
  return {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage,
    websiteRecord,
    sessionClient,
    shopperRecord,
    isLoggedin
  };
};

export default connect(mapStateToProps, {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
  websiteRecordAction,
  setWebsiteRecordsAction,
  setPersonaRecordsAction,
  onLoggedin
})(NavbarMenu);
