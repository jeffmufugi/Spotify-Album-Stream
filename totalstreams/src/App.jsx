import { useState, useRef, useEffect } from 'react'
import SearchPage from './Search';
import AlbumPage from './AlbumPage';
import ArtistPage from './ArtistPage';
import HomePage from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ScrollToTop from './scroll.jsx';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 10, // Cache persists for 10 minutes
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
  },
});


function App() {
 

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
    <ScrollToTop />
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
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export default App
