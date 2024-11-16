
document.addEventListener('DOMContentLoaded', function() {
  const phraseInput = document.getElementById('phrase-input');
  const searchButton = document.getElementById('search-button');
  const signsContainer = document.getElementById('signs-container');
  const tokenizedWordsContainer = document.getElementById('tokenized-words'); // Container for tokenized words

  searchButton.addEventListener('click', async function() {
    const phrase = phraseInput.value.trim();
  
    if (phrase) {
      // Step 1: Normalize and Tokenize Input
      const normalizedPhrase = normalizeInput(phrase);
      const searchTerms = extractSearchTerms(normalizedPhrase);
      
      // Sanity Check 1: Display tokenized words
      displayTokenizedWords(searchTerms);
      
      
      // Step 2: Fetch and display GIFs for each word
      await fetchAndDisplayGifs(searchTerms);
    } else {
      alert('Please enter a phrase.');
    }
  });

  // Normalize input: Convert to lowercase and remove non-letter characters
  function normalizeInput(input) {
    return input
      .toLowerCase()
      .replace(/[^a-z\s%()20]/g, '')
  //    .trim();
  }

  // Tokenize input into individual words
  function extractSearchTerms(input) {
    return input.split(/\s+/); 
  }

  // Step 1: Display tokenized words (Sanity Check 1)
  function displayTokenizedWords(words) {
    tokenizedWordsContainer.innerHTML = ''; // Clear previous content
    
    // Join words with commas and display them
    const wordsText = words.join(', ');
    const wordsParagraph = document.createElement('p');
    wordsParagraph.textContent = wordsText;
    tokenizedWordsContainer.appendChild(wordsParagraph);
  }

  //-----------------------------------------------------------------------
  // Step 2: Fetch GIFs for each word

  async function fetchAndDisplayGifs(searchTerms) {
    signsContainer.innerHTML = ''; // Clear previous GIFs

    for (const term of searchTerms) {
      // const gifUrl = await fetchGifForWord(term);
     const response = await fetch(`https://ominous-train-4jwrpjpj6v4wc5jrq-8807.app.github.dev/search?phrase=${term}`) //change!!!!!!!!!
 //    const response = await fetch(`https://sgsignintro.com/search?phrase=${term}`)
      const gifUrl = (await response.json())[0]
      console.log('gifUrl: ', gifUrl)
      if (gifUrl) {
        displayGif(gifUrl, term); // Display GIF with word label (Sanity Check 2)
      } else {
        alert(`No sign found for the word: ${term}`);
      }
    }
  }

  // Parse HTML to find the GIF URL for each word
  function extractGifUrlFromHtml(htmlContent) {
    console.log('htmlContent: ', htmlContent);
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');

    console.log('doc: ', doc)
 

   const gifElement =  doc.querySelectorAll('[src$=".gif"]')
    
    return gifElement ? gifElement.src : null; // Return src attribute
  }

  //-----------------------------------------------------------------------
  // Step 3: Display the GIF with the word label (Sanity Check 2)
  function displayGif(gifUrl, word) {
    const gifContainer = document.createElement('div');
    gifContainer.classList.add('gif-container'); // Style container if needed
    
    const gifElement = document.createElement('img');
    gifElement.src = gifUrl;
    gifElement.alt = `Sign Language GIF for ${word}`;
    
    const wordLabel = document.createElement('p');
    wordLabel.textContent = `Signing for: ${word}`;
    
    gifContainer.appendChild(gifElement);
    gifContainer.appendChild(wordLabel); // Add word label below GIF
    
    signsContainer.appendChild(gifContainer); // Add GIF container to signs container
  }
});







