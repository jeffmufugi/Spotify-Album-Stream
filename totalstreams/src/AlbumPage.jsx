import React from "react";
import { useState,useRef,useEffect } from "react";
import MenuBar from "./Menu";
import albuming from "./assets/alb.svg";
import yt from "./assets/yt.svg";
import sp from "./assets/sp.svg";
import ap from "./assets/ap.svg";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ClimbingBoxLoader from "react-spinners/HashLoader";
export default function AlbumPage(){
    const [tracks, setTracks] = useState([]);
    const [album, setAlbum] = useState(null);
    const [totalStreams, setTotalStreams] = useState(0);
    const [error, setError] = useState("");
    const location = useLocation();
    const albumId = new URLSearchParams(location.search).get('id');
    

    // Fetch function
    const fetchAlbum = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/album?id=${albumId}`);
          
          // Map through tracks and extract relevant information
          const tracksData = response.data.data.album.tracks.items.map((item) => ({
            id: item.uid,
            name: item.track.name,
            duration: item.track.duration.totalMilliseconds,
            streams: item.track.playcount,
            trackNumber: item.track.trackNumber,
            explicit: item.track.contentRating.label === "EXPLICIT",
            artists: item.track.artists.items.map(artist => artist.profile.name).join(", "),
            url: item.track.uri.split("track:")[1]
          }));
    
          // Calculate total streams
          const totalPlaycount = tracksData.reduce((sum, track) => 
            sum + parseInt(track.streams), 0
          );
          
          setTracks(tracksData);
          setTotalStreams(totalPlaycount);
          setError("");
        } catch (err) {
          setError("Failed to fetch album information");
          setTracks([]);
          setTotalStreams(0);
        }
      };
      const fetchAlbumMeta = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/albummeta?id=${albumId}`);
          
          const albumMetadata = {
            name: response.data.data.album.name,
            image: response.data.data.album.coverArt.sources[2].url
          };
      
          setAlbum(albumMetadata);
          setError("");
        } catch (err) {
          console.error("Error fetching album metadata:", err);
          setError("Failed to fetch album metadata");
          setAlbum(null);
        }
      };
    // Use effect
    useEffect(() => {
      if (albumId) {
        fetchAlbum();
        fetchAlbumMeta();
      }
    }, [albumId]);
   
    if (!album) {
      return   <div style={{backgroundColor:"#f2f2f2",height:"100%",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"100",position:"absolute"}}>
      <ClimbingBoxLoader
        color="#464646"
        size={60}
        loading
        speedMultiplier={1}
      />
      </div>;
    }
    const handleSongClick = (trackId) => {
      window.open(`https://open.spotify.com/track/${trackId}`, "_blank");
      
    };
   return(
   <>
   <div className="Album-Page">
    <div className="top-header-ap">
        <div className="left-album-img">
            <img src={album?.image} alt="" />
        </div>
        <div className="right-album-details">
            <div  className="title-top" >
            <h1>{album?.name}</h1>
            </div>
            <div className="streams-bottom">
            <h2>TOTAL STREAMS</h2>
            <h3>{totalStreams.toLocaleString()}</h3>
            </div>
            <div className="select-count-options">
                {/* <img src={yt} alt="" /> */}
                <img src={sp} alt="" />
                {/* <img src={ap} alt="" /> */}
            </div>
        </div>
    </div>
    <div className="bottom-main-tl" style={{display:"flex",flexDirection:"column"}}>
        <div className="tl-title">
            <h1>Track List</h1>
        </div>
<div className="tracks-list" style={{display:"flex",flex:0.9}}>
<div className="tracks">
      {tracks.map((track, index) => (
        <div key={track.id} className="song-info" onClick={() => handleSongClick(track.url)}>
          <div className="song-tl">{index + 1}.</div>
          <div className="title-tl">{track.name}</div>
          <div className="streams-tl">
            {parseInt(track.streams).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
   

</div>
    </div>




    <MenuBar/>
   </div> 
    </>
    )
}