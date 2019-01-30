import React, { Component } from "react";
import { Switch, Route, Redirect, Router } from "react-router-dom";
import { Provider } from "react-redux";
import { history } from "./utils/history";
import store from "./store";

import "zent/css/index.css";
import "./assets/css/style.css";

import MainView from "./components/general/mainView";

import Login from "./pages/auth/login";
import Dashboard from "./pages/dashboard";
// Order
import AddOrder from "./pages/order/add";
import AssingOrder from "./pages/order/assign";
import ManageOrder from "./pages/order/manage";

const isAuthenticated = () => {
	return (
		store.getState().auth.isAuthenticated && localStorage.getItem("USER_INFO")
	);
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
	return store.getState().auth.isAuthenticated &&
		localStorage.getItem("USER_INFO") ? (
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
		return url === "/login";
	};

	changeTitle = path => {
		switch (path) {
			case "/login":
				return (document.title = "ورود کاربران");
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
					<main
						className={disable ? "App dashboard" : "App dashboard enable-zoom"}
					>
						{!disable ? <MainView /> : null}
						<Switch>
							{/* main route */}
							<AuthRoute exact path="/" component={Dashboard} />
							{/* order route */}
							<AuthRoute exact path="/order/add" component={AddOrder} />
							<AuthRoute exact path="/order/assign" component={AssingOrder} />
							<AuthRoute exact path="/order/manage" component={ManageOrder} />
							{/* account route */}
							<Route path="/login" component={Login} />
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
