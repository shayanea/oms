import * as type from "./type";
import axios from "../utils/requestConfig";
import { Notify } from "zent";

export const getUserProfile = (array, page, data) => dispatch => {
  return axios
    .get(`/profiles?AccountId=${array}&AccountId_op=in`)
    .then(res => {
      dispatch({
        type: type.FETCH_USERS,
        payload: {
          isLoading: false,
          items: data,
          accounts: res.data.data,
          pageNumber: page,
          total: res.data.meta.totalCount
        }
      });
    })
    .catch(err => {
      Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      dispatch({
        type: type.FETCH_USERS,
        payload: {
          isLoading: false,
          items: [],
          accounts: [],
          pageNumber: page,
          total: 0
        }
      });
    });
};

export const getUsers = page => dispatch => {
  dispatch({
    type: type.FETCH_USERS,
    payload: {
      isLoading: true,
      items: [],
      accounts: [],
      pageNumber: page,
      total: 0
    }
  });
  return axios
    .get(`/accounts?_pageSize=10&_pageNumber=${page}`)
    .then(res => {
      let result = res.data.data.map(e => e.id).join(",");
      if (result !== "") {
        dispatch(getUserProfile(result, page, res.data.data));
      } else {
        dispatch({
          type: type.FETCH_USERS,
          payload: {
            isLoading: false,
            items: [],
            accounts: [],
            pageNumber: page,
            total: res.data.meta.totalCount
          }
        });
      }
    })
    .catch(err => {
      Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      dispatch({
        type: type.FETCH_USERS,
        payload: {
          isLoading: false,
          items: [],
          accounts: [],
          pageNumber: page,
          total: 0
        }
      });
    });
};
