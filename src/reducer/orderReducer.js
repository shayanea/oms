import * as type from "../actions/type";

const initalState = {
	items: [],
	isLoading: false,
	size: 10,
	page: 1,
	search: "",
	assignProperties: {
		productId: null,
		cityId: null,
		fromDate: null,
		toDate: null
	},
	manageProperties: {
		productId: null,
		statusId: null,
		stationId: null,
		cityId: null,
		fromDate: null,
		toDate: null
	}
};

export default function(state = initalState, action) {
	switch (action.type) {
		case type.FETCH_ORDERS:
			return {
				...state,
				items: action.payload.items,
				isLoading: action.payload.isLoading,
				size: action.payload.size,
				page: action.payload.page,
				search: action.payload.search
			};
		case type.FETCH_ASSIGN_ORDERS:
			return {
				...state,
				items: action.payload.items,
				isLoading: action.payload.isLoading,
				size: action.payload.size,
				page: action.payload.page,
				search: action.payload.search,
				assignProperties: {
					productId: action.payload.productId,
					cityId: action.payload.cityId,
					fromDate: action.payload.fromDate,
					toDate: action.payload.toDate
				}
			};
		case type.MANAGE_ORDERS:
			return {
				...state,
				items: action.payload.items,
				isLoading: action.payload.isLoading,
				size: action.payload.size,
				page: action.payload.page,
				search: action.payload.search,
				assignProperties: {
					productId: action.payload.productId,
					cityId: action.payload.cityId,
					fromDate: action.payload.fromDate,
					toDate: action.payload.toDate
				}
			};
		default:
			return state;
	}
}
