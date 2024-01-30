// my-app/src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MyApp from "./page/TopPage";

ReactDOM.render(
  <React.StrictMode>
    <MyApp />
  </React.StrictMode>,
  document.getElementById("root")
);
