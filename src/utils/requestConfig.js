import axios from "axios";
import store from "../store";
import { LOGOUT } from "../actions/type";
import { history } from "./history";

var axiosInstance = axios.create({
	baseURL: "http://37.156.29.54:8082/api/",
	responseType: "json",
	headers: {
		"Content-Type": "application/json;charset=UTF-8",
		Accept: "application/json"
	}
});

axiosInstance.interceptors.request.use(config => {
	let userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
	config.headers.Authorization = userInfo ? `bearer ${userInfo.token}` : "";
	return config;
});

axiosInstance.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response.status === 401) {
			store.dispatch({
				type: LOGOUT,
				payload: {
					isAuthenticated: false
				}
			});
			history.push(`/login`);
		}
		return Promise.reject(error.response);
	}
);

export default axiosInstance;
