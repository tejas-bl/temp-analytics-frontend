import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateEmail, updatePassword, onLoggedin, setWebsiteRecordsAction } from "../actions";
import { getWebsitesRecord } from "../api/shieldDashboard";
import { getCurrentUser, getWebsiteData, sendGAHit, setCurrentUser } from "../helper/Utils";
import { loginWithEmailPasswordAsync } from "../api/authentication";
import { Toast } from "react-bootstrap";

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoad: true,
      loadLoginMessage: false,
      loginMessage: null
    }

    this.handleLogin = this.handleLogin.bind(this);
  }


  async handleLogin({ ...data }) {
    const res = await loginWithEmailPasswordAsync(data.email, data.password);
    if (res.hasOwnProperty('data')) {
      if (res.data.hasOwnProperty("statuscode") && res.data.statuscode === 200) {
        localStorage.removeItem("persist:websiteRecordReducer");
        this.setState({
          loadLoginMessage: true,
          loginMessage: "Welcome User"
        })
        this.props.onLoggedin({ status: true })
        setCurrentUser(res);
        await sendGAHit('event', 'ClientDashboard', {
          'event_category': 'DashboardLogin',
          'event_action': 'login',
          'event_label': res.data.data.user_email,
          'non_interaction': false,
          'user_email': res.data.data.user_email,
          'user_role': res.data.data.roles
        })

        if (data.location.state !== undefined) {
          const search = data.location.state.search;
          const hash = data.location.state.hash;
          this.props.history.push({ pathname: `${data.location.state.pathname}`, search: `${search}`, hash: `${hash}` });
        } else {
          this.props.history.push({ pathname: "/dashboard" });
        }

        let currentUser = await getCurrentUser();
        if (currentUser && currentUser.hasOwnProperty('data')) {
          currentUser = currentUser.data.data;
        }
        const headerConfig = {
          headers: {
            Authorization: currentUser && `Bearer ${currentUser.refresh_token}`,
          }
        }
        try {
          const getWebsitesRecordData = await getWebsitesRecord(currentUser.refresh_token, headerConfig);
          if (getWebsitesRecordData.status !== 200) {
            const websiteRecordOptionsArray = [];
            getWebsitesRecordData.data.map(d => {
              websiteRecordOptionsArray.push(d);
            })
            await this.props.setWebsiteRecordsAction(websiteRecordOptionsArray);
          }
        } catch (err) {
          return;
        }

      } else {

        if (res.data.statuscode === "23505") {
          this.setState({
            loadLoginMessage: true,
            loginMessage: "User Already Logged In"
          })
        } else if (res.data.statuscode === 403) {
          this.setState({
            loadLoginMessage: true,
            loginMessage: res.data.name
          })
        } else {
          this.setState({
            loadLoginMessage: true,
            loginMessage: "Invalid Username or password"
          })
        }
        this.props.onLoggedin({ status: false });
      }
    } else {
      this.setState({
        loadLoginMessage: true,
        loginMessage: "Invalid Username or password"
      })
    }
    /*     } catch (err) {
          this.setState({
            loadLoginMessage: true,
            loginMessage: "Something went wrong"
          })
          console.log("Catch --- ", err);
          this.props.onLoggedin({ status: false });
        } */

  }
  componentDidMount() {

    if (getCurrentUser() && getCurrentUser().hasOwnProperty('data') && getCurrentUser().data.statuscode === 200) {
      this.props.history.push({ pathname: '/dashboard' });
    }
    setTimeout(() => {
      this.setState({
        isLoad: false
      })
    }, 500);
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
  }
  render() {
    const { email, password, history, location } = this.props;
    return (
      <div className="theme-blue">
        <Toast
          id="toast-container"
          show={this.state.loadLoginMessage}
          onClose={() => {
            this.setState({
              loadLoginMessage: false
            })
          }}
          className="toast-info toast-top-right"
          autohide={true}
          delay={3500}
        >
          <Toast.Header className="toast-info mb-0">
            {this.state.loginMessage}
          </Toast.Header>
        </Toast>
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={require('../assets/images/logo-icon.svg')} width="48" height="48" alt="Brandlock" /></div>
            <p>Please wait...</p>
          </div>
        </div>
        <div className="hide-border">
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="top">
                  {/* <img src={Logo} alt="Brandlock" style={{ height: "40px", margin: "10px" }} /> */}
                </div>
                <div className="card">
                  <div className="header">
                    <p className="lead">Login to your account</p>
                  </div>
                  <div className="body">
                    <div className="form-auth-small" action="index.html">
                      <div className="form-group">
                        <label className="control-label sr-only">Email</label>
                        <input
                          className="form-control"
                          id="signin-email"
                          placeholder="Email"
                          type="email"
                          /* value={email} */
                          value={email}
                          onChange={val => {
                            this.props.updateEmail(val.target.value);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only">
                          Password
                        </label>
                        <input
                          className="form-control"
                          id="signin-password"
                          placeholder="Password"
                          type="password"
                          /* value={password} */
                          value={password}
                          onChange={val => {
                            this.props.updatePassword(val.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              this.handleLogin({ email, password, history, location })
                            }
                          }}
                        />
                      </div>
                      {/*                       <div className="form-group clearfix">
                        <label className="fancy-checkbox element-left">
                          <input type="checkbox" />
                          <span>Remember me</span>
                        </label>
                      </div> */}
                      <a
                        className="btn btn-primary btn-lg btn-block"
                        // href="dashboard"
                        onClick={() => {
                          this.handleLogin({ email, password, history, location })
                          // this.props.onLoggedin({ email, password, history })
                        }}
                      >Login</a>
                      {/* <div className="bottom">
                        <span className="helper-text m-b-10">
                          <i className="fa fa-lock"></i>{" "}
                          <a href={`${process.env.PUBLIC_URL}/forgotpassword`} 
                          >
                            Forgot password?
                          </a>
                        </span>
                        <span>
                          Don't have an account?{" "}
                          <a href="registration" >Register</a>
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  updateEmail: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

const mapStateToProps = ({ loginReducer, websiteRecordReducer }) => ({
  email: loginReducer.email,
  password: loginReducer.password,
  isLoggedin: loginReducer.isLoggedin,
  websiteLoading: websiteRecordReducer.websiteLoading
});

export default connect(mapStateToProps, {
  updateEmail,
  updatePassword,
  onLoggedin,
  setWebsiteRecordsAction
})(Login);
