import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Auth from './pages/Auth';
import AddOption from './pages/AddOption';
import UpdateFolder from './pages/UpdateFolderButton';
import React, { useEffect, useState } from 'react';
import GuardedRoute from './pages/Auth/GuardedRoute';
import VersionNotification from './components/VersionNotification';
import {
  clearAuth,
  getAuthToken,
  loginRequest,
  setAuthSession,
  verifySession,
} from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getAuthToken();
      if (!token) {
        clearAuth();
        setIsLoggedIn(false);
        setAuthReady(true);
        return;
      }

      try {
        await verifySession();
        setIsLoggedIn(true);
      } catch (_) {
        clearAuth();
        setIsLoggedIn(false);
      } finally {
        setAuthReady(true);
      }
    };

    restoreSession();
  }, []);

  const onSubmit = async ({ login, password }) => {
    try {
      const { data } = await loginRequest(login, password);
      setAuthSession({ token: data.token, login: data.login });
      setIsLoggedIn(true);
      setLoginError(false);
    } catch (_) {
      clearAuth();
      setIsLoggedIn(false);
      setLoginError(true);
    }
  };

  if (!authReady) {
    return null;
  }

  return (
    <Router>
      <VersionNotification />
      <Switch>
        <GuardedRoute exact path="/" component={Home} isAuthenticated={isLoggedIn} />
        <GuardedRoute exact path="/option" component={AddOption} isAuthenticated={isLoggedIn} />
        <Route exact path="/auth">
          {isLoggedIn ? <Redirect to="/" /> : <Auth onSubmit={onSubmit} loginError={loginError} />}
        </Route>
        <GuardedRoute exact path="/updateFolder" component={UpdateFolder} isAuthenticated={isLoggedIn} />
      </Switch>
    </Router>
  );
}

export default App;
