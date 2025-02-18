import { useState,useEffect,useRef } from "react";
import MenuBar from "./Menu";
import albuming from "./assets/art.svg";
import yt from "./assets/yt.svg";
import sp from "./assets/sp.svg";
import ap from "./assets/art.svg";
import a1 from "./assets/ap.svg";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ArtistPage(){

    const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [singles, setSingles] = useState(null);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const location = useLocation();
  const artistId = new URLSearchParams(location.search).get('id');

  const fetchArtistInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/artistinfo?id=${artistId}`);
      const artistData = response.data.artists[0]; // Changed from response.data.artist
      const artistDetails = {
        name: artistData.name || "Unknown Artist", // Changed from artistData.profile?.name
        image: artistData.images[0]?.url || "default_image_url" // Changed from artistData.visuals?.avatarImage?.sources
      };
  
      setArtist(artistDetails);
      setError("");
    } catch (err) {
      setError("Failed to fetch artist information");
      setArtist(null);
    }
  };
  const fetchArtistAlbum = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/artistalbum?id=${artistId}`);
      
      // Map through all albums
      const albumsData = response.data.data.artist.discography.albums.items.map(item => {
        const albumRelease = item.releases.items[0]; // Get first release of each album
        return {
          id: albumRelease.id,
          name: albumRelease.name || "Unknown Album",
          image: albumRelease.coverArt.sources[0]?.url || "default_image_url",
          releaseDate: albumRelease.date.isoString,
          totalTracks: albumRelease.tracks.totalCount,
          shareUrl: albumRelease.sharingInfo.shareUrl
        };
      });
      
      setResults(albumsData);
      setError("");
    } catch (err) {
      setError("Failed to fetch album information");
      setResults([]); // Clear the results state on error
    }
  };
  const fetchArtistDisc = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/artistdisc?id=${artistId}`);
      
      const singlesData = response.data.data.artist.discography.singles.items;
      
      // Extract track IDs
      const trackIds = singlesData.flatMap(single => 
        single.releases.items.map(release => release.id)
      );
  
      // Map singles for rendering
      const singlesList = singlesData.map((single) => {
        const release = single.releases.items[0];
        return {
          id: release.id,
          name: release.name,
          image: release.coverArt.sources[0]?.url,
          streams: '' // Hardcoded as requested
        };
      });
  
      setSingles(singlesList);
      console.log('Track IDs:', trackIds);
  
      return {
        trackIds,
        singlesList
      };
    } catch (err) {
      setError("Failed to fetch artist discography");
      setSingles(null);
      return { trackIds: [], singlesList: [] }; 
    }
  };
  useEffect(() => {
    fetchArtistDisc(artistId)
    fetchArtistInfo(artistId);
    fetchArtistAlbum();
  }, [artistId]);
  
  const handleAlbumClick = (artistId) => {
    navigate(`/album?id=${artistId}`); // Pass artist ID as a query parameter
    
  };
  if (!artist) return <p>Loading...</p>;
    return(
        <>
        <div className="Artist-Page">
        <div className="top-header-art">
        <div className="left-artist-img" >
            <img src={artist.image} alt="" style={{borderRadius:"100%"}}/>
        </div>
        
        <div className="right-artist-details">
            <div  className="artist-title-top" >
            <h1>{artist.name.toUpperCase()}</h1>
            </div>
            <div className="artist-streams-bottom">
            <h2>TOTAL STREAMS</h2>
            <h3>20,950,000,000</h3>
            </div>
            <div className="select-count-options">
                <img src={yt} alt="" />
                <img src={sp} alt="" />
                <img src={a1} alt="" />
            </div>
        </div>
    </div>

    <div className="bottom-artist-page">
        <div style={{flexDirection:"column"}}>
            <h1>TOP SONGS</h1>
            <div className="artist-song-list">
    {singles && singles.map((single) => (
      <div key={single.id} className="song-list">
        <div className="song-img">
          <img src={single.image} alt={single.name} />
        </div>
        <div className="song-name">{single.name}</div>
        <div className="song-streams">{single.streams}</div>
      </div>
    ))}
  </div>
            
       
        </div>

        <div style={{flexDirection:"column"}}>
        <h1>TOP ALBUMS</h1>
        <div className="artist-album-list">
  {results.map((album, index) => (
    <div className="album-list" key={index}>
      <div className="album-img">
        <img src={album.image} alt={album.name}onClick={() => handleAlbumClick(album.id)}/>
      </div>
      <div className="album-name">{album.name}</div>
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