import React from 'react';
// NavLink updates our url with reloading the page
// different than link because is highlighted when the page you are on is the link that is clicked
// TODO: create an open source side drawer componet (storybook included) and import here via npm
// this is an jsx element so can't be targeted by css but it renders an archor tag so you can use that to target it from css
// this will add .active class ... seperate from the :active and :hover default css classes
import { NavLink } from 'react-router-dom';
// TODO: convert to scss
import './Navbar.css';

function Navbar() {
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1> Test Page </h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/auth"> Auth </NavLink>
          </li>
          <li>
            <NavLink to="/events"> Events </NavLink>
          </li>
          <li>
            <NavLink to="/bookings"> Bookings </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
