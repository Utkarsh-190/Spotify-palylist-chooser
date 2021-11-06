import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./Body.module.css";

const Body = () => {
  let [userPlaylists, setUserPlaylists] = useState([]);
  let [featuredPlaylists, setFeaturedPlaylists] = useState([]);

  const userPlaylistURL = "https://api.spotify.com/v1/me/playlists";
  const featuredPlaylistURL =
    "https://api.spotify.com/v1/browse/featured-playlists";

  const getPlaylistHandler = (url) => {
    const token = localStorage.getItem("accessToken");
    const curDate = new Date();
    if (token == null) {
      alert("You are not logged in.");
    } else if (curDate.getHours() > localStorage.getItem("authHour")) {
      localStorage.clear();
      window.location = "http://localhost:3000/";
    } else {
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          if (url === userPlaylistURL) {
            console.log(response.data.items);
            setUserPlaylists(response.data.items);
          } else if (url === featuredPlaylistURL) {
            console.log(response.data.playlists.items);
            setFeaturedPlaylists(response.data.playlists.items);
          }
          // console.log(response);
          // setter(response.data.items);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    getPlaylistHandler(featuredPlaylistURL);
    getPlaylistHandler(userPlaylistURL);
  }, []);

  return (
    <div className={classes.body}>
      <div className={classes.navbar}>Playlist Chooser</div>

      <div className={classes.section}>
        <div className={classes.featuredPlaylist}>
          {featuredPlaylists.map((playlist) => {
            return (
              <div key={playlist.id}>
                <div>
                  <img
                    src={playlist.images[0].url}
                    style={{ height: "60px", width: "60px" }}
                    alt="playlist image"
                  />
                </div>
                <div>{playlist.name}</div>
              </div>
            );
          })}
        </div>

        <div className={classes.myPlaylist}>
          {userPlaylists.map((playlist) => {
            return (
              <div key={playlist.id}>
                <div>
                  <img
                    src={playlist.images[0].url}
                    style={{ height: "60px", width: "60px" }}
                    alt="playlist image"
                  />
                </div>
                <div>{playlist.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={classes.controlButtons}>
        <button>Save</button>
      </div>
      {/* <button onClick={getPlaylistHandler}>Show Playlist</button>
      <div>
        {userPlaylists.map((playlist) => {
          return (
            <div key={playlist.id}>
              <div>
                <img
                  src={playlist.images[0].url}
                  style={{ height: "60px", width: "60px" }}
                  alt="playlist image"
                />
              </div>
              <div>{playlist.name}</div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default Body;
