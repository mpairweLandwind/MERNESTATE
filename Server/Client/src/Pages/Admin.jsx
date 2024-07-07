import { useContext, useEffect } from "react";
import "./admin.scss";
import { ThemeContext } from "../context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";
import { Routes, Route } from "react-router-dom";
import MoonIcon from "../assets/icons/moon.svg";
import SunIcon from "../assets/icons/sun.svg";
import BaseLayout from "../layout/BaseLayout";
import { Dashboard, PageNotFound } from "../screens";

const Admin = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <div className="admin">
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>

      <button className="theme-toggle-btn" onClick={toggleTheme}>
        <img className="theme-icon" src={theme === LIGHT_THEME ? SunIcon : MoonIcon} alt="theme icon" />
      </button>
    </div>
  );
}

export default Admin;
