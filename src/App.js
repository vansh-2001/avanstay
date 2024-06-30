import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "containers/Home/Home";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/homes" component={Home} />
        <Route path="/regions/:regionName" component={Home} />
        <Redirect to="/homes" />
      </Switch>
    </Router>
  );
};

export default App;
