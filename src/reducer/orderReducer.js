import * as type from "../actions/type";

const initalState = {
  items: [],
  isLoading: false,
  page: 1,
  total: 0,
  search: ""
};

export default function(state = initalState, action) {
  switch (action.type) {
    case type.FETCH_ORDERS:
      return {
        ...state,
        items: action.payload.items,
        isLoading: action.payload.isLoading,
        total: action.payload.total,
        page: action.payload.page,
        search: action.payload.search
      };
    default:
      return state;
  }
}
