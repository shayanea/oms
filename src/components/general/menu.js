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
            <Link onClick={this.props.onClose} to="/" className={`${this.getActiveMenu("/") && "active"}`}>
              پیشخوان
            </Link>
          </li>
          <li>
            <Link onClick={this.props.onClose} to="/orders/manage" className={`${this.getActiveMenu("/orders/manage") && "active"}`}>
              مدیریت سفارش‌ها
            </Link>
          </li>
          <li>
            <Link onClick={this.props.onClose} to="/products/list" className={`${this.getActiveMenu("/products/list") && "active"}`}>
              مدیریت کالا‌
            </Link>
          </li>
          <li>
            <Link onClick={this.props.onClose} to="/users/list" className={`${this.getActiveMenu("/users/list") && "active"}`}>
              مدیریت کاربران
            </Link>
          </li>
          <li>
            <Link onClick={this.props.onClose} to="/couriers/list" className={`${this.getActiveMenu("/couriers/list") && "active"}`}>
              مدیریت واحد‌های ارسال
            </Link>
          </li>
          <li>
            <Link onClick={this.props.onClose} to="/advisers/list" className={`${this.getActiveMenu("/advisers/list") && "active"}`}>
              مدیریت مشاور‌ها
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default ClickOutside(Menu);
