import React from "react";
import { useState } from "react";
import MenuBar from "./Menu";
import sp from "./assets/sp.svg";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ClimbingBoxLoader from "react-spinners/HashLoader";
import { useQuery } from "@tanstack/react-query";

// Fetch album data
const fetchAlbum = async ({ queryKey }) => {
  const [, albumId] = queryKey;
  //const response = await axios.get(`http://localhost:4000/api/album?id=${albumId}`,`http://3.144.97.232/api/album?id=${albumId}`);
  const response = await axios.get(`http://3.144.97.232/api/album?id=${albumId}`);
  const tracksData = response.data.data.album.tracks.items.map((item) => ({
    id: item.uid,
    name: item.track.name,
    duration: item.track.duration.totalMilliseconds,
    streams: item.track.playcount,
    trackNumber: item.track.trackNumber,
    explicit: item.track.contentRating.label === "EXPLICIT",
    artists: item.track.artists.items.map((artist) => artist.profile.name).join(", "),
    url: item.track.uri.split("track:")[1],
  }));
  const totalPlaycount = tracksData.reduce((sum, track) => sum + parseInt(track.streams), 0);
  return { tracksData, totalPlaycount };
};

// Fetch album metadata
const fetchAlbumMeta = async ({ queryKey }) => {
  const [, albumId] = queryKey;
  //const response = await axios.get(`http://localhost:4000/api/albummeta?id=${albumId}`);
  const response = await axios.get(`http://3.144.97.232/api/albummeta?id=${albumId}`);
  return {
    name: response.data.data.album.name,
    image: response.data.data.album.coverArt.sources[2].url,
  };
};

export default function AlbumPage() {
  const location = useLocation();
  const albumId = new URLSearchParams(location.search).get("id");

  const {
    data: albumData,
    isLoading: albumLoading,
    error: albumError,
  } = useQuery({
    queryKey: ["album", albumId],
    queryFn: fetchAlbum,
    enabled: !!albumId,
  });

  const {
    data: albumMeta,
    isLoading: metaLoading,
    error: metaError,
  } = useQuery({
    queryKey: ["albumMeta", albumId],
    queryFn: fetchAlbumMeta,
    enabled: !!albumId,
  });

  if (albumLoading || metaLoading) {
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

  if (albumError || metaError) {
    return <div>Error fetching album data. Please try again.</div>;
  }

  const handleSongClick = (trackId) => {
    window.open(`https://open.spotify.com/track/${trackId}`, "_blank");
  };

  return (
    <>
      <div className="Album-Page">
        <div className="top-header-ap">
          <div className="left-album-img">
            <img src={albumMeta?.image} alt="" />
          </div>
          <div className="right-album-details">
            <div className="title-top">
              <h1>{albumMeta?.name}</h1>
            </div>
            <div className="streams-bottom">
              <h2>TOTAL STREAMS</h2>
              <h3>{albumData?.totalPlaycount.toLocaleString()}</h3>
            </div>
            <div className="select-count-options">
              <img src={sp} alt="" />
            </div>
          </div>
        </div>
        <div className="bottom-main-tl" style={{ display: "flex", flexDirection: "column" }}>
          <div className="tl-title">
            <h1>Track List</h1>
          </div>
          <div className="tracks-list" style={{ display: "flex", flex: 0.9 }}>
            <div className="tracks">
              {albumData?.tracksData.map((track, index) => (
                <div key={track.id} className="song-info" onClick={() => handleSongClick(track.url)}>
                  <div className="song-tl">{index + 1}.</div>
                  <div className="title-tl">{track.name}</div>
                  <div className="streams-tl">{parseInt(track.streams).toLocaleString()}</div>
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
