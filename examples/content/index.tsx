import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import "styles/base.css";

function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

render();

if (module.hot) {
  module.hot.accept("./App", render);
}
