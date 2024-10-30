import { TOGGLE_THEME } from "../types/themeTypes";

const initialValue = {
  theme: JSON.parse(localStorage.getItem("theme")) || "light",
};

export const themeReducer = (state = initialValue, action) => {
  if (action.type === TOGGLE_THEME) {
    let newTheme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", JSON.stringify(newTheme));
    return {
      ...state,
      theme: newTheme,
    };
  }

  return state;
};
