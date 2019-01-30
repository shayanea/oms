import * as type from "./type";

export const clearDashboardData = () => dispatch => {
	dispatch({
		type: type.CLEAR_DASHBOARD_DATA,
		payload: {
			dashboard: null
		}
	});
};
