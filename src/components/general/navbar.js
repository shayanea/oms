import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authAction";
import { history } from "../../utils/history";
import * as moment from "moment-jalaali";

import { Sweetalert } from "zent";
import Logo from "../../assets/images/logo.svg";

moment.loadPersian({ dialect: "persian-modern" });

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
    this.state = {
      currentDate: moment().format("jD jMMMM jYY")
    };
  }

  logout = () => {
    Sweetalert.confirm({
      confirmType: "success",
      confirmText: "بله",
      cancelText: "منصرف شدم",
      content: "آیا مطمئن به خارج شدن از پنل OMS خود هستید ؟",
      title: "",
      className: "custom-sweetalert",
      maskClosable: true,
      parentComponent: this,
      onConfirm: () => {
        this.props.logoutUser();
        history.push("/login");
      }
    });
  };

  render() {
    const { currentDate } = this.state;
    const { roleId } = this.userInfo;
    return (
      <div className="navbar-container">
        <div className="navbar-col">
          {roleId === "1" || roleId === "2" ? <div className="menu-btn" onClick={() => this.props.onToggleMenu()} /> : null}
          <div className="logo-container">
            <img className="logo" src={Logo} alt="OMS" />
            <p>OMS</p>
          </div>
          <div className="user-information">{this.userInfo.fullname} خوش آمدی</div>
        </div>
        <div className="navbar-col">
          <span className="date-container">{currentDate}</span>
          {/* <div className="profile-btn" onClick={() => history.push(`/user/edit/${this.userInfo.accountId}`)} /> */}
          <div className="logout-btn" onClick={() => this.logout()} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    logoutUser
  }
)(Navbar);
