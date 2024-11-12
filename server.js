const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();

// Serve static files from the 'public' folder (for CSS, JavaScript, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory
app.set('views', path.join(__dirname, 'views/pages')); // Tells Express to look in the 'views/pages' directory

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Route to render the main page (removes redundancy)
app.get('/', (req, res) => {
  res.render('app'); // Renders 'views/pages/app.ejs'
});

// Route to fetch sign language GIFs based on the search phrase
app.get('/search', async (req, res) => {
    const phrase = req.query.phrase;  // Get the phrase from the query string
    const url = `https://blogs.ntu.edu.sg/sgslsignbank/word/?frm-word=${encodeURIComponent(phrase)}`;

    try {
        // Fetch the page HTML using axios
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);  // Load the HTML into cheerio

        // Extract the GIF URL(s) from the page
        const gifUrls = [];
        $('img').each((index, element) => {
            const imgSrc = $(element).attr('src');
            if (imgSrc && imgSrc.endsWith('.gif')) {  // Only select GIFs
                gifUrls.push(imgSrc);
            }
        });

        // Return the GIF URLs as a JSON response
        res.json(gifUrls);
    } catch (error) {
        console.error('Error fetching or parsing page:', error);
        res.status(500).json({ error: 'Error fetching the sign language page' });
    }
});

// Route to the About page (correct path)
app.get('/about', (req, res) => {
  res.render('about'); // Renders 'views/pages/about.ejs'
});

// Route to the Tips page (correct path)
app.get('/tips', (req, res) => {
  res.render('tips'); // Renders 'views/pages/tips.ejs'
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});









/*
//OLD JAVASCRIPT


const express = require('express');
const path = require('path');

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the main page
app.get('/', (req, res) => {
    res.render('app'); // Renders app.ejs
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()

// Needed for EJS
app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();





// Main landing page
app.get('/', async function(req, res) {

    // Try-Catch for any errors
    try {
        // Get all blog posts
        const blogs = await prisma.post.findMany({
                orderBy: [
                  {
                    id: 'desc'
                  }
                ]
        });

        // Render the homepage with all the blog posts
        await res.render('pages/app', { blogs: app });
      } catch (error) {
        res.render('pages/app');
        console.log(error);
      } 
});

// About page
app.get('/about', function(req, res) {
    res.render('pages/about');
});


// About page
app.get('/about', function(req, res) {
  res.render('pages/about');
});


app.get('/tips', function(req, res) {
  res.render('pages/tips');
});



// New post page
app.get('/new', function(req, res) {
    res.render('pages/new');
});

// Create a new post
app.post('/new', async function(req, res) {
    
    // Try-Catch for any errors
    try {
        // Get the title and content from submitted form
        const { title, content } = req.body;

        // Reload page if empty title or content
        if (!title || !content) {
            console.log("Unable to create new post, no title or content");
            res.render('pages/new');
        } else {
            // Create post and store in database
            const blog = await prisma.post.create({
                data: { title, content },
            });

            // Redirect back to the homepage
            res.redirect('/');
        }
      } catch (error) {
        console.log(error);
        res.render('pages/new');
      }

});

// Delete a post by id
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.post.delete({
            where: { id: parseInt(id) },
        });
      
        // Redirect back to the homepage
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
  });

// Tells the app which port to run on
app.listen(8081);

// Main landing page
app.get('/', async function(req, res) {

  // Try-Catch for any errors
  try {
      // Get all blog posts
      const app = await prisma.post.findMany({
              orderBy: [
                {
                  id: 'desc'
                }
              ]
      });

      // Render the homepage with all the blog posts
      await res.render('pages/app', { apps: app });
    } catch (error) {
      res.render('pages/app');
      console.log(error);
    } 
});





// About page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.get('/blog', function(req, res) {
  res.render('pages/blog');
});
app.get('/app', function(req, res) {
  res.render('pages/app');
});

// New post page
app.get('/new', function(req, res) {
  res.render('pages/new');
});


// Create a new post
app.post('/new', async function(req, res) {
    
  // Try-Catch for any errors
  try {
      // Get the title and content from submitted form
      const { title, content } = req.body;

      // Reload page if empty title or content
      if (!title || !content) {
          console.log("Unable to create new post, no title or content");
          res.render('pages/new');
      } else {
          // Create post and store in database
          const blog = await prisma.post.create({
              data: { title, content },
          });

          // Redirect back to the homepage
          res.redirect('/');
      }
    } catch (error) {
      console.log(error);
      res.render('pages/new');
    }

});

// Delete a post by id
app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
      await prisma.post.delete({
          where: { id: parseInt(id) },
      });
    
      // Redirect back to the homepage
      res.redirect('/');
  } catch (error) {
      console.log(error);
      res.redirect('/');
  }
});





// New post page
app.get('/new', function(req, res) {
  res.render('pages/new');
});


/*
//NEW --------------------------------------------------------------------
//NEW --------------------------------------------------------------------
//NEW --------------------------------------------------------------------
//NEW --------------------------------------------------------------------

//NEW JAVASCRIPT

// Attach an event listener to the 'Search' button
document.getElementById('search-button').addEventListener('click', async function() {
  const phraseInput = document.getElementById('phrase-input').value; // Get the text from the input box
  const words = phraseInput.trim().toLowerCase().split(" "); // Split input into individual words
  const videoSection = document.getElementById('video-section'); // Reference to the section where GIFs will be displayed

  // Clear any previously displayed GIFs
  videoSection.innerHTML = "";

  // Loop over each word to fetch the corresponding GIF
  for (let word of words) {
      const gifUrl = await fetchGifUrl(word); // Fetch the GIF URL for each word
      if (gifUrl) {
          displayGif(gifUrl); // If a GIF is found, display it
      } else {
          console.log(`No GIF found for: ${word}`); // Log if no GIF is found for a word
      }
  }
});

// Function to construct and return the GIF URL for a specific word
async function fetchGifUrl(word) {
  // Construct the URL for the specific sign page on the NTU Sign Bank
  const pageUrl = `https://blogs.ntu.edu.sg/sgslsignbank/signs/${word}`;

  try {
      // Fetch the HTML content of the sign's webpage
      const response = await fetch(pageUrl);
      const htmlText = await response.text();

      // Parse the HTML to find the GIF URL
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      // Select the GIF element (adjust the selector based on the actual HTML structure)
      const gifElement = doc.querySelector('img'); // Assuming the GIF is an <img> element

      // If GIF element exists, return its URL
      return gifElement ? gifElement.src : null;
  } catch (error) {
      console.error(`Error fetching GIF for ${word}:`, error);
      return null; // Return null if there was an error fetching the GIF
  }
}

// Function to display a GIF on the webpage
function displayGif(gifUrl) {
  const videoSection = document.getElementById('video-section'); // Reference to the section for displaying GIFs
  const img = document.createElement('img'); // Create a new image element
  img.src = gifUrl; // Set the image source to the GIF URL
  img.alt = "Sign Language GIF"; // Set alternative text for accessibility
  img.style.width = "150px"; // Set width for consistent display (adjust as needed)
  img.style.margin = "10px"; // Add some spacing between images
  videoSection.appendChild(img); // Add the image to the display section
}


*/





















