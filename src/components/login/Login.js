import { useState, useEffect } from "react";
import classes from "./Login.module.css";
import axios from "axios";

const Login = () => {
  let [authObj, setAuthObj] = useState({});

  let url = "https://accounts.spotify.com/authorize?";
  url += "client_id=" + "b62100f5a45b4136aff25a6e265201ea&";
  url += "redirect_uri=" + "http://localhost:3000/&";
  url += "response_type=" + "token&";
  url += "show_dialog&";
  url +=
    "scope=" +
    "playlist-modify-private%20playlist-read-private%20playlist-modify-public%20playlist-read-collaborative";

  const getAuthParams = (hashString) => {
    hashString = hashString.substring(1);
    const authParams = hashString.split("&");
    const authParamsObj = authParams.reduce((accumulator, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulator[key] = value;
      return accumulator;
    }, {});
    return authParamsObj;
  };

  useEffect(() => {
    if (window.location.hash) {
      const authParamsObj = getAuthParams(window.location.hash);
      window.location.hash = "";
      if (authParamsObj.length < 3) {
        console.log(authParamsObj.error);
      } else {
        console.log(authParamsObj.access_token);
        setAuthObj(authParamsObj);
      }
    }
  }, []);

  const loginHandler = () => {
    window.location = url;
  };

  const getPlaylistHandler = () => {
    axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: "Bearer " + authObj.access_token,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.loginPage}>
      <div>Login to your Spotify account</div>
      <button onClick={loginHandler}>Login</button>
      <button onClick={getPlaylistHandler}>Show Playlist</button>
    </div>
  );
};

export default Login;
