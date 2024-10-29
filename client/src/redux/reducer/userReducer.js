import {
  SIGN_IN_START,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
} from "../types/userTypes";

const initialValue = {
  user: null,
  error: null,
  loading: false,
};

export const userReducer = (state = initialValue, action) => {
  if (action.type === SIGN_IN_START) {
    return {
      loading: true,
      error: null,
    };
  } else if (action.type === SIGN_IN_SUCCESS) {
    return {
      user: action.data,
      loading: false,
      error: null,
    };
  } else if (action.type === SIGN_IN_FAILURE) {
    return {
      loading: false,
      error: action.data,
    };
  }
  return state;
};
