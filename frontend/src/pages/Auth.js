// TODO: use Apollo instead of fetch

import React, { useState, useRef, useContext } from 'react';
import AuthContext from '../context/auth-context';
import './Auth.css'


function AuthPage() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const authContext = useContext(AuthContext);
  const emailEl = useRef(null);
  const passwordEl = useRef(null);

  const switchLoginStatusHandler = () => {
    setIsLoggedIn(prevLoginStatus => {
      return !prevLoginStatus
    })
  }

  const submitHandler = (event) => {
    event.preventDefault();
    console.log('submit', isLoggedIn)
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!isLoggedIn) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      };
    }

  fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          authContext.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err); // TypeError: Cannot read property 'token' of undefined
      });
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl} />
      </div>
      <div className="form-actions">
        <button type="submit">Enter</button>
        <button type="button" onClick={switchLoginStatusHandler}>
          Switch to {isLoggedIn ? 'Signup' : 'Login'}
        </button>
      </div>
    </form>
  );
}

export default AuthPage;
