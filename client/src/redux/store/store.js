import { createStore } from "redux";
import { routResucer } from "../reducer/rootReducer";
import { composeWithDevTools } from "@redux-devtools/extension";

export const store = createStore(routResucer, composeWithDevTools());
