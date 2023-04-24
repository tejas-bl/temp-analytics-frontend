import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { onPressRecentChatDropDown } from "../../actions";

class FeedCards extends React.Component {
  render() {
    const { recentChatDropDown } = this.props;
    return (
      <div className="card">
        <div className="header pb-0">
          <h2 className="pb-0">LOGS</h2>
        </div>
        <div className="body">
          <ul className="list-unstyled feeds_widget">
            <li>
              <div className="feeds-left">
                <i className="fa fa-thumbs-o-up"></i>
              </div>
              <div className="feeds-body">
                <h4 className="title">
                Listening Phase | Protection Phase​
                </h4>
                <small>It will give a smart finishing to your site</small>
              </div>
            </li>
            <li>
              <div className="feeds-left">
                <i className="fa fa-user"></i>
              </div>
              <div className="feeds-body">
                <h4 className="title">
                  Split Changes
                </h4>
                <small>I feel great! Thanks team</small>
              </div>
            </li>
            <li>
              <div className="feeds-left">
                <i className="fa fa-question-circle"></i>
              </div>
              <div className="feeds-body">
                <h4 className="title text-warning">
                  Personas Activated
                </h4>
                <small>Your connection is not private</small>
              </div>
            </li>
            <li>
              <div className="feeds-left">
                <i className="fa fa-shopping-basket"></i>
              </div>
              <div className="feeds-body">
                <h4 className="title">Coupons Added​
                </h4>
                <small>You received a new oder from Tina.</small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

FeedCards.propTypes = {
  onPressRecentChatDropDown: PropTypes.func.isRequired,
};

const mapStateToProps = ({ analyticalReducer }) => ({
  recentChatDropDown: analyticalReducer.recentChatDropDown,
});

export default connect(mapStateToProps, {
  onPressRecentChatDropDown,
})(FeedCards);
