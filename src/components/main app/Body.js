import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import classes from "./Body.module.css";

const Body = () => {
  let [userPlaylists, setUserPlaylists] = useState([]);
  let [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  let userPlaylistsRef = useRef(null);

  const userPlaylistURL = "https://api.spotify.com/v1/me/playlists";
  const featuredPlaylistURL =
    "https://api.spotify.com/v1/browse/featured-playlists";

  const getPlaylistHandler = (url) => {
    const token = localStorage.getItem("accessToken");
    const curDate = new Date();

    if (token == null) {
      alert("You are not logged in.");
      localStorage.clear();
      window.location = "http://localhost:3000/";
    } else if (
      Math.abs(curDate - new Date(localStorage.getItem("authDate"))) / 1000 >
      parseInt(localStorage.getItem("expireTime"))
    ) {
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
            setUserPlaylists(response.data.items);
          } else if (url === featuredPlaylistURL) {
            setFeaturedPlaylists(response.data.playlists.items);
          }
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

  const saveHandler = () => {
    console.dir(userPlaylistsRef.current);
  };

  const onDragEndFeaturedList = (result) => {
    console.log(result);
    const { source, destination, draggableId } = result;
    if (!destination) return;

    let featureItems = featuredPlaylists;
    let userItems = userPlaylists;
    if (source.droppableId === "featuredListDroppable") {
      let [item] = featureItems.splice(source.index, 1);
      if (destination.droppableId === "userListDroppable") {
        userItems.splice(destination.index, 0, item);
      } else if (destination.droppableId === "featuredListDroppable") {
        featureItems.splice(destination.index, 0, item);
      }
    } else if (source.droppableId === "userListDroppable") {
      let [item] = userItems.splice(source.index, 1);
      if (destination.droppableId === "featuredListDroppable") {
        featureItems.splice(destination.index, 0, item);
      } else if (destination.droppableId === "userListDroppable") {
        userItems.splice(destination.index, 0, item);
      }
    }
    setFeaturedPlaylists(featureItems);
    setUserPlaylists(userItems);

    // let items = featuredPlaylists;
    // let [item] = items.splice(source.index, 1);
    // items.splice(destination.index, 0, item);
    // // console.log(items);
    // setFeaturedPlaylists(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEndFeaturedList}>
      <div className={classes.body}>
        <div className={classes.navbar}>Playlist Chooser</div>

        <div className={classes.section}>
          <Droppable droppableId="featuredListDroppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={classes.featuredPlaylists}
              >
                {featuredPlaylists.map((playlist, index) => {
                  return (
                    <Draggable
                      key={playlist.id}
                      draggableId={playlist.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={classes.listItem}
                        >
                          <img
                            src={playlist.images[0].url}
                            alt="playlist image"
                          />
                          <div>{playlist.name}</div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* copied from above */}

          <Droppable droppableId="userListDroppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={classes.userPlaylists}
              >
                {userPlaylists.map((playlist, index) => {
                  return (
                    <Draggable draggableId={playlist.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          key={playlist.id}
                          className={classes.listItem}
                        >
                          <img
                            src={playlist.images[0].url}
                            alt="playlist image"
                          />
                          <div>{playlist.name}</div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* original without any changes */}
          {/* <div className={classes.userPlaylists} ref={userPlaylistsRef}>
            {userPlaylists.map((playlist) => {
              return (
                <div key={playlist.id} className={classes.listItem}>
                  <img src={playlist.images[0].url} alt="playlist image" />
                  <div>{playlist.name}</div>
                </div>
              );
            })}
          </div> */}
        </div>

        <div className={classes.controlButtons}>
          <button onClick={saveHandler}>Save</button>
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
    </DragDropContext>
  );
};

export default Body;
