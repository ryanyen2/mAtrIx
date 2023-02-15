import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
// import logo from "./logo.svg";
import "./App.css";
import Home from "./view/home";
// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

// create state

function App() {
  // use state to store data
  const [data, setData] = useState([12, 5, 6, 6, 9, 10]);
  const [width, setWidth] = useState(700);
  const [height, setHeight] = useState(500);
  const [id, setId] = useState("root");

  
  useEffect(() => {
    fetch("/api/time")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setWidth(700);
        setHeight(500);
        setId("root");
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <div>
            <Link className="App-link" to="/">
              Home
            </Link>
            &nbsp;|&nbsp;
            <Link className="App-link" to="/page2">
              Page2
            </Link>
          </div>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/page2">
              <p>This is page 2!</p>
            </Route>
          </Switch>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
