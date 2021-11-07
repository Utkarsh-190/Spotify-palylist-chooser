import { useEffect } from "react";
import classes from "./Login.module.css";

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

const Login = () => {
  useEffect(() => {
    if (window.location.hash) {
      const authParamsObj = getAuthParams(window.location.hash);
      window.location.hash = "";
      if (authParamsObj.length < 3) {
        console.log(authParamsObj.error);
      } else {
        console.log(authParamsObj.access_token);
        localStorage.setItem("accessToken", authParamsObj.access_token);
        localStorage.setItem("authDate", new Date());
        localStorage.setItem("expireTime", authParamsObj.expires_in);
        window.location = "http://localhost:3000/";
      }
    }
  }, []);

  const loginHandler = () => {
    window.location = url;
  };

  return (
    <div className={classes.loginPage}>
      <div className={classes.navbar}>Playlist Chooser</div>
      <div className={classes.body}>
        <div className={classes.loginCard}>
          <div>Login to your Spotify account</div>
          <button onClick={loginHandler}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
