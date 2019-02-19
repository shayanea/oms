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
	if (data.username === "admin" && data.password === "admin") {
		localStorage.setItem(
			"USER_INFO",
			JSON.stringify({
				token:
					"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbiIsInJvbGUiOiJTdXBlckFkbWluIiwibmJmIjoxNTQ4Njg5MjE2LCJleHAiOjE1NDg3NzU2MTYsImlhdCI6MTU0ODY4OTIxNn0.wTdB2fORG1cbM4AGR64v8Yk9Kh80l4V3xroNTW2Jjei6DbZzcqFMMXrZYK-m19Kn96WBw01V-xxOVkBf7H3h-Q",
				user: {
					id: 1,
					username: "admin",
					gender: 1,
					firstname: "Super",
					lastname: "Admin",
					dateOfBirth: "0001-01-01T00:00:00",
					about: null,
					city: null,
					country: null,
					isActive: true,
					created: "0001-01-01T00:00:00",
					lastActive: "0001-01-01T00:00:00",
					files: null
				}
			})
		);
		dispatch({
			type: type.LOGIN,
			payload: {
				isLoading: false,
				isAuthenticated: true
			}
		});
		history.push("/");
	}
	// axios
	// 	.post("/auth/login", data)
	// 	.then(res => {
	// 		localStorage.setItem(
	// 			"USER_INFO",
	// 			JSON.stringify({ token: res.data.token, user: res.data.user })
	// 		);
	// 		history.push("/");
	// 	})
	// 	.catch(err => {
	// 		Notify.error(
	// 			err.data !== null && typeof err.data !== "undefined"
	// 				? err.data.error.errorDescription
	// 				: "در برقراری ارتباط مشکلی به وجود آمده است.",
	// 			5000
	// 		);
	// 		dispatch({
	// 			type: type.LOGIN,
	// 			payload: {
	// 				isLoading: false,
	// 				isAuthenticated: false
	// 			}
	// 		});
	// 	});
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
