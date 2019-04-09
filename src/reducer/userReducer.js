import * as type from "../actions/type";

const initalState = {
  isLoading: false,
  items: [],
  pageNumber: 1,
  total: 0
};

export default function(state = initalState, action) {
  switch (action.type) {
    case type.FETCH_USERS:
      return {
        ...state,
        items: action.payload.items,
        pageNumber: action.payload.pageNumber,
        total: action.payload.total,
        isLoading: action.payload.isLoading
      };
    default:
      return state;
  }
}
