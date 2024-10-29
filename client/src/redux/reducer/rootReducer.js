import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
export const routResucer = combineReducers({
  user: userReducer,
});
