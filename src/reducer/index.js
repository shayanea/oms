import { combineReducers } from "redux";
import auth from "./authReducer";
import dashboard from "./dashboardReducer";
import orders from "./orderReducer";
import products from "./productReducer";
import users from "./userReducer";
import courier from "./courierReducer";
import advisers from "./adviserReducer";

export default combineReducers({
  dashboard,
  auth,
  orders,
  products,
  users,
  courier,
  advisers
});
