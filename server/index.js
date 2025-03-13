const express = require("express");
const cors = require("cors");
const axios = require("axios");


const key = 'a81ccad081msh41f4642cf1ef463p1c9ec9jsn4516e909bc8f'
const app = express();

app.use(cors({
    origin: ['http://localhost:5173','http://3.144.97.232'], // Allow your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
  }));

app.get("/api/search", async (req, res) => { 
  const query = req.query.q?.toLowerCase() || "";
  const options = {
    method: "GET",
    url: "https://spotify23.p.rapidapi.com/search/",
    params: {
      q: query,
      type: "albums, artists",
      offset: "0",
      limit: "20",
      numberOfTopResults: "20",
    },
    headers: {
        'x-rapidapi-key': key,
        'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.json(response.data); // Send the API response to the frontend
    
  } catch (error) {
    console.error(error);
  }
});


// TOP ALBUMS GLOBAL

app.get("/api/topalbums", async (req, res) => {

  const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/playlist_tracks/',
    params: {
      id: '37i9dQZEVXbKCOlAmDpukL',
      offset: '0',
      limit: '100'
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
  };

try {
  const response = await axios.request(options);
  console.log(response.data);
  res.json(response.data); // Send the API response to the frontend
  
} catch (error) {
  console.error(error);
}

});


// TOP SONGS GLOBAL
app.get("/api/topsongs", async (req, res) => {

  const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/playlist_tracks/',
    params: {
      id: '37i9dQZEVXbMDoHDwVN2tF',
      offset: '0',
      limit: '100'
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
  };

try {
  const response = await axios.request(options);
  console.log(response.data);
  res.json(response.data); // Send the API response to the frontend
  
} catch (error) {
  console.error(error);
}

});
//discography
// app.get("/api/discography", async (req, res) => {
//   const artistId = req.query.id; // Extract artist ID from query parameter
//   if (!artistId) {
//     return res.status(400).json({ error: "Artist ID is required" });
//   }

//   const options = {
//     method: 'GET',
//     url: 'https://spotify23.p.rapidapi.com/artist_overview/',
//     params: {
//       id: artistId,


//     },
//     headers: {
//       'x-rapidapi-key': key,
//       'x-rapidapi-host': 'spotify23.p.rapidapi.com'
//     }
//   };

// try {
//   const response = await axios.request(options);
//   console.log(response.data);
//   res.json(response.data); // Send the API response to the frontend
  
// } catch (error) {
//   console.error(error);
// }

// });




// NEW MUSIC
app.get("/api/newmusic", async (req, res) => {

  const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/playlist_tracks/',
    params: {
      id: '37i9dQZF1DWXJfnUiYjUKT',
      offset: '0',
      limit: '100'
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
  };

try {
  const response = await axios.request(options);
  console.log(response.data);
  res.json(response.data); // Send the API response to the frontend
  
} catch (error) {
  console.error(error);
}

});

app.get("/api/artistoverview", async (req, res) => {
  const artistId = req.query.id; // Extract artist ID from query parameter
  if (!artistId) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/artist_overview/',
    params: {
      id: artistId
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
  };

try {
  const response = await axios.request(options);
  console.log(response.data);
  res.json(response.data); // Send the API response to the frontend
  
} catch (error) {
  res.status(500).json({ error: "Failed to fetch data" });
}

});



app.get("/api/artistalbum", async (req, res) => {
  const artistId = req.query.id; // Extract artist ID from query parameter
  if (!artistId) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/artist_albums/',
    params: {
      id: artistId,
      offset: '0',
      limit: '100'
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
  };

try {
  const response = await axios.request(options);
  console.log(response.data);
  res.json(response.data); // Send the API response to the frontend
  
} catch (error) {
  res.status(500).json({ error: "Failed to fetch data" });
}

});

app.get("/api/album", async (req, res) => {
  const albumId = req.query.id; // Extract artist ID from query parameter
  if (!albumId) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/album_tracks/',
    params: {
      id: albumId,
      offset: '0',
      limit: '300'
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
  };

try {
  const response = await axios.request(options);
  console.log(response.data);
  res.json(response.data); // Send the API response to the frontend
  
} catch (error) {
  console.error(error);
}

});

app.get("/api/albummeta", async (req, res) => {
  const albumId = req.query.id; // Extract artist ID from query parameter
  if (!albumId) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/album_metadata/',
    params: {
      id: albumId
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
  };

try {
  const response = await axios.request(options);
  console.log(response.data);
  res.json(response.data); // Send the API response to the frontend
  
} catch (error) {
  console.error(error);
}

});

app.listen(4000,'0.0.0.0', () => {
  console.log("Server running");
});