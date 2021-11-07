import { useState } from "react";
import "./App.css";
import Login from "./components/login/Login";
import Body from "./components/main app/Body";

function App() {
  let [loggedin, setLoggedin] = useState(false);
  // localStorage.clear();
  if (localStorage.getItem("accessToken") !== null && loggedin === false) {
    setLoggedin(true);
  } else if (
    localStorage.getItem("accessToken") === null &&
    loggedin === true
  ) {
    setLoggedin(false);
  }
  return <div className="app">{loggedin ? <Body /> : <Login />}</div>;
}

export default App;
