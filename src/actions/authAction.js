import * as type from "./type";
import axios from "../utils/requestConfig";
import { Notify } from "zent";
import { clearDashboardData } from "../actions/globalAction";
import { history } from "../utils/history";

export const getProfile = customData => dispatch => {
	let result = JSON.parse(localStorage.getItem("USER_INFO"));
	return axios
		.get(`/accounts/${customData.accountId}/profile`)
		.then(res => {
			result["fullname"] = `${res.data.data.firstName} ${
				res.data.data.lastName
			}`;
			localStorage.setItem("USER_INFO", JSON.stringify(result));
			dispatch({
				type: type.LOGIN,
				payload: {
					isLoading: false,
					isAuthenticated: true
				}
			});
			history.push("/");
		})
		.catch(err => {
			Notify.error(
				err.data !== null && typeof err.data !== "undefined"
					? err.data.error.errorDescription
					: "در برقراری ارتباط مشکلی به وجود آمده است.",
				5000
			);
			dispatch({
				type: type.LOGIN,
				payload: {
					isLoading: false,
					isAuthenticated: false
				}
			});
		});
};

export const loginUser = data => dispatch => {
	dispatch({
		type: type.LOGIN,
		payload: {
			isLoading: true,
			isAuthenticated: false
		}
	});
	return axios
		.post("/sessions", data)
		.then(res => {
			localStorage.setItem("USER_INFO", JSON.stringify(res.data.data));
			dispatch(getProfile(res.data.data));
		})
		.catch(err => {
			Notify.error(
				err.data !== null && typeof err.data !== "undefined"
					? err.data.error.errorDescription
					: "در برقراری ارتباط مشکلی به وجود آمده است.",
				5000
			);
			dispatch({
				type: type.LOGIN,
				payload: {
					isLoading: false,
					isAuthenticated: false
				}
			});
		});
};

export const logoutUser = () => dispatch => {
	localStorage.removeItem("USER_INFO");
	dispatch({
		type: type.LOGOUT,
		payload: {
			isAuthenticated: false
		}
	});
	dispatch(clearDashboardData());
};
