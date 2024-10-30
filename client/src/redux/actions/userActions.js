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

export const signInStart = () => {
  return { type: SIGN_IN_START };
};

export const signInSuccess = (data) => {
  return { type: SIGN_IN_SUCCESS, data: data };
};

export const signInFailure = (data) => {
  return { type: SIGN_IN_FAILURE, data: data };
};

export const updateStart = () => {
  return { type: UPDATE_USER_START };
};

export const updateSuccess = (data) => {
  return { type: UPDATE_USER_SUCCESS, data: data };
};

export const updateFailure = (data) => {
  return { type: UPDATE_USER_FAILURE, data: data };
};

export const deleteStart = () => {
  return { type: DELETE_USER_START };
};

export const deleteSuccess = () => {
  return { type: DELETE_USER_SUCCESS };
};
export const deleteFailure = (data) => {
  return { type: DELETE_USER_FAILURE, data: data };
};

export const logoutSuccess = () => {
  return { type: LOGOUT_SUCCESS };
};
