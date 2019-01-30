import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducer/index";

const initialState = {};

const middleware = [thunk];

const devTools =
	process.env.NODE_ENV === "development"
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
		  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
		: null;

const reduxStore =
	process.env.NODE_ENV === "development"
		? compose(
				applyMiddleware(...middleware),
				devTools
		  )
		: applyMiddleware(...middleware);

// const reduxStore = applyMiddleware(...middleware);

const store = createStore(rootReducer, initialState, reduxStore);

export default store;
