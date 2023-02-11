import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useAsync } from 'react-hook-async';
import io from 'socket.io-client';
import { Header, Footer } from './components/layout';
import Auth from './containers/auth';
import NewPost from './containers/newPost';
import Home from './containers/home';
import Post from './containers/post';
import Profile from './containers/profile';
import Settings from './containers/settings';
import Chat from './containers/chat';
import AuthContext from './contexts/auth';
import { me } from './api/profile';

import {connect, disconnect} from "./socket"

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [profileApi, fetchProfile] = useAsync(null, me);

  useEffect(() => {
    if(authUser){
      connect(authUser.user._id)
    }
    return () =>{
      disconnect()
    }
  }, [authUser]);

  useEffect(() => {
    if (!authUser) {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        fetchProfile(jwt).then((user) => setAuthUser(user));
      }
    }
  }, [authUser, fetchProfile, setAuthUser]);
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      <div className="d-flex flex-column">
        <Header />
        <div className="flex-grow-1">
          <Route path="/" exact component={Home} />
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/new" component={NewPost} />
            <Route path="/settings" component={Settings} />
            <Route path="/:username" exact component={Profile} />
          </Switch>
          <Route path="/:username/:slug" component={Post} />
        </div>
        <Route path="/auth" component={Footer} />
        <Route path="/:username/:slug" component={Footer} />
        <Chat />
      </div>
    </AuthContext.Provider>
  );
}
export default App;