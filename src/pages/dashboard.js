import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/requestConfig";

export default class dashboard extends Component {
  constructor() {
    super();
    this.userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
    this.state = {
      isLoading: true,
      totalOrders: 0,
      recievedOrders: 0,
      canceledOrders: 0,
      totalProducts: 0
    };
  }

  componentDidMount() {
    if (this.userInfo.roleId === "1" || this.userInfo.roleId === "2" || this.userInfo.roleId === "4") this.fetchDashboardStats();
  }

  fetchTotalOrders = () => {
    return axios.get("/orders?_pageNumber=1&_pageSize=1");
  };

  fetchRecievedOrders = () => {
    return axios.get("/orders?_pageNumber=1&_pageSize=1&StatusId=501&statusId_op=in");
  };

  fetchCanceledOrders = () => {
    return axios.get("/orders?_pageNumber=1&_pageSize=1&StatusId=601,699&statusId_op=between");
  };

  fetchTotalProducts = () => {
    return axios.get("/products?_pageNumber=1&_pageSize=1");
  };

  fetchDashboardStats = () => {
    Promise.all([this.fetchTotalOrders(), this.fetchRecievedOrders(), this.fetchCanceledOrders(), this.fetchTotalProducts()]).then(res => {
      this.setState({
        isLoading: false,
        totalOrders: res[0].data.meta.totalCount,
        recievedOrders: res[1].data.meta.totalCount,
        canceledOrders: res[2].data.meta.totalCount,
        totalProducts: res[3].data.meta.totalCount
      });
    });
  };

  render() {
    const { totalOrders, recievedOrders, canceledOrders, totalProducts, isLoading } = this.state;
    const { roleId } = this.userInfo;
    return (
      <div className="container" style={{ margin: "0", padding: "0 0 25px 0" }}>
        <div className="report-item__container">
          {!isLoading && (
            <React.Fragment>
              <Link to="/orders/manage" className="report-items__container">
                <div className="report-items__cover" data-type="1" />
                <div>
                  <p className="report-items__title">تعداد کل سفارش‌ها</p>
                  <span className="report-items__value">{parseFloat(totalOrders).toLocaleString("fa")}</span>
                </div>
              </Link>
              <Link to="/orders/manage" className="report-items__container">
                <div className="report-items__cover" data-type="2" />
                <div>
                  <p className="report-items__title">سفارش‌های تحویل شده</p>
                  <span className="report-items__value">{parseFloat(recievedOrders).toLocaleString("fa")}</span>
                </div>
              </Link>
              <Link to="/orders/manage" className="report-items__container">
                <div className="report-items__cover" data-type="3" />
                <div>
                  <p className="report-items__title">سفارش‌های کنسل شده</p>
                  <span className="report-items__value">{parseFloat(canceledOrders).toLocaleString("fa")}</span>
                </div>
              </Link>
              <Link to="/products/list" className="report-items__container">
                <div className="report-items__cover" data-type="4" />
                <div>
                  <p className="report-items__title">تعداد کالا‌ها</p>
                  <span className="report-items__value">{parseFloat(totalProducts).toLocaleString("fa")}</span>
                </div>
              </Link>
            </React.Fragment>
          )}
        </div>
        <div style={{ margin: "0 50px" }}>
          <div className="action-item__container">
            <Link to="/order/add" className="action-items__container">
              <div className="action-items__cover" data-type="1" />
              <span className="action-items__title">ثبت سفارش</span>
            </Link>
            <Link to="/orders/assign" className="action-items__container">
              <div className="action-items__cover" data-type="2" />
              <span className="action-items__title">انتساب سفارش‌ها</span>
            </Link>
            <Link to="/orders/list" className="action-items__container">
              <div className="action-items__cover" data-type="3" />
              <span className="action-items__title">پیگیری سفارش</span>
            </Link>
            <Link to="/orders/manage" className="action-items__container">
              <div className="action-items__cover" data-type="4" />
              <span className="action-items__title">مدیریت سفارش‌ها</span>
            </Link>
          </div>
          {roleId === "1" || roleId === "2" ? (
            <React.Fragment>
              <div className="action-item__container">
                <Link to="/product/add" className="action-items__container">
                  <div className="action-items__cover" data-type="5" />
                  <span className="action-items__title">ثبت کالا</span>
                </Link>
                <Link to="/products/list" className="action-items__container">
                  <div className="action-items__cover" data-type="6" />
                  <span className="action-items__title">مدیریت کالا‌</span>
                </Link>
              </div>
              <div className="action-item__container">
                <Link to="/courier/add" className="action-items__container">
                  <div className="action-items__cover" data-type="7" />
                  <span className="action-items__title">ثبت واحد ارسال</span>
                </Link>
                <Link to="/couriers/list" className="action-items__container">
                  <div className="action-items__cover" data-type="8" />
                  <span className="action-items__title">مدیریت واحد‌های ارسال</span>
                </Link>
                {/* <Link to="/" className="action-items__container">
                <div className="action-items__cover" data-type="9" />
                <span className="action-items__title">گزارش واحد‌های ارسال</span>
              </Link> */}
              </div>
              <div className="action-item__container">
                <Link to="/user/add" className="action-items__container">
                  <div className="action-items__cover" data-type="10" />
                  <span className="action-items__title">ثبت کاربر</span>
                </Link>
                <Link to="/users/list" className="action-items__container">
                  <div className="action-items__cover" data-type="11" />
                  <span className="action-items__title">مدیریت کاربران</span>
                </Link>
              </div>
              <div className="action-item__container">
                <Link to="/adviser/add" className="action-items__container">
                  <div className="action-items__cover" data-type="12" />
                  <span className="action-items__title">ثبت مشاور‌</span>
                </Link>
                <Link to="/advisers/list" className="action-items__container">
                  <div className="action-items__cover" data-type="13" />
                  <span className="action-items__title">مدیریت مشاور‌ها</span>
                </Link>
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}
