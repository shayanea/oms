import * as type from "./type";
import axios from "../utils/requestConfig";
import { Notify } from "zent";

export const getOrders = (page, search) => dispatch => {
  let searchQuery = search !== "" ? `&Address=${search}&Address_op=has&Address_combineOp=or&FirstPhoneNumber=${search}&FirstPhoneNumber_op=has&FirstPhoneNumber_combineOp=or` : "";
  let userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  dispatch({
    type: type.FETCH_ORDERS,
    payload: {
      isLoading: true,
      items: [],
      page,
      search
    }
  });
  axios
    .get(`/orders?PageNumber=${page}&PageSize=30&StatusId=101&_sort=-CreationDateTime&CreatedByAccountId=${userInfo.accountId}${searchQuery}`)
    .then(res => {
      dispatch({
        type: type.FETCH_ORDERS,
        payload: {
          isLoading: false,
          items: res.data.data,
          page,
          search
        }
      });
    })
    .catch(err => {
      Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      dispatch({
        type: type.FETCH_ORDERS,
        payload: {
          isLoading: false,
          items: [],
          page,
          search
        }
      });
    });
};

export const getNonAssignOrders = (page, search, city = null, product = null) => dispatch => {
  let searchQuery = search !== "" ? `&Address=${search}&Address_op=has&Address_combineOp=or&FirstPhoneNumber=${search}&FirstPhoneNumber_op=has&FirstPhoneNumber_combineOp=or` : "";
  let cityQuery = city !== null ? `&CityId=${city}&CityId_op=in&` : "";
  dispatch({
    type: type.FETCH_ORDERS,
    payload: {
      isLoading: true,
      items: [],
      total: 0,
      page,
      search
    }
  });
  axios
    .get(`/orders?PageNumber=${page}&PageSize=30&StatusId=101&_sort=-CreationDateTime${cityQuery}${searchQuery}`)
    .then(res => {
      dispatch({
        type: type.FETCH_ORDERS,
        payload: {
          isLoading: false,
          items: res.data.data,
          total: res.data.meta.totalCount,
          page,
          search
        }
      });
    })
    .catch(err => {
      Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      dispatch({
        type: type.FETCH_ORDERS,
        payload: {
          isLoading: false,
          items: [],
          page,
          total: 0,
          search
        }
      });
    });
};

export const getAssignOrders = (page, search, city = null, product = null, courier = null) => dispatch => {
  let searchQuery = search !== "" ? `&Address=${search}&Address_op=has&Address_combineOp=or&FirstPhoneNumber=${search}&FirstPhoneNumber_op=has&FirstPhoneNumber_combineOp=or` : "";
  let cityQuery = city !== null ? `&CityId=${city}&CityId_op=in&` : "";
  let productQuery = product !== null ? `&ProductId=${product}&ProductId_op=in&` : "";
  let courierQuery = courier !== null ? `&CourierId=${courier}&CourierId_op=in&` : "";
  dispatch({
    type: type.FETCH_ORDERS,
    payload: {
      isLoading: true,
      items: [],
      page,
      total: 0,
      search
    }
  });
  axios
    .get(`/orders?PageNumber=${page}&PageSize=30&StatusId=201&_sort=-CreationDateTime${cityQuery}${productQuery}${courierQuery}${searchQuery}`)
    .then(res => {
      dispatch({
        type: type.FETCH_ORDERS,
        payload: {
          isLoading: false,
          items: res.data.data,
          total: res.data.meta.totalCount,
          page,
          search
        }
      });
    })
    .catch(err => {
      Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      dispatch({
        type: type.FETCH_ORDERS,
        payload: {
          isLoading: false,
          items: [],
          page,
          total: 0,
          search
        }
      });
    });
};

export const getAllOrders = (page, search, city = null, product = null, courier = null, status = null) => dispatch => {
  let searchQuery = search !== "" ? `&Address=${search}&Address_op=has&Address_combineOp=or&FirstPhoneNumber=${search}&FirstPhoneNumber_op=has&FirstPhoneNumber_combineOp=or` : "";
  let cityQuery = city !== null ? `&CityId=${city}&CityId_op=in&` : "";
  let productQuery = product !== null ? `&ProductId=${product}&ProductId_op=in&` : "";
  let courierQuery = courier !== null ? `&CourierId=${courier}&CourierId_op=in&` : "";
  let statusQuery = courier !== null ? `&StatusId=${courier}&StatusId_op=in&` : "";
  dispatch({
    type: type.FETCH_ORDERS,
    payload: {
      isLoading: true,
      items: [],
      page,
      total: 0,
      search
    }
  });
  axios
    .get(`/orders?PageNumber=${page}&PageSize=30&_sort=-CreationDateTime${cityQuery}${productQuery}${courierQuery}${statusQuery}${searchQuery}`)
    .then(res => {
      dispatch({
        type: type.FETCH_ORDERS,
        payload: {
          isLoading: false,
          items: res.data.data,
          total: res.data.meta.totalCount,
          page,
          search
        }
      });
    })
    .catch(err => {
      Notify.error(err.data !== null && typeof err.data !== "undefined" ? err.data.error.errorDescription : "در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
      dispatch({
        type: type.FETCH_ORDERS,
        payload: {
          isLoading: false,
          items: [],
          page,
          total: 0,
          search
        }
      });
    });
};
