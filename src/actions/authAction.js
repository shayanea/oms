import * as type from "./type";
import axios from "../utils/requestConfig";
import { Notify } from "zent";
import { clearDashboardData } from "../actions/globalAction";
import { history } from "../utils/history";

export const loginUser = data => dispatch => {
	dispatch({
		type: type.LOGIN,
		payload: {
			isLoading: true,
			isAuthenticated: false
		}
	});
	axios
		.post("/auth/login", data)
		.then(res => {
			localStorage.setItem(
				"USER_INFO",
				JSON.stringify({ token: res.data.token, user: res.data.user })
			);
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
