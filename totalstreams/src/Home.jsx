import React from "react";
import MenuBar from "./Menu";
import sp from "./assets/sp.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClimbingBoxLoader from "react-spinners/HashLoader";
import { useQuery } from "@tanstack/react-query";

// Fetch Functions
const fetchTopAlbums = async () => {
 // const response = await axios.get(`http://localhost:4000/api/topalbums`,'http://3.144.97.232/api/topalbums');
  const response = await axios.get('http://3.144.97.232/api/topalbums');
  return response.data.items.map((item) => ({
    id: item.track.album.id,
    name: item.track.album.name,
    image: item.track.album.images[0].url,
  }));
};

const fetchTopSongs = async () => {
  //const response = await axios.get(`http://localhost:4000/api/topsongs`);
  const response = await axios.get(`http://3.144.97.232/api/topsongs`);
  return response.data.items.map((item) => ({
    id: item.track.id, // Changed from item.track.album.id to item.track.id
    albumId: item.track.album.id,
    name: item.track.name,
    image: item.track.album.images[0].url,
  }));
};

const fetchNewMusic = async () => {
  //const response = await axios.get("http://localhost:4000/api/newmusic");
  const response = await axios.get(`http://3.144.97.232/api/newmusic`);
  return (
    response.data.items
      ?.filter((item) => item.track && item.track.album)
      .map((item) => ({
        id: item.track.id, // Changed from item.track.album.id to item.track.id
        albumId: item.track.album.id,
        name: item.track.name,
        image: item.track.album.images?.[0]?.url || "default-image-url",
      })) || []
  );
};


// Component
export default function HomePage() {
  const navigate = useNavigate();

  // React Query for fetching data
  const { data: topAlbums, isLoading: albumsLoading } = useQuery({
    queryKey: ["topAlbums"],
    queryFn: fetchTopAlbums,
  });
  
  const { data: topSongs, isLoading: songsLoading } = useQuery({
    queryKey: ["topSongs"],
    queryFn: fetchTopSongs,
  });
  
  const { data: newMusic, isLoading: newMusicLoading } = useQuery({
    queryKey: ["newMusic"],
    queryFn: fetchNewMusic,
  });
  

  const handleAlbumClick = (albumId) => {
    navigate(`/album?id=${albumId}`);
  };

  // Handle loading state
  if (albumsLoading || songsLoading || newMusicLoading) {
    return (
      <div
        style={{
          backgroundColor: "#f2f2f2",
          height: "100%",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "100",
          position: "absolute",
        }}
      >
        <ClimbingBoxLoader color="#464646" size={60} loading speedMultiplier={1} />
      </div>
    );
  }

  return (
    <>
      <div className="homepage">
        <div className="main-contents-home">
          <div className="top-homepage">
            <div className="title-hp">
              <h1>NEW POPULAR SONGS</h1>
              <div className="select-count-options">
                <img src={sp} alt="" />
              </div>
            </div>
            <div className="main-hp">
              {newMusic.map((song) => (
                <div key={`newMusic-${song.id}`} className="alb-list" onClick={() => handleAlbumClick(song.albumId)}>
                  <div className="alb-img">
                    <img src={song.image} />
                  </div>
                  <div className="alb-name">{song.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bottom-homepage">
            <div className="title-hp">
              <h1>TOP ALBUMS</h1>
            </div>
            <div className="main-hp">
              {topAlbums.map((album) => (
                <div key={`album-${album.id}`} className="artist-list" onClick={() => handleAlbumClick(album.id)}>
                  <div className="artist-img">
                    <img src={album.image} />
                  </div>
                  <div className="artist-name">{album.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bottom-homepage">
            <div className="title-hp">
              <h1>TOP SONGS</h1>
            </div>
            <div className="main-hp">
              {topSongs.map((song) => (
                <div key={`topSong-${song.id}`} className="artist-list" onClick={() => handleAlbumClick(song.albumId)}>
                  <div className="artist-img">
                    <img src={song.image} />
                  </div>
                  <div className="artist-name">{song.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <MenuBar />
      </div>
    </>
  );
}