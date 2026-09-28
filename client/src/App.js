import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Auth from './pages/Auth';
import AddOption from './pages/AddOption';
import UpdateFolder from './pages/UpdateFolderButton';
import React, { useEffect, useState } from 'react';
import GuardedRoute from './pages/Auth/GuardedRoute';
import VersionNotification from './components/VersionNotification';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    // Check localStorage for authentication status on app load
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }
  },[])

  const onSubmit = ({login, password}) => {

    const ifValid = {
        login: 'xyz',
        password: '1111'
    }
    const isValidLogin = login === ifValid.login && password === ifValid.password;
    // isValidLogin ? setIsLoggedIn(true) : setIsLoggedIn(false)
    if(isValidLogin) {
      setIsLoggedIn(true);
      setLoginError(false);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('login', login);
    } else {
      setIsLoggedIn(false);
      setLoginError(true);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('login');
    }

  };  
  return (
    <Router>
      <VersionNotification />
      <Switch>
        {/* <Route exact path="/">
          <Home />
        </Route> */}
        <GuardedRoute exact path="/" component={Home} isAuthenticated={isLoggedIn} />
        {/* <GuardedRoute exact path="/option" component={AddOption} isAuthenticated={isLoggedIn} /> */}
        <Route exact path="/option"><AddOption /></Route>
        <Route exact path="/auth">
          {isLoggedIn ? <Redirect to="/" /> : <Auth onSubmit={onSubmit} loginError={loginError} />}
        </Route>
        {/* <Route path="/users/:id">
          <UserProfile />
        </Route> */}
        <Route exact path="/updateFolder">
          <UpdateFolder />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
