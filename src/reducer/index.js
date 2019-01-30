import { combineReducers } from "redux";
import auth from "./authReducer";
import dashboard from "./dashboardReducer";
import orders from "./orderReducer";

export default combineReducers({
	dashboard,
	auth,
	orders
});
