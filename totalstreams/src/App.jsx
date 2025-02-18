import { useState, useRef, useEffect } from 'react'
import SearchPage from './Search';
import AlbumPage from './AlbumPage';
import ArtistPage from './ArtistPage';
import HomePage from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function App() {

  
  const [loading, setLoading] = useState(true);
  useEffect(()=>{

      setTimeout(()=>{
        setLoading(false)
      },1500)
  },[])


  return (
    <Router>
       <div className="app-container">
       <Routes>
       <Route path="/" element={
                <>
            
           <HomePage/>
                </>
              } />
              <Route path="/album" element={<AlbumPage/>} />
              <Route path="/artistinfo" element={<ArtistPage/>} />
              <Route path="/search" element={<SearchPage/>} />
        </Routes>
       </div>
       
    </Router>
  )
}

export default App
