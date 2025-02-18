
import React, { useContext, useState, useEffect } from 'react';
import rec from "./assets/Search.svg"; 
import rec1 from "./assets/artist.png";
import MenuBar from './Menu';
import { useNavigate } from "react-router-dom";
export default function SearchPage(){
   
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Fetch data from the backend API
    const fetchData = async (value) => {
      try {
   
        const response = await fetch(`http://localhost:4000/api/search?q=${value}`);
   
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const artists = data.artists?.items.map(item => ({
          name: item.data.profile.name,
          image: item.data.visuals?.avatarImage?.sources?.[0]?.url || "default_image_url", // Safely access the image URL
          id: item.data.uri.split(":").pop()
        })) || [];
        
        setResults(artists); // Update the results state with name and image
        setError(""); // Clear any errors
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
        setResults([]); // Clear results in case of an error
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

    const handleArtistClick = (artistId) => {
      navigate(`/artistinfo?id=${artistId}`); // Pass artist ID as a query parameter
     
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
            placeholder='Artist Search'
            value={search}
            onChange={(e)=>handleChange(e.target.value)}
          />
      </div>
  
        <h1 
        className='txt-res'
        >
          Results
        </h1>
        
        <div className='search-results'>
            {
               results.map((result,id)=>{
                return <div className='results' key={id}  onClick={() => handleArtistClick(result.id)}>
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