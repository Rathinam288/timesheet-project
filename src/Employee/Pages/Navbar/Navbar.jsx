import React from "react";
import "./Navbar.css";
import Search from "../../Components/Search/Search";
import { useLocation } from "react-router-dom";
import ThemeToggle from "./Theme_toggle/ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const isSettingsPage = location.pathname === "/employee/Mainsettings";

  return (
    <div className="navbar">
      <div className="search">
        <Search />
      </div>

      {isSettingsPage && (
        <div className="toggles">
          <ThemeToggle />
        </div>
      )}
    </div>
  );
};

export default Navbar;
