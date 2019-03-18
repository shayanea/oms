import React, { Component } from "react";

export default class courierDashboard extends Component {
  constructor() {
    super();
    this.userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  }

  render() {
    return <div />;
  }
}
