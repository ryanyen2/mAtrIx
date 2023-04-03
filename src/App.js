import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "./components/AppBar";
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import Home from "./view/home";
import Sample from "./view/sample";




function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Navbar /> */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/sample" component={Sample} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
