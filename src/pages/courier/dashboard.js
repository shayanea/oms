import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class dashboard extends Component {
  constructor() {
    super();
    this.userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  }

  render() {
    return (
      <div className="container">
        <div className="action-item__container">
          <Link to="/courier/orders" className="action-items__container">
            <div className="action-items__cover" data-type="2" />
            <span className="action-items__title">سفارش‌های جدید</span>
          </Link>
          <Link to="/courier/orders/manage" className="action-items__container">
            <div className="action-items__cover" data-type="4" />
            <span className="action-items__title">آرشیو سفارش‌ها</span>
          </Link>
        </div>
      </div>
    );
  }
}
