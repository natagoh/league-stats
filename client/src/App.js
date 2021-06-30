import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from './components/Home';
import Stats from './components/Stats';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/summoner/:username">
          <Stats />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
