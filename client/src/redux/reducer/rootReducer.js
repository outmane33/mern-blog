import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { themeReducer } from "./themeReducer";

export const routResucer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});
