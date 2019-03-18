import React, { Component } from "react";
import { Switch, Route, Redirect, Router } from "react-router-dom";
import { Provider } from "react-redux";
import { history } from "./utils/history";
import store from "./store";

import "zent/css/index.css";
import "./assets/css/style.css";

import MainView from "./components/general/mainView";

import Login from "./pages/auth/login";
import Email from "./pages/auth/email";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";
import Dashboard from "./pages/dashboard";
// Order
import ManageOrder from "./pages/order/manage";
import OrderList from "./pages/order/list";
import AssingOrder from "./pages/order/assign";
import AddOrder from "./pages/order/add";
import EditOrder from "./pages/order/edit";
// Products
import ProductList from "./pages/product/list";
import AddProduct from "./pages/product/add";
import EditProduct from "./pages/product/edit";
// Users
import UserList from "./pages/user/list";
import AddUser from "./pages/user/add";
import EditUser from "./pages/user/edit";
// Courier
import CourierDashboard from "./pages/courier/dashboard";
import CourierList from "./pages/courier/list";
import AddCourier from "./pages/courier/add";
import EditCourier from "./pages/courier/edit";
// Adviser
import AdviserList from "./pages/adviser/list";
import AddAdviser from "./pages/adviser/add";
import EditAdviser from "./pages/adviser/edit";

const isAuthenticated = () => {
  return store.getState().auth.isAuthenticated && localStorage.getItem("USER_INFO");
};

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login"
          }}
        />
      )
    }
  />
);

const NoMatch = ({ location }) => {
  return store.getState().auth.isAuthenticated && localStorage.getItem("USER_INFO") ? (
    <Redirect
      to={{
        pathname: "/"
      }}
    />
  ) : (
    <Redirect
      to={{
        pathname: "/login"
      }}
    />
  );
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: true
    };
  }

  componentDidMount() {
    this.changeTitle(history.location.pathname);
    this.setState({
      disable: this.checkForNotSafeRoute(history.location.pathname)
    });

    history.listen(location => {
      this.changeTitle(location.pathname);
      this.setState({
        disable: this.checkForNotSafeRoute(location.pathname)
      });
      window.scrollTo(0, 0);
    });
  }

  checkForNotSafeRoute = url => {
    return url === "/login" || url === "/verify/emailAddress" || url === "/forgotpassword" || url === "/resetpassword";
  };

  changeTitle = path => {
    switch (path) {
      case "/":
        return (document.title = "پیشخوان");
      case "/login":
        return (document.title = "ورود کاربران");
      case "/verify/emailAddress":
        return (document.title = "تایید ایمیل");
      case "/products/list":
        return (document.title = "لیست کالا");
      case "/product/add":
        return (document.title = "درج کالا");
      case "/users/list":
        return (document.title = "لیست کاربران");
      case "/user/add":
        return (document.title = "درج کاربر");
      case "/couriers/dashboard":
        return (document.title = "پیشخوان");
      case "/couriers/list":
        return (document.title = "لیست واحد‌های ارسال");
      case "/courier/add":
        return (document.title = "درج واحد ارسال");
      case "/orders/list":
        return (document.title = "پیگیری سفارش");
      case "/orders/manage":
        return (document.title = "مدیریت سفارش‌ها");
      case "/orders/assign":
        return (document.title = "انتصاب سفارش‌ها");
      case "/order/add":
        return (document.title = "درج سفارش");
      default:
        return this.handleRouteWithParams(path);
    }
  };

  handleRouteWithParams = path => {};

  render() {
    const { disable } = this.state;
    return (
      <Provider store={store}>
        <Router history={history}>
          <main className={disable ? "App dashboard" : "App dashboard enable-zoom"}>
            {!disable ? <MainView /> : null}
            <Switch>
              {/* main route */}
              <AuthRoute exact path="/" component={Dashboard} />
              {/* order route */}
              <AuthRoute exact path="/orders/list" component={OrderList} />
              <AuthRoute exact path="/orders/manage" component={ManageOrder} />
              <AuthRoute exact path="/orders/assign" component={AssingOrder} />
              <AuthRoute exact path="/order/add" component={AddOrder} />
              <AuthRoute exact path="/order/edit/:id" component={EditOrder} />
              {/* product route */}
              <AuthRoute exact path="/products/list" component={ProductList} />
              <AuthRoute exact path="/product/add" component={AddProduct} />
              <AuthRoute exact path="/product/edit/:id" component={EditProduct} />
              {/* user route */}
              <AuthRoute exact path="/users/list" component={UserList} />
              <AuthRoute exact path="/user/add" component={AddUser} />
              <AuthRoute exact path="/user/edit/:id" component={EditUser} />
              {/* courier route */}
              <AuthRoute exact path="/couriers/dashboard" component={CourierDashboard} />
              <AuthRoute exact path="/couriers/list" component={CourierList} />
              <AuthRoute exact path="/courier/add" component={AddCourier} />
              <AuthRoute exact path="/courier/edit/:id" component={EditCourier} />
              {/* adviser route */}
              <AuthRoute exact path="/advisers/list" component={AdviserList} />
              <AuthRoute exact path="/adviser/add" component={AddAdviser} />
              <AuthRoute exact path="/adviser/edit/:id" component={EditAdviser} />
              {/* account route */}
              <Route path="/login" component={Login} />
              <Route path="/verify/emailAddress" component={Email} />
              <Route path="/forgotpassword" component={ForgotPassword} />
              <Route path="/resetpassword" component={ResetPassword} />
              {/* 404 */}
              <Route component={NoMatch} />
            </Switch>
          </main>
        </Router>
      </Provider>
    );
  }
}
export default Main;
