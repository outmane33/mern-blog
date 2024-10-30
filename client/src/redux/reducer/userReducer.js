const initialValue = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
  loading: false,
};

export const userReducer = (state = initialValue, action) => {
  switch (action.type) {
    case "SIGN_IN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "SIGN_IN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.data));
      return {
        ...state,
        user: action.data,
        loading: false,
        error: null,
      };
    case "SIGN_IN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.data,
        user: null,
      };
    default:
      return state;
  }
};
