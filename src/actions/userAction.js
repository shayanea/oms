import * as type from "./type";
import axios from "../utils/requestConfig";
import { Notify } from "zent";

export const getUsers = page => dispatch => {
  dispatch({
    type: type.FETCH_USERS,
    payload: {
      isLoading: true,
      items: [],
      pageNumber: page,
      total: 0
    }
  });
  return axios
    .get(`/accounts?_PageSize=30?_pageNumber=${page}&IsBanned=false&_sort=-id`)
    .then(res => {
      dispatch({
        type: type.FETCH_USERS,
        payload: {
          isLoading: false,
          items: res.data.data,
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
          pageNumber: page,
          total: 0
        }
      });
    });
};
