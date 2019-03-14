import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/requestConfig";

export default class dashboard extends Component {
  state = {
    totalOrders: 0,
    recievedOrders: 0,
    canceledOrders: 0,
    totalProducts: 0
  };

  componentDidMount() {
    this.fetchDashboardStats();
  }

  fetchTotalOrders = () => {
    return axios.get("/orders?PageNumber=1&PageSize=1");
  };

  fetchRecievedOrders = () => {
    return axios.get("/orders?PageNumber=1&PageSize=1&StatusId=501&tatusId_op=in");
  };

  fetchCanceledOrders = () => {
    return axios.get("/orders?PageNumber=1&PageSize=1&StatusId=601,699&tatusId_op=between");
  };

  fetchTotalProducts = () => {
    return axios.get("/products?PageNumber=1&PageSize=1");
  };

  fetchDashboardStats = () => {
    return Promise.all([this.fetchTotalOrders(), this.fetchRecievedOrders(), this.fetchCanceledOrders(), this.fetchTotalProducts()]).then(res => {
      this.setState({
        totalOrders: res[0].data.meta.totalCount,
        recievedOrders: res[1].data.meta.totalCount,
        canceledOrders: res[2].data.meta.totalCount,
        totalProducts: res[3].data.meta.totalCount
      });
    });
  };

  render() {
    const { totalOrders, recievedOrders, canceledOrders, totalProducts } = this.state;
    return (
      <div className="container">
        <div className="report-item__container">
          <div className="report-items__container">
            <p className="report-items__title">تعداد کل سفارش‌ها</p>
            <span className="report-items__value">{totalOrders}</span>
          </div>
          <div className="report-items__container">
            <p className="report-items__title">سفارش‌های تحویل شده</p>
            <span className="report-items__value">{recievedOrders}</span>
          </div>
          <div className="report-items__container">
            <p className="report-items__title">سفارش‌های کنسل شده</p>
            <span className="report-items__value">{canceledOrders}</span>
          </div>
          <div className="report-items__container">
            <p className="report-items__title">تعداد کالا‌ها</p>
            <span className="report-items__value">{totalProducts}</span>
          </div>
        </div>
        <div className="action-item__container">
          <Link to="/order/add" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">ثبت سفارش</span>
          </Link>
          <Link to="/orders/assign" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">انتصاب سفارش‌ها</span>
          </Link>
          <Link to="/orders/list" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">پیگیری سفارش</span>
          </Link>
          <Link to="/orders/manage" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">مدیریت سفارش‌ها</span>
          </Link>
        </div>
        <div className="action-item__container">
          <Link to="/product/add" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">ثبت کالا</span>
          </Link>
          <Link to="/products/list" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">مدیریت کالا‌</span>
          </Link>
        </div>
        <div className="action-item__container">
          <Link to="/" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">ثبت واحد ارسال</span>
          </Link>
          <Link to="/couriers/list" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">مدیریت واحد‌های ارسال</span>
          </Link>
          <Link to="/" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">گزارش واحد‌های ارسال</span>
          </Link>
        </div>
        <div className="action-item__container">
          <Link to="/user/add" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">ثبت کاربر</span>
          </Link>
          <Link to="/users/list" className="action-items__container">
            <div className="action-items__cover" />
            <span className="action-items__title">مدیریت کاربران</span>
          </Link>
        </div>
      </div>
    );
  }
}
