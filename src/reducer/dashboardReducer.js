import * as type from "../actions/type";

const initalState = {
	dashboard: null,
	isLoading: false
};

export default function(state = initalState, action) {
	switch (action.type) {
		case type.DASHBOARD:
			return {
				...state,
				dashboard: action.payload.dashboard,
				isLoading: action.payload.isLoading
			};
		case type.CLEAR_DASHBOARD_DATA:
			return {
				...state,
				dashboard: action.payload.dashboard
			};
		default:
			return state;
	}
}
