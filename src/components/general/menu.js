import React, { Component } from "react";
import { Link } from "react-router-dom";
import ClickOutside from "react-click-outside";

class Menu extends Component {
  getActiveMenu = url => {
    return url === this.props.history.pathname;
  };

  handleClickOutside = () => this.props.onClose();

  render() {
    const { toggle } = this.props;
    return (
      <div className={`menu-container ${toggle && "active"}`}>
        <ul>
          <li>
            <Link to="/" className={`${this.getActiveMenu("/") && "active"}`}>
              پیشخوان
            </Link>
          </li>
          <li>
            <Link to="/orders/manage" className={`${this.getActiveMenu("/orders/manage") && "active"}`}>
              مدیریت سفارش‌ها
            </Link>
          </li>
          <li>
            <Link to="/products/list" className={`${this.getActiveMenu("/products/list") && "active"}`}>
              مدیریت کالا‌
            </Link>
          </li>
          <li>
            <Link to="/users/list" className={`${this.getActiveMenu("/users/list") && "active"}`}>
              مدیریت کاربران
            </Link>
          </li>
          <li>
            <Link to="/couriers/list" className={`${this.getActiveMenu("/couriers/list") && "active"}`}>
              مدیریت واحد‌های ارسال
            </Link>
          </li>
          <li>
            <Link to="/advisers/list" className={`${this.getActiveMenu("/advisers/list") && "active"}`}>
              مدیریت مشاور‌ها
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default ClickOutside(Menu);
