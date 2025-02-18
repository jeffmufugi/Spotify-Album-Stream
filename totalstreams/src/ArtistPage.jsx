import { useState, useEffect } from "react";
import MenuBar from "./Menu";
import albuming from "./assets/art.svg";
import yt from "./assets/yt.svg";
import sp from "./assets/sp.svg";
import ap from "./assets/art.svg";
import a1 from "./assets/ap.svg";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ClimbingBoxLoader from "react-spinners/HashLoader";

export default function ArtistPage() {
  const [artistData, setArtistData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const artistId = new URLSearchParams(location.search).get("id");

  const fetchArtistOverview = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/artistoverview?id=${artistId}`
      );
      const data = response.data.data;
      console.log('Raw top tracks:', data.artist.discography.topTracks?.items);
      const artistOverview = {
        name: data.artist.profile.name,
        id: data.artist.id,
        monthlyListeners: data.artist.stats.monthlyListeners,

        topTracks: (data.artist.discography.topTracks?.items || []).slice(0, 20).map((item) => ({
          id: item.track?.id,
          name: item.track?.name,
          collaborators: item.track?.artists?.items
            .filter(artist => artist.profile.name !== data.artist.profile.name)
            .map(artist => artist.profile.name)
            .join(", "),
          image: item.track?.album?.coverArt?.sources?.[0]?.url || albuming,
          streams: parseInt(item.track?.playcount || '0', 10),
          duration: item.track?.duration?.totalMilliseconds,
          explicit: item.track?.contentRating?.label === 'EXPLICIT'
        })),

        albums: data.artist.discography.albums.items.map((album) => {
          const release = album.releases.items[0];
          return {
            id: release.id,
            name: release.name,
            image: release.coverArt.sources[0]?.url,
            year: release.date.year,
            totalTracks: release.tracks.totalCount,
          };
        }),

        headerImage: data.artist.visuals.headerImage?.sources?.[0]?.url,
        avatarImage: data.artist.visuals.avatarImage?.sources?.[2]?.url,
        shareUrl: data.artist.sharingInfo.shareUrl,
      };
      
      setArtistData(artistOverview);

    } catch (err) {
      setError("Failed to fetch artist overview");

      console.error(err);
    }
  };

  useEffect(() => {
    if (artistId) {
      fetchArtistOverview();
    }
  }, [artistId]);

  const handleAlbumClick = (albumId) => {
    navigate(`/album?id=${albumId}`);
  };


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!artistData) {
    return   <div style={{backgroundColor:"#f2f2f2",height:"100%",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"100",position:"absolute"}}>
    <ClimbingBoxLoader
      color="#464646"
      size={60}
      loading
      speedMultiplier={1}
    />
    </div>;
  }

  const { name, avatarImage, monthlyListeners, topTracks, albums } = artistData;

  return (
    <div className="Artist-Page">
      <div className="top-header-art">
        <div className="left-artist-img">
          <img
            src={avatarImage}
            alt={name}
            style={{ borderRadius: "100%" }}
          />
        </div>

        <div className="right-artist-details">
          <div className="artist-title-top">
            <h1>{name.toUpperCase()}</h1>
          </div>
          <div className="artist-streams-bottom">
            <h2>MONTHLY LISTENERS</h2>
            <h3>{monthlyListeners.toLocaleString()}</h3>
          </div>
          <div className="select-count-options">
            {/* <img src={yt} alt="YouTube" /> */}
            <img src={sp} alt="Spotify" />
            {/* <img src={a1} alt="Apple Music" /> */}
          </div>
        </div>
      </div>

      <div className="bottom-artist-page">
        <div style={{ flexDirection: "column" }}>
          <h1>TOP SONGS</h1>
          <div className="artist-song-list">
  {topTracks.map((single) => (
    <div key={single.id} className="song-list">
      <div className="song-img">
        <img src={single.image} alt={single.name} />
      </div>
     
        <div className="song-name">
          {single.name}
        </div>
        <div className="song-streams">
          {single.streams.toLocaleString()}
        </div>
     
    </div>
  ))}
</div>
        </div>

        <div style={{ flexDirection: "column" }}>
          <h1>ALBUMS</h1>
          <div className="artist-album-list">
            {albums &&
              albums.map((album) => (
                <div className="album-list" key={album.id}>
                  <div className="album-img">
                    <img
                      src={album.image}
                      alt={album.name}
                      onClick={() => handleAlbumClick(album.id)}
                    />
                  </div>
                  <div className="album-name">{album.name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <MenuBar />
    </div>
  );
}