import * as type from "./type";
import axios from "../utils/requestConfig";
import { Notify } from "zent";
import { clearDashboardData } from "../actions/globalAction";
import { history } from "../utils/history";

const getAccount = customData => {
  return axios.get(`/accounts/${customData.accountId}`);
};

const getProfile = customData => {
  return axios.get(`/accounts/${customData.accountId}/profile`);
};

export const getProfileAndAccount = customData => dispatch => {
  let result = JSON.parse(localStorage.getItem("USER_INFO"));
  Promise.all([getProfile(customData), getAccount(customData)])
    .then(res => {
      result["fullname"] = `${res[0].data.data.firstName} ${res[0].data.data.lastName}`;
      result["roleId"] = res[1].data.data.roleIds[0];
      result["roleId"] = res[1].data.data.roleIds[0];
      localStorage.setItem("USER_INFO", JSON.stringify(result));
      dispatch({
        type: type.LOGIN,
        payload: {
          isLoading: false,
          isAuthenticated: true
        }
      });
      switch (res[1].data.data.roleIds[0]) {
        case "1":
          return history.push("/");
        case "2":
          return history.push("/");
        case "4":
          return history.push("/");
        case "16":
          return history.push("/order/add");
        case "32":
          return history.push("/couriers/dashboard");
        case "64":
          return history.push("/couriers/dashboard");
        default:
          return history.push("/");
      }
    })
    .catch(err => {
      Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      dispatch({
        type: type.LOGIN,
        payload: {
          isLoading: false,
          isAuthenticated: false
        }
      });
    });
};

export const loginUser = data => dispatch => {
  dispatch({
    type: type.LOGIN,
    payload: {
      isLoading: true,
      isAuthenticated: false
    }
  });
  return axios
    .post("/sessions", data)
    .then(res => {
      localStorage.setItem("USER_INFO", JSON.stringify(res.data.data));
      dispatch(getProfileAndAccount(res.data.data));
    })
    .catch(err => {
      Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
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
