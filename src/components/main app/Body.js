import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import classes from "./Body.module.css";
import { getDefaultNormalizer } from "@testing-library/dom";

const Body = () => {
  let [lists, setLists] = useState({
    userPlaylists: [],
    featuredPlaylists: [],
  });

  const userPlaylistURL = "https://api.spotify.com/v1/me/playlists";
  const featuredPlaylistURL =
    "https://api.spotify.com/v1/browse/featured-playlists";

  const loginAgain = () => {
    localStorage.removeItem("expireTime");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authDate");
    window.location = "http://localhost:3000/";
  };

  const getPlaylistHandler = (url) => {
    const token = localStorage.getItem("accessToken");
    const curDate = new Date();

    if (token == null) {
      alert("You are not logged in.");
      loginAgain();
    } else if (
      Math.abs(curDate - new Date(localStorage.getItem("authDate"))) / 1000 >
      parseInt(localStorage.getItem("expireTime"))
    ) {
      loginAgain();
    } else {
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          if (url === userPlaylistURL) {
            console.log("user", response.data.items);
            setLists((prevState) => {
              return {
                ...prevState,
                userPlaylists: response.data.items,
              };
            });
          } else if (url === featuredPlaylistURL) {
            let arr = response.data.playlists.items;
            // removing common elements
            if (localStorage.getItem("userPlaylists")) {
              let idArray = JSON.parse(
                localStorage.getItem("userPlaylists")
              ).map((playlist) => {
                return playlist.id;
              });

              let toRemoveSet = new Set(idArray);

              arr = arr.filter((playlist) => {
                return !toRemoveSet.has(playlist.id);
              });
            }

            setLists((prevState) => {
              return {
                ...prevState,
                featuredPlaylists: arr,
              };
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getUserPlaylists = () => {
    if (localStorage.getItem("userPlaylists")) {
      setLists((prevState) => {
        return {
          ...prevState,
          userPlaylists: JSON.parse(localStorage.getItem("userPlaylists")),
        };
      });
    }
  };

  useEffect(() => {
    getUserPlaylists();
    getPlaylistHandler(featuredPlaylistURL);
    // getPlaylistHandler(userPlaylistURL);
  }, []);

  const saveHandler = () => {
    // console.log(lists.userPlaylists);
    lists.userPlaylists = lists.userPlaylists.filter((playlist) => {
      return playlist.id !== "dummyId";
    });
    localStorage.setItem("userPlaylists", JSON.stringify(lists.userPlaylists));
  };

  const onDragEndFeaturedList = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    let featureItems = lists.featuredPlaylists;
    let userItems = lists.userPlaylists;
    if (source.droppableId === "featuredListDroppable") {
      let [item] = featureItems.splice(source.index, 1);
      if (destination.droppableId === "userListDroppable") {
        if (userItems) userItems.splice(destination.index, 0, item);
      } else if (destination.droppableId === "featuredListDroppable") {
        featureItems.splice(destination.index, 0, item);
      }
    } else if (source.droppableId === "userListDroppable") {
      let [item] = userItems.splice(source.index, 1);
      if (destination.droppableId === "featuredListDroppable") {
        featureItems.splice(destination.index, 0, item);
      } else if (destination.droppableId === "userListDroppable") {
        if (userItems) userItems.splice(destination.index, 0, item);
      }
    }
    setLists({
      userPlaylists: userItems,
      featuredPlaylists: featureItems,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEndFeaturedList}>
      <div className={classes.body}>
        <div className={classes.navbar}>Playlist Chooser</div>

        <div className={classes.section}>
          <div>
            <div className={classes.playlistsHead}>Featured playlists</div>
            <Droppable droppableId="featuredListDroppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={classes.featuredPlaylists}
                >
                  {lists.featuredPlaylists.map((playlist, index) => {
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
                            id={playlist.id}
                          >
                            <img
                              source={playlist.images[0].url}
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
          </div>

          <div>
            <div className={classes.playlistsHead}>My playlists</div>
            <Droppable droppableId="userListDroppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={classes.userPlaylists}
                >
                  {lists.userPlaylists == null ? (
                    <div>No playlists found</div>
                  ) : (
                    <div></div>
                  )}
                  <div>
                    {lists.userPlaylists.map((playlist, index) => {
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
                              id={playlist.id}
                            >
                              {/* <img
                                source={playlist.imageUrl}
                                src={playlist.imageUrl}
                                alt="playlist image"
                              /> */}
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
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>

        <div className={classes.controlButtons}>
          <button onClick={saveHandler}>Save</button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Body;