/*
document.addEventListener('DOMContentLoaded', function() {
  const phraseInput = document.getElementById('phrase-input');
  const searchButton = document.getElementById('search-button');
  const signsContainer = document.getElementById('signs-container');
  const tokenizedWordsContainer = document.getElementById('tokenized-words'); // Container for tokenized words

  searchButton.addEventListener('click', async function() {
    const phrase = phraseInput.value.trim();
  
    if (phrase) {
      // Step 1: Normalize and Tokenize Input
      const normalizedPhrase = normalizeInput(phrase);
      const searchTerms = extractSearchTerms(normalizedPhrase);
      
      // Sanity Check 1: Display tokenized words
      displayTokenizedWords(searchTerms);
      
      
      // Step 2: Fetch and display GIFs for each word
      await fetchAndDisplayGifs(searchTerms);
    } else {
      alert('Please enter a phrase.');
    }
  });

  // Normalize input: Convert to lowercase and remove non-letter characters
  function normalizeInput(input) {
    return input
      .toLowerCase()
      .replace(/[^a-z\s%()20]/g, '')
  //    .trim();
  }

  // Tokenize input into individual words
  function extractSearchTerms(input) {
    return input.split(/\s+/); 
  }

  // Step 1: Display tokenized words (Sanity Check 1)
  function displayTokenizedWords(words) {
    tokenizedWordsContainer.innerHTML = ''; // Clear previous content
    
    // Join words with commas and display them
    const wordsText = words.join(', ');
    const wordsParagraph = document.createElement('p');
    wordsParagraph.textContent = wordsText;
    tokenizedWordsContainer.appendChild(wordsParagraph);
  }

  //-----------------------------------------------------------------------
  // Step 2: Fetch GIFs for each word

  async function fetchAndDisplayGifs(searchTerms) {
    signsContainer.innerHTML = ''; // Clear previous GIFs

    for (const term of searchTerms) {
      // const gifUrl = await fetchGifForWord(term);
 //    const response = await fetch(`https://ominous-train-4jwrpjpj6v4wc5jrq-8807.app.github.dev/search?phrase=${term}`) //change!!!!!!!!!
     const response = await fetch(`https://sgsignintro.com/search?phrase=${term}`)
      const gifUrl = (await response.json())[0]
      console.log('gifUrl: ', gifUrl)
      if (gifUrl) {
        displayGif(gifUrl, term); // Display GIF with word label (Sanity Check 2)
      } else {
        alert(`No sign found for the word: ${term}`);
      }
    }
  }

  // Fetch the GIF URL for each word from the NTU SgSL Sign Bank
  async function fetchGifForWord(word) {
    const url = `https://blogs.ntu.edu.sg/sgslsignbank/word/?frm-word=${encodeURIComponent(word)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Host: "blogs.ntu.edu.sg", "User-Agent": "test", }
      });
      const text = await response.text();
      
      // Extract GIF URL from the HTML response
      const gifUrl = extractGifUrlFromHtml(text);
      return gifUrl;
    } catch (error) {
      console.error(`Error fetching the GIF for ${word}:`, error);
      return null;
    }
  }

  // Parse HTML to find the GIF URL for each word
  function extractGifUrlFromHtml(htmlContent) {
    console.log('htmlContent: ', htmlContent);
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');

    console.log('doc: ', doc)
    
    // Construct dynamic selector based on the word and HTML structure
    // const gifElement = doc.evaluate(
    //   '/html/body/div[1]/div/div/div/article/div/div/div/div[2]/div/div/div/div/div[2]/div/div[2]/div[1]/img',
    //   doc,
    //   null,
    //   XPathResult.FIRST_ORDERED_NODE_TYPE,
    //   null
    // ).singleNodeValue;

   const gifElement =  doc.querySelectorAll('[src$=".gif"]')
    
    return gifElement ? gifElement.src : null; // Return src attribute
  }

  //-----------------------------------------------------------------------
  // Step 3: Display the GIF with the word label (Sanity Check 2)
  function displayGif(gifUrl, word) {
    const gifContainer = document.createElement('div');
    gifContainer.classList.add('gif-container'); // Style container if needed
    
    const gifElement = document.createElement('img');
    gifElement.src = gifUrl;
    gifElement.alt = `Sign Language GIF for ${word}`;
    
    const wordLabel = document.createElement('p');
    wordLabel.textContent = `Signing for: ${word}`;
    
    gifContainer.appendChild(gifElement);
    gifContainer.appendChild(wordLabel); // Add word label below GIF
    
    signsContainer.appendChild(gifContainer); // Add GIF container to signs container
  }
});

*/