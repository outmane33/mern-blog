import {
  SIGN_IN_START,
  SIGN_IN_FAILURE,
  SIGN_IN_SUCCESS,
} from "../types/userTypes";

export const signInStart = () => {
  return { type: SIGN_IN_START };
};

export const signInSuccess = (data) => {
  return { type: SIGN_IN_SUCCESS, data: data };
};

export const signInFailure = (data) => {
  return { type: SIGN_IN_FAILURE, data: data };
};
