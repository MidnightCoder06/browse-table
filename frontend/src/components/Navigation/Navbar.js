import React from 'react';
// NavLink updates our url with reloading the page
// different than link because is highlighted when the page you are on is the link that is clicked
// TODO: create an open source side drawer componet (storybook included) and import here via npm
// this is an jsx element so can't be targeted by css but it renders an archor tag so you can use that to target it from css
// this will add .active class ... seperate from the :active and :hover default css classes
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
// TODO: convert to scss
import './Navbar.css';

const Navbar = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1> Test Page </h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <li>
                  <NavLink to="/bookings">Bookings</NavLink>
                </li>
              )}
            </ul>
          </nav>
        </header>
       );
     }}
    </AuthContext.Consumer>
  );

export default Navbar;
