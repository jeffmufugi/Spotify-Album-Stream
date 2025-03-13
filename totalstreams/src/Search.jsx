
import React, { useContext, useState, useEffect } from 'react';
import rec from "./assets/Search.svg"; 
import rec1 from "./assets/artist.png";
import MenuBar from './Menu';
import { useNavigate } from "react-router-dom";
export default function SearchPage(){
   

    const [searchFilter,setSearchFilter]=useState(true)
    const [search, setSearch] = useState("");
    const [artistResults,setArtistResults] = useState([]);
    const [albumResults,setAlbumResults] = useState([]);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const changeFilter = (value) => {
      // Only update state if the new value is different from the current one
      if (value !== searchFilter) {
        setSearchFilter(value);
      }
    };
    // Fetch data from the backend API
    const fetchData = async (value) => {
      try {
   
       // const response = await fetch(`http://localhost:4000/api/search?q=${value}`,`http://3.144.97.232/api/search?q=${value}`);
        const response = await fetch(`http://3.144.97.232/api/search?q=${value}`);
   
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();


          const artists = data.artists?.items.map(item => ({
            name: item.data.profile.name,
            image: item.data.visuals?.avatarImage?.sources?.[0]?.url || "default_image_url", // Safely access the image URL
            id: item.data.uri.split(":").pop()
          })) || [];
          
          setArtistResults(artists); // Update the results state with name and image
          setError(""); // Clear any errors
        
   
          const albums = data.albums?.items.map(item => ({
            name: item.data.name,
            image: item.data.coverArt?.sources?.[0]?.url || "default_image_url", // Safely access the image URL
            id: item.data.uri.split(":").pop()
          })) || [];
          setAlbumResults(albums); // Update the results state with name and image
          setError(""); // Clear any errors
      
          if (searchFilter) {
            setResults(artists);
          } else {
            setResults(albums);
          }

      } catch (err) {
        setError(err.message); // Set error message if fetch fails
        setAlbumResults([]); // Clear results in case of an error
        setArtistResults([]);
      }
    };

    // Handle input change
    const handleChange = (value) => {
      setSearch(value); // Update the search state
      if (value.trim()) {
        fetchData(value); // Fetch data only if input is not empty
      } else {
        setResults([]); // Clear results if input is empty
      }
    };
  useEffect(() => {
    if (search.trim()) {
      // Switch between the results based on the selected filter
      if (searchFilter) {
        setResults(artistResults);
      } else {
        setResults(albumResults);
      }
    }
  }, [searchFilter]); 
    
    const handleClick = (Id) => {
      if(searchFilter == true){
        navigate(`/artistinfo?id=${Id}`)
      }
      else {navigate(`/album?id=${Id}`);}
    };
  
    return (
      <>
      <div className='search-page'>
     
      <div className='search-bar'>
        
        <img 
          src={rec} 
          alt="" 
        />
          
          <input 
            type="text" 
            placeholder='Search'
            value={search}
            onChange={(e)=>handleChange(e.target.value)}
          />
      </div>
      <div className="search-options">
 { searchFilter ? (<div 
    className={`bordered-text ${searchFilter ? 'active' : ''}`}
    style={{ backgroundColor: '#464646', color: '#f2f2f2' }}
    onClick={() => changeFilter(true)}  // 'true' represents "Artist"
  >
    Artist
  </div>):(<div 
    className={`bordered-text ${searchFilter ? 'active' : ''}`}
    onClick={() => changeFilter(true)}  // 'true' represents "Artist"
  >
    Artist
  </div>)}
 
  {searchFilter ? (
  <div
    className="bordered-text"
    onClick={() => changeFilter(false)} // 'false' represents "Album"
  >
    Album
  </div>
) : (
  <div
    className="bordered-text"
    style={{ backgroundColor: '#464646', color: '#f2f2f2' }}
    onClick={() => changeFilter(false)} // 'false' represents "Album"
  >
    Album
  </div>
)}

</div>


        <h1 
        className='txt-res'
        >
          Results
        </h1>
 
        <div className='search-results'>
            {
               results.map((result,id)=>{
                return <div className='results' key={id}  onClick={() => handleClick(result.id)}>
                <img src={result.image} alt={result.name} className="artist-image" /> 
                <p>{result.name}</p>
              </div>
              })
              
            }
  
         
        </div>
  
  
        
      <MenuBar/>
      <div className='bottom-nav'></div>
  
  
      </div>
      
       
      </>
    )
  


}