import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "./components/AppBar";
import {
  BrowserRouter,
  Link,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import Home from "./view/home";
import Sample from "./view/sample";




function App() {
  useEffect(() => {
    fetch("/api/time")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/sample" component={Sample} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
