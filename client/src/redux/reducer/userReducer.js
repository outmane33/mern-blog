import {
  SIGN_IN_START,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  UPDATE_USER_START,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_START,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  LOGOUT_SUCCESS,
} from "../types/userTypes";

const initialValue = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
  loading: false,
};

export const userReducer = (state = initialValue, action) => {
  switch (action.type) {
    case SIGN_IN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SIGN_IN_SUCCESS:
      localStorage.setItem("user", JSON.stringify(action.data));
      return {
        ...state,
        user: action.data,
        loading: false,
        error: null,
      };
    case SIGN_IN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
        user: null,
      };
    case UPDATE_USER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_USER_SUCCESS:
      localStorage.setItem("user", JSON.stringify(action.data));
      return {
        ...state,
        user: action.data,
        loading: false,
        error: null,
      };
    case UPDATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    case DELETE_USER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_USER_SUCCESS:
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };
    case DELETE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem("user");
      console.log("logout");
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};
