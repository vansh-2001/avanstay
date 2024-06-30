import React from "react";
import { Link } from "react-router-dom";

import DesktopLogo from "assets/images/logo.svg";
import MobileLogo from "assets/images/logo_sm.svg";
import ArrowDownIcon from "assets/images/icons/arrow_down.svg";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/homes">
        <img src={DesktopLogo} className="desktop-view" alt="desktop logo" />
        <img src={MobileLogo} className="mobile-view" alt="mobile logo" />
      </Link>
      <ul>
        <li className="active">
          <Link to="/">Find Homes</Link>
        </li>
        <li>
          <Link to="/">Partners</Link>
        </li>
        <li>
          <Link to="/">Company Retreats</Link>
        </li>
        <li>
          <Link to="/">
            More
            <img src={ArrowDownIcon} alt="arrow down" />
          </Link>
        </li>
      </ul>
      <div>
        <Link to="/login">Sign In</Link>
        <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

export default Navbar;
