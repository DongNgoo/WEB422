/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Lynne Ngo Student ID: 129432233 Date: 2025-01-19
*  Vercel Link: https://web-422-96to.vercel.app/
*
********************************************************************************/ 

let express = require('express');
let cors = require('cors');
require('dotenv').config();
const MoviesDB = require('./modules/moviesDB.js');
const db = new MoviesDB();

let app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "API Listening" });
});
// POST /api/movies
app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body)
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error adding new movie' });
      });
  });
  
  // GET /api/movies
  app.get('/api/movies', (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const title = req.query.title || ''; // default to an empty string
  
    db.getAllMovies(page, perPage, title)
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error getting movies' });
      });
  });
  
  // GET /api/movies/:id
  app.get('/api/movies/:id', (req, res) => {
  db.getMovieById(req.params.id)
    .then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ message: 'Movie not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error getting movie' });
    });
});
  
  // PUT /api/movies/:id
  app.put('/api/movies/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
  
    db.updateMovieById(data, id)
      .then(() => {
        res.status(204).json({ message: 'Movie updated successfully' });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error updating movie' });
      });
  });
  
  // DELETE /api/movies/:id
  app.delete('/api/movies/:id', (req, res) => {
    const id = req.params.id;
  
    db.deleteMovieById(id)
      .then(() => {
        res.status(204).json({ message: 'Movie deleted successfully' });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error deleting movie' });
      });
  });



const port = 3000;

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(port, () => {
        
        console.log(`Server listening on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
})
