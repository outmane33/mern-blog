import { createStore } from "redux";
import { routResucer } from "../reducer/rootReducer";
import { composeWithDevTools } from "@redux-devtools/extension";

//1. create store
export const store = createStore(routResucer, composeWithDevTools());
