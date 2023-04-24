import React, { Suspense, lazy } from "react";
import { connect } from "react-redux";
import NavbarMenu from "./components/NavbarMenu";
import dashboard from "./screens/Dashbord/Dashbord";
/* import Persona from "./screens/Engage/Persona"; */
import { Route, Switch, withRouter, Redirect } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Login from "./screens/Login";
import { RouteLoader } from "./helper/Loader";

const EngageDashboard = lazy(() => import('./screens/Engage/EngageDashboard'));
const ShieldDashboard = lazy(() => import('./screens/Shield/ShieldDashboard'));
const CouponManagement = lazy(() => import('./screens/Engage/CouponManagement'));
const Persona_v2 = lazy(() => import('./screens/Engage/Persona_v2'));
const MalwareInsights = lazy(() => import('./screens/Shield/MalwareInsights'));
const ResetPassword = lazy(() => import('./screens/user/ResetPassword'));
const UsersList = lazy(() => import('./screens/user/UsersList'));
const AnalyticsList = lazy(() => import('./screens/Analytics/AnalyticsList'));
const MTDReports = lazy(() => import('./screens/Reports/MTDReports'));
const ReportManagement = lazy(() => import('./screens/Reports/ReportManagement'));
const SalesReportManagement = lazy(() => import('./screens/Reports/SalesReportManagement'));
const ShopperGroupReportManagement = lazy(() => import('./screens/Reports/ShopperGroupReportManagement'));
const ScreenshotManagement = lazy(() => import('./screens/Reports/ScreenshotManagement'));
const UserEditProfile = lazy(() => import('./screens/user/UserEditProfile'));
/* import EngageDashboard from "./screens/Engage/EngageDashboard";
import ShieldDashboard from "./screens/Shield/ShieldDashboard";
import CouponManagement from "./screens/Engage/CouponManagement";
import Persona_v2 from "./screens/Engage/Persona_v2";
import MalwareInsights from "./screens/Shield/MalwareInsights"; */





/* import PersonaManagement from "./screens/Engage/PersonaManagement";
import BehaviourManagement from "./screens/Engage/BehaviourManagement";
import BehaviourDimensionsManagement from "./screens/Engage/BehaviourDimensionsManagement";
import PromoBoxManagement from "./screens/Engage/PromoBoxManagement";
import PromoBoxConfigManagement from "./screens/Engage/PromoBoxConfigManagement"; */

window.__DEV__ = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
    };
  }
  render() {

    var res = window.location.pathname;
    var baseUrl = process.env.PUBLIC_URL;
    baseUrl = baseUrl.split("/");

    // res = res.split("/");
    // console.log(res[baseUrl.length]);

    //res = res.length > 0 ? res[baseUrl.length] : "/";
    res = res.length > 0 ? res : "/";
    res = res ? res : "/";
    const activeKey1 = res;

    if (activeKey1 !== "/login" && !this.props.isLoggedin) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: this.props.location
          }}
        />
      );
    }
    return (
      <div id="wrapper">
        {activeKey1 === "" ||
          activeKey1 === "/login" ||
          activeKey1 === "registration" ||
          activeKey1 === "lockscreen" ||
          activeKey1 === "forgotpassword" ? (
          <Switch>
            {/* <Route exact path={`${process.env.PUBLIC_URL}`} component={Login} /> */}
            <Route
              exact
              path={`/login`}
              component={Login}
            />
          </Switch>
        ) : (
          <Suspense fallback={
            <div className="container">
              <div className="row">
                <div style={{ display: "flex", justifyContent: "center", alignItem: "center", alignContent: "center", marginTop: "40vh", width: "100%" }}>
                  {/* <span style={{ fontSize: "18px" }} className="badge text-center badge-info">Loading!!!</span> */}

                  <RouteLoader width="col-md-4 col-lg-4" height="150px" />
                </div>
              </div>
            </div>}>
            <NavbarMenu history={this.props.history} activeKey={activeKey1} />
            <div id="main-content">
              <Switch>
                <ProtectedRoute
                  exact
                  path={`/`}
                  component={dashboard}
                />
                <ProtectedRoute
                  exact
                  path={`/dashboard`}
                  component={dashboard}
                />

                <ProtectedRoute
                  exact
                  path={`/engage/persona`}
                  component={Persona_v2}
                />
                {/* <ProtectedRoute
                  exact
                  path={`/engage/persona_v2`}
                  component={Persona_v2}
                /> */}
                <ProtectedRoute
                  exact
                  path={`/engage/insights`}
                  component={EngageDashboard}
                />
                <ProtectedRoute
                  exact
                  path={`/shield/dashboard`}
                  component={ShieldDashboard}
                />
                <ProtectedRoute
                  exact
                  path={`/shield/malwareInsights`}
                  component={MalwareInsights}
                />

                <ProtectedRoute
                  exact
                  path={`/engage/couponManagement`}
                  component={CouponManagement}
                />
                <ProtectedRoute
                  exact
                  path={`/user/reset-password`}
                  component={ResetPassword}
                />
                <ProtectedRoute
                  exact
                  path={`/user/lists`}
                  component={UsersList}
                />
                <ProtectedRoute
                  exact
                  path={`/analytics/lists`}
                  component={AnalyticsList}
                />
                <ProtectedRoute
                  exact
                  path={`/reports/mtdReports`}
                  component={MTDReports}
                />
                <ProtectedRoute
                  exact
                  path={`/reports/ReportManagement`}
                  component={ReportManagement}
                />
                <ProtectedRoute
                  exact
                  path={`/reports/SalesReportManagement`}
                  component={SalesReportManagement}
                />
                <ProtectedRoute
                  exact
                  path={`/reports/ShopperGroupReportManagement`}
                  component={ShopperGroupReportManagement}
                />
                <ProtectedRoute
                  exact
                  path={`/reports/ScreenshotManagement`}
                  component={ScreenshotManagement}
                />
                <ProtectedRoute
                  exact
                  path={'/user/edit-profile'}
                  component={UserEditProfile}
                />
                {/* <ProtectedRoute
                  exact
                  path={`/admin/engage/personaManagement`}
                  component={PersonaManagement}
                />
            
                
                <ProtectedRoute
                  exact
                  path={`/admin/engage/behaviourManagement`}
                  component={BehaviourManagement}
                />
                <ProtectedRoute
                  exact
                  path={`/admin/engage/behaviourDimensionsManagement`}
                  component={BehaviourDimensionsManagement}
                />

                <ProtectedRoute
                  exact
                  path={`/admin/engage/promoBoxManagement`}
                  component={PromoBoxManagement}
                />
                <ProtectedRoute
                  exact
                  path={`/admin/engage/promoBoxConfigManagement`}
                  component={PromoBoxConfigManagement}
                /> */}
              </Switch>
            </div>
          </Suspense>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer }) => ({
  isLoggedin: loginReducer.isLoggedin,
});

export default withRouter(connect(mapStateToProps, {})(App));
