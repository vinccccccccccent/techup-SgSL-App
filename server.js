const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();

// ALLOW CORS --------------------
const cors = require('cors'); // Import the CORS package

// Configure CORS options to allow requests from your frontend domain
const corsOptions = {
    origin: 'https://sgsignintro.com/', // Replace this with your actual frontend URL
    optionsSuccessStatus: 200 // For compatibility with legacy browsers
};

// Use the CORS middleware with your specified options
app.use(cors(corsOptions));

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

// Function to fetch SgSL GIFs
async function fetchSgslGifs(phrase) {
  const sgslUrl = `https://blogs.ntu.edu.sg/sgslsignbank/word/?frm-word=${encodeURIComponent(phrase)}`;
  try {
    const sgslResponse = await axios.get(sgslUrl);
    const $ = cheerio.load(sgslResponse.data);
    const sgslGifUrls = [];

    $('img').each((_, element) => {
      const imgSrc = $(element).attr('src');
      if (imgSrc && imgSrc.endsWith('.gif')) {
        sgslGifUrls.push(imgSrc);
      }
    });

    if (sgslGifUrls.length > 0) {
      console.log(`SgSL GIFs found for "${phrase}":`, sgslGifUrls);
      return { source: 'SgSL', gifs: sgslGifUrls };
    }

    console.log(`No SgSL GIFs found for "${phrase}".`);
    return null;
  } catch (error) {
    console.error(`Error fetching SgSL GIFs for "${phrase}":`, error.message);
    return null;
  }
}

// Function to fetch ASL GIFs
async function fetchAslGif(phrase) {
  const aslGifUrlAnimation = `https://www.lifeprint.com/asl101/gifs-animated/${encodeURIComponent(phrase)}animation.gif`;
  const aslGifUrlDefault = `https://www.lifeprint.com/asl101/gifs-animated/${encodeURIComponent(phrase)}.gif`;

  try {
    const animationResponse = await axios.get(aslGifUrlAnimation, { validateStatus: false });
    if (animationResponse.status === 200) {
      console.log(`ASL GIF found: ${aslGifUrlAnimation}`);
      return { source: 'ASL', gifs: [aslGifUrlAnimation] };
    }

    const defaultResponse = await axios.get(aslGifUrlDefault, { validateStatus: false });
    if (defaultResponse.status === 200) {
      console.log(`ASL GIF found: ${aslGifUrlDefault}`);
      return { source: 'ASL', gifs: [aslGifUrlDefault] };
    }

    console.log(`No ASL GIF found for "${phrase}".`);
    return null;
  } catch (error) {
    console.error(`Error fetching ASL GIF for "${phrase}":`, error.message);
    return null;
  }
}

// Route to fetch sign language GIFs
app.get('/search', async (req, res) => {
  const phrase = req.query.phrase; // Get the search term
  console.log('Searching for:', phrase);

  try {
    // Attempt to fetch SgSL GIFs
    let gifData = await fetchSgslGifs(phrase);

    // If no SgSL GIFs found, fallback to ASL
    if (!gifData) {
      console.log(`Falling back to ASL for "${phrase}".`);
      gifData = await fetchAslGif(phrase);
    }

    // If no GIFs found at all, return 404
    if (!gifData) {
      return res.status(404).json({ error: `No sign found for "${phrase}" in SgSL or ASL.` });
    }

    // Return GIF data
    return res.json(gifData);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Error fetching sign language resources.' });
  }
});

// About page route
app.get('/about', (req, res) => {
  res.render('about');
});

// Tips page route
app.get('/tips', (req, res) => {
  res.render('tips');
});

// Start the server
const PORT = process.env.PORT || 8807;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


















/*
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();

// ALLOW CORS --------------------
const cors = require('cors'); // Import the CORS package

// Configure CORS options to allow requests from your frontend domain
const corsOptions = {
    origin: 'https://sgsignintro.com/', // Replace this with your actual frontend URL
    optionsSuccessStatus: 200 // For compatibility with legacy browsers
};

// // Use the CORS middleware with your specified options
app.use(cors(corsOptions));

//---------------------

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
  console.log('searching...', phrase)
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
const PORT = process.env.PORT || 8807;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
*/