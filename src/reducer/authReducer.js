import * as type from "../actions/type";

const initalState = {
	isLoading: false,
	isAuthenticated: true
};

export default function(state = initalState, action) {
	switch (action.type) {
		case type.LOGIN:
			return {
				...state,
				isLoading: action.payload.isLoading,
				isAuthenticated: action.payload.isAuthenticated
			};
		case type.LOGOUT:
			return {
				...state,
				isAuthenticated: action.payload.isAuthenticated
			};
		default:
			return state;
	}
}
