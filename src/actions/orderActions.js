import * as type from "./type";
import axios from "../utils/requestConfig";
import { Notify } from "zent";

export const getOrders = (size, page, search) => dispatch => {
	let searchQuery = search !== "" ? `&SearchTerm=${search}` : "";
	dispatch({
		type: type.FETCH_ORDERS,
		payload: {
			isLoading: true,
			items: [],
			size,
			page,
			search
		}
	});
	axios
		.get(`/orders?PageNumber=${page}&PageSize=${size}${searchQuery}`)
		.then(res => {
			dispatch({
				type: type.FETCH_ORDERS,
				payload: {
					isLoading: false,
					items: res.data,
					size,
					page,
					search
				}
			});
		})
		.catch(err => {
			Notify.error(
				err.data !== null && typeof err.data !== "undefined"
					? err.data.error.errorDescription
					: "در برقراری ارتباط مشکلی به وجود آمده است.",
				5000
			);
			dispatch({
				type: type.FETCH_ORDERS,
				payload: {
					isLoading: false,
					items: [],
					size,
					page,
					search
				}
			});
		});
};

export const getAssignOrders = (
	size,
	page,
	search,
	productId,
	cityId,
	fromDate,
	toDate
) => dispatch => {
	let searchQuery = search !== "" ? `&SearchTerm=${search}` : "";
	dispatch({
		type: type.FETCH_ASSIGN_ORDERS,
		payload: {
			isLoading: true,
			items: [],
			size,
			page,
			search,
			productId,
			cityId,
			fromDate,
			toDate
		}
	});
	axios
		.get(`/orders?PageNumber=${page}&PageSize=${size}${searchQuery}`)
		.then(res => {
			dispatch({
				type: type.FETCH_ASSIGN_ORDERS,
				payload: {
					isLoading: false,
					items: res.data,
					size,
					page,
					search,
					productId,
					cityId,
					fromDate,
					toDate
				}
			});
		})
		.catch(err => {
			Notify.error(
				err.data !== null && typeof err.data !== "undefined"
					? err.data.error.errorDescription
					: "در برقراری ارتباط مشکلی به وجود آمده است.",
				5000
			);
			dispatch({
				type: type.FETCH_ASSIGN_ORDERS,
				payload: {
					isLoading: false,
					items: [],
					size,
					page,
					search,
					productId,
					cityId,
					fromDate,
					toDate
				}
			});
		});
};

export const manageOrders = (
	size,
	page,
	search,
	productId,
	statusId,
	stationId,
	cityId,
	fromDate,
	toDate
) => dispatch => {
	let searchQuery = search !== "" ? `&SearchTerm=${search}` : "";
	dispatch({
		type: type.FETCH_ASSIGN_ORDERS,
		payload: {
			isLoading: true,
			items: [],
			size,
			page,
			search,
			productId,
			cityId,
			statusId,
			stationId,
			fromDate,
			toDate
		}
	});
	axios
		.get(`/orders?PageNumber=${page}&PageSize=${size}${searchQuery}`)
		.then(res => {
			dispatch({
				type: type.FETCH_ASSIGN_ORDERS,
				payload: {
					isLoading: false,
					items: res.data,
					size,
					page,
					search,
					productId,
					cityId,
					statusId,
					stationId,
					fromDate,
					toDate
				}
			});
		})
		.catch(err => {
			Notify.error(
				err.data !== null && typeof err.data !== "undefined"
					? err.data.error.errorDescription
					: "در برقراری ارتباط مشکلی به وجود آمده است.",
				5000
			);
			dispatch({
				type: type.FETCH_ASSIGN_ORDERS,
				payload: {
					isLoading: false,
					items: [],
					size,
					page,
					search,
					productId,
					statusId,
					stationId,
					cityId,
					fromDate,
					toDate
				}
			});
		});
};
