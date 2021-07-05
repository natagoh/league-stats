import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import WebFont from 'webfontloader';

import Home from './components/Home';
import Stats from './components/Stats';

export default function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto Mono', 'Roboto']
      }
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/summoner/:summoner">
          <Stats />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
