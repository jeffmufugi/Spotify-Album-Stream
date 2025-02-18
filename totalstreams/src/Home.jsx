import { useState,useEffect,useRef } from "react";
import React from "react";
import MenuBar from "./Menu";
import ap from "./assets/art.svg";
import yt from "./assets/yt.svg";
import sp from "./assets/sp.svg";
import app from "./assets/ap.svg";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ClimbingBoxLoader from "react-spinners/HashLoader";

export default function HomePage(){

  const [topAlbums, setTopAlbums] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [newMusic, setNewMusic] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const fetchTopAlbums = async () => {
    try{
      const response = await axios.get(
        `http://localhost:4000/api/topalbums`
      );
      const data = response.data.items.map((item) => ({
        id: item.track.album.id,
        name: item.track.album.name,
        image: item.track.album.images[0].url 
      }));

    setTopAlbums(data);
    } catch(error){
      console.error(error);
    }         
  }


  const fetchTopSongs = async () => {
    try{
      const response = await axios.get(
        `http://localhost:4000/api/topsongs`
      );
      const data = response.data.items.map((item)=>({
        id: item.track.album.id,
        name: item.track.name,
        image: item.track.album.images[0].url
        
      }));

      setTopSongs(data);
    } catch(error){
      console.error(error);
    }


  }

  const fetchNewMusic = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/newmusic");
  
      const data = response.data.items
        ?.filter((item) => item.track && item.track.album) // Ensure track and album exist
        .map((item) => ({
          id: item.track.album.id,
          name: item.track.name,
          image: item.track.album.images?.[0]?.url || "default-image-url",
        })) || [];
  
      setNewMusic(data);
    } catch (error) {
      console.error("Error fetching new music:", error);
    }
  };
  

  useEffect(() => {
    fetchTopAlbums();
    fetchTopSongs();
    fetchNewMusic();
  }, []);

  const handleAlbumClick = (albumId) => {
    navigate(`/album?id=${albumId}`);
    
  };

  if (topAlbums.length === 0 || topSongs.length === 0 || newMusic.length === 0) {
    return   <div style={{backgroundColor:"#f2f2f2",height:"100%",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"100",position:"absolute"}}>
    <ClimbingBoxLoader
      color="#464646"
      size={60}
      loading
      speedMultiplier={1}
    />
    </div>;
  }

    return(<>
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
                {newMusic.map((song)=>(
  <div className="alb-list" onClick={() => handleAlbumClick(song.id)}>
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
    <div className="artist-list" onClick={() => handleAlbumClick(album.id)}>
    <div className="artist-img">
      <img src={album.image}/>
    </div>
    <div className="artist-name">{album.name}</div>
  </div>
))}


</div>
            
            </div>
            
        </div>

        <div className="bottom-homepage">
          <div className="title-hp">
                <h1>TOP SONGS</h1>
                <div className="select-count-options">
            


            </div>
                </div>

                
  <div className="main-hp">

{topSongs.map((album) => (
    <div className="artist-list" onClick={() => handleAlbumClick(album.id)}>
    <div className="artist-img">
      <img src={album.image}/>
    </div>
    <div className="artist-name">{album.name}</div>
  </div>
))}


</div>
            
            </div>
    <MenuBar/>
    </div>
    
    </>)
}