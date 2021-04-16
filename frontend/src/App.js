import React, { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import Navbar from './components/Navigation/Navbar';
import AuthContext from './context/AuthContext';
import './App.css';

function App() {

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  // every context object comes with a Provider React component that allows consuming components to subscribe to context changes.
  return (
    <BrowserRouter>
      <>
      <AuthContext.Provider
            value={{
              token: token,
              userId: userId,
              login: login,
              logout: logout
            }}
          >
      <Navbar />
        <main className="main-content">
          <Switch>
            {token && <Redirect from="/" to="/events" exact />}
            {token && (
              <Redirect from="/auth" to="/events" exact />
            )}
            {!token && (
              <Route path="/auth" component={AuthPage} />
            )}
            <Route path="/events" component={EventsPage} />
            {token && (
              <Route path="/bookings" component={BookingsPage} />
            )}
            {!token && <Redirect to="/auth" exact />}
          </Switch>
        </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
}

export default App;
