import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from './components/Home';
import StatsPage from './components/StatsPage';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/summoner/:username">
          <StatsPage />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
