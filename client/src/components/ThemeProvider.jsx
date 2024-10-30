import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function ThemeProvider({ children }) {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
